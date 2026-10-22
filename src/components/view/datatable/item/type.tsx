import Tooltip from "@/components/ui/tooltip";
import theme from "@/styles/theme";
import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Text from "@/components/ui/text";
import PathText from "@/components/ui/path-text/PathText";
import IconLink from "@/assets/svgs/icon-link.svg";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { DappLabel, FunctionRealmLabel, getFunctionRealmLabel } from "@/common/utils/transaction-list.utility";
import { useNetwork } from "@/common/hooks/use-network";
import { GNO_TOKEN_RESOURCE_BASE_URI } from "@/common/values/constant-value";
interface Props {
  type: string;
  func: string;
  packagePath?: string | null;
  msgNum?: number;
}

export const Type = ({ type, func, packagePath, msgNum }: Props) => {
  const renderTooltip = () => {
    return (
      <TooltipWrapper>
        <span className="title">{type}</span>
        {packagePath && packagePath !== null ? <span className="info">{stripGnoLandPrefix(packagePath)}</span> : <></>}
      </TooltipWrapper>
    );
  };

  const realmLabel = getFunctionRealmLabel(type, packagePath);

  return func ? (
    <Wrapper>
      <TypeWrapper>
        <Tooltip className={"ellipsis"} content={renderTooltip()}>
          <span className="function ellipsis">{func}</span>
        </Tooltip>
        {(msgNum || 0) > 0 && (
          <Text type="p4" color="reverse" margin="0px 0px 0px 8px">
            {`+${msgNum}`}
          </Text>
        )}
      </TypeWrapper>
      {realmLabel && <RealmLabel label={realmLabel} />}
    </Wrapper>
  ) : (
    <span>-</span>
  );
};

const RealmLabel = ({ label }: { label: FunctionRealmLabel }) => {
  const { getUrlWithNetwork } = useNetwork();

  if (label.kind === "text") {
    return (
      <LabelWrapper>
        <Text type="body1" color="tertiary">
          {label.text}
        </Text>
      </LabelWrapper>
    );
  }

  return (
    <LabelWrapper>
      {label.kind === "call" && label.dapp && <DappLink dapp={label.dapp} />}
      {label.kind === "deploy" && (
        <Text type="body1" color="tertiary">
          deploy
        </Text>
      )}
      {(label.kind === "deploy" || label.dapp) && (
        <Text type="body1" color="tertiary">
          ·
        </Text>
      )}
      <Link className="path" href={getUrlWithNetwork(`/realms/details?path=${label.packagePath}`)}>
        <PathText path={label.displayPath} />
      </Link>
    </LabelWrapper>
  );
};

const DappLink = ({ dapp }: { dapp: DappLabel }) => {
  // A logo that fails to load is left out instead of showing a broken image.
  const [logoFailed, setLogoFailed] = React.useState(false);

  return (
    <a className="dapp" href={dapp.url} target="_blank" rel="noreferrer">
      {!logoFailed && (
        <img
          className="dapp-logo"
          src={`${GNO_TOKEN_RESOURCE_BASE_URI}${dapp.logo}`}
          alt=""
          onError={() => setLogoFailed(true)}
        />
      )}
      <Text type="body1" color="reverse" className="dapp-name">
        {dapp.name}
      </Text>
      {/* Preserve scaling when SVGO strips the asset's viewBox. */}
      <IconLink className="icon-link" viewBox="0 0 16 16" aria-hidden="true" />
    </a>
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

  // The realm name matters more than the dApp name, so the name gives up its room first.
  .dapp {
    display: flex;
    flex-shrink: 100;
    min-width: 0;
    align-items: center;
    gap: 4px;
  }

  .dapp-name {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .dapp-logo {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    object-fit: contain;
  }

  .icon-link {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    * {
      stroke: ${({ theme }) => theme.colors.tertiary};
    }
  }

  .path {
    flex: 0 1 auto;
    min-width: 0;
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
