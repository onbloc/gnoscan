import Tooltip from "@/components/ui/tooltip";
import theme from "@/styles/theme";
import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Text from "@/components/ui/text";
import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import {
  DappLabel,
  FunctionRealmLabel,
  getFunctionRealmLabel,
  getMessageKind,
  getRunCalledRealms,
} from "@/common/utils/transaction-list.utility";
import { useGetTransactionContractsByHeight } from "@/common/react-query/transaction/api";
import { useNetwork } from "@/common/hooks/use-network";
import { GNO_TOKEN_RESOURCE_BASE_URI } from "@/common/values/constant-value";
interface Props {
  /** Message type from the API ("/vm.m_call") or a custom network mapper ("MsgCall"). */
  messageType: string;
  /** Function name shown in the chip, "-" is shown when empty. */
  functionName: string;
  packagePath?: string | null;
  /** Number of messages in the transaction, the ones after the first are shown as "+N". */
  messageCount?: number;
  /** Transaction hash, used to look up the realms a run message called. Only the standard network has it. */
  txHash?: string;
}

export const Type = ({ messageType, functionName, packagePath, messageCount = 0, txHash }: Props) => {
  const renderTooltip = () => {
    return (
      <TooltipWrapper>
        <span className="title">{messageType}</span>
        {packagePath ? <span className="info">{stripGnoLandPrefix(packagePath)}</span> : <></>}
      </TooltipWrapper>
    );
  };

  const realmLabel = getFunctionRealmLabel(messageType, packagePath ?? "");

  return functionName ? (
    <Wrapper>
      <TypeWrapper>
        <Tooltip className={"ellipsis"} content={renderTooltip()}>
          <span className="function ellipsis">{functionName}</span>
        </Tooltip>
        {messageCount > 1 && (
          <Text type="p4" color="reverse" margin="0px 0px 0px 8px">
            {`+${messageCount - 1}`}
          </Text>
        )}
      </TypeWrapper>
      {txHash && getMessageKind(messageType) === "run" ? (
        <RunRealmLabel txHash={txHash} fallback={realmLabel} />
      ) : (
        realmLabel && <RealmLabel label={realmLabel} />
      )}
    </Wrapper>
  ) : (
    <span>-</span>
  );
};

// The list API has no path for a run message, so the realms it called come from the transaction contracts.
const RunRealmLabel = ({ txHash, fallback }: { txHash: string; fallback?: FunctionRealmLabel }) => {
  // A confirmed transaction never changes, and the label is only a hint, so keep it and do not retry.
  const { data } = useGetTransactionContractsByHeight(
    { txHash },
    { staleTime: Infinity, cacheTime: Infinity, retry: false },
  );
  const realms = getRunCalledRealms(data?.pages.flatMap(page => page.items) ?? []);

  if (realms.length === 0) return fallback ? <RealmLabel label={fallback} /> : null;
  return <RealmLabel label={{ kind: "run", packagePath: realms[0], moreCount: realms.length - 1 }} />;
};

const RealmLabel = ({ label }: { label: FunctionRealmLabel }) => {
  const { getUrlWithNetwork } = useNetwork();

  if (label.kind === "text") {
    return (
      <LabelWrapper>
        <span className="kind">{label.text}</span>
      </LabelWrapper>
    );
  }

  const path = stripGnoLandPrefix(label.packagePath);
  const displayPath = formatDisplayPackagePath(path);

  return (
    <LabelWrapper>
      {label.kind === "call" && label.dapp && <DappLogo dapp={label.dapp} />}
      {(label.kind === "deploy" || label.kind === "run") && <span className="kind">{`${label.kind} ·`}</span>}
      {label.kind === "call" && label.dapp ? (
        <a className="path" href={label.dapp.url} target="_blank" rel="noreferrer" title={path}>
          {displayPath}
        </a>
      ) : (
        <Link className="path" href={getUrlWithNetwork(`/realms/details?path=${label.packagePath}`)} title={path}>
          {displayPath}
        </Link>
      )}
      {label.kind === "run" && label.moreCount > 0 && <span className="kind">{`+${label.moreCount}`}</span>}
    </LabelWrapper>
  );
};

const DappLogo = ({ dapp }: { dapp: DappLabel }) => {
  // A logo that fails to load is left out instead of showing a broken image.
  const [logoFailed, setLogoFailed] = React.useState(false);
  if (logoFailed) return null;

  return (
    <img
      className="dapp-logo"
      src={`${GNO_TOKEN_RESOURCE_BASE_URI}${dapp.logo}`}
      alt={dapp.name}
      title={dapp.name}
      onError={() => setLogoFailed(true)}
    />
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  min-width: 0;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
  white-space: nowrap;

  .dapp-logo {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    object-fit: contain;
  }

  .kind {
    flex-shrink: 0;
    ${theme.fonts.body1};
    color: ${({ theme }) => theme.colors.tertiary};
  }

  // Read from the namespace onward, so a path too long for the column is cut at its end.
  .path {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    ${theme.fonts.body1};
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const TypeWrapper = styled.div`
  & {
    display: flex;
    width: fit-content;
    max-width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;

    .function {
      display: block;
      width: 100%;
      padding: 4px 16px;
      color: #fff;
      background-color: ${({ theme }) => theme.colors.blue};
      border-radius: 4px;
    }
  }
`;

const TooltipWrapper = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;

    span {
      display: flex;
      width: 100%;
      ${theme.fonts.p4};
      justify-content: flex-start;
      align-items: center;
    }

    .title {
      color: ${({ theme }) => theme.colors.primary};
    }

    .info {
      width: 100%;
      height: fit-content;
      padding: 6px 10px;
      margin-top: 4px;
      color: ${({ theme }) => theme.colors.reverse};
      background-color: ${({ theme }) => theme.colors.pantone};
      border-radius: 4px;
    }
  }
`;
