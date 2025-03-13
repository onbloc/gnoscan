import React, {useMemo} from 'react';
import {useRouter} from '@/common/hooks/common/use-router';
import {isDesktop} from '@/common/hooks/use-media';
import {DetailsPageLayout} from '@/components/core/layout';
import Badge from '@/components/ui/badge';
import {DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import Text from '@/components/ui/text';
import Link from 'next/link';
import ShowLog from '@/components/ui/show-log';
import {TokenDetailDatatable} from '@/components/view/datatable';
import Tooltip from '@/components/ui/tooltip';
import IconTooltip from '@/assets/svgs/icon-tooltip.svg';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import styled from 'styled-components';
import mixins from '@/styles/mixins';
import {useToken} from '@/common/hooks/tokens/use-token';
import {useNetwork} from '@/common/hooks/use-network';
import {useUsername} from '@/common/hooks/account/use-username';
import {useTokenMeta} from '@/common/hooks/common/use-token-meta';
import {formatDisplayPackagePath, makeDisplayNumber} from '@/common/utils/string-util';
import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';
import {TokenDetailDatatablePage} from '@/components/view/datatable/token-detail/token-detail-page';

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on gno.land.
  </>
);

const TokenDetails = () => {
  const {isFetched: isFetchedUsername, getName} = useUsername();
  const {getUrlWithNetwork} = useNetwork();
  const {isCustomNetwork} = useNetworkProvider();
  const desktop = isDesktop();
  const router = useRouter();
  const {path} = router.query;
  const currentPath = Array.isArray(path) ? path.join('/').split('?')[0] : path?.toString();

  const {isFetched: isFetchedToken, summary, files} = useToken(currentPath);
  const {isFetchedGRC20Tokens, getTokenAmount} = useTokenMeta();

  const isFetched = useMemo(() => {
    return isFetchedToken && isFetchedUsername && isFetchedGRC20Tokens;
  }, [isFetchedToken, isFetchedUsername, isFetchedGRC20Tokens]);

  const displayTotalSupply = useMemo(() => {
    if (!isFetchedGRC20Tokens) {
      return '-';
    }
    return makeDisplayNumber(getTokenAmount(summary.packagePath, summary.totalSupply).value);
  }, [isFetchedGRC20Tokens, summary.packagePath, summary.totalSupply]);

  return (
    <DetailsPageLayout
      title={'Token Details'}
      visible={!isFetched}
      error={isFetched && summary?.packagePath === ''}
      keyword={`${currentPath}`}>
      {summary.packagePath && (
        <>
          <DataSection title="Summary">
            <DLWrap desktop={desktop}>
              <dt>Name</dt>
              <dd>
                <Badge>{summary.name}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Symbol</dt>
              <dd>
                <Badge>{summary.symbol}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Total Supply</dt>
              <dd>
                <Badge>{displayTotalSupply}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Decimals</dt>
              <dd>
                <Badge>{summary.decimals}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>
                Path
                <div className="tooltip-wrapper">
                  <Tooltip content={TOOLTIP_PACKAGE_PATH}>
                    <IconTooltip />
                  </Tooltip>
                </div>
              </dt>
              <dd>
                <Badge>
                  <Text type="p4" color="blue" className="username-text">
                    <StyledA
                      href={getUrlWithNetwork(`/realms/details?path=${summary.packagePath}`)}>
                      {formatDisplayPackagePath(summary.packagePath)}
                    </StyledA>
                  </Text>
                  <Tooltip
                    className="path-copy-tooltip"
                    content="Copied!"
                    trigger="click"
                    copyText={summary.packagePath}
                    width={85}>
                    <IconCopy className="svg-icon" />
                  </Tooltip>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Function Type(s)</dt>
              <dd className="function-wrapper">
                {summary.functions.map((functionName: string, index: number) => (
                  <Badge type="blue" key={index}>
                    <Text type="p4" color="white">
                      {functionName}
                    </Text>
                  </Badge>
                ))}
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Owner</dt>
              <dd>
                <Badge>
                  {summary.owner && summary.owner === 'genesis' ? (
                    <Text type="p4" color="blue" className="ellipsis">
                      {summary.owner}
                    </Text>
                  ) : (
                    <FitContentA>
                      <Link href={getUrlWithNetwork(`/accounts/${summary.owner}`)} passHref>
                        <Text type="p4" color="blue" className="ellipsis">
                          {getName(summary.owner) || summary.owner}
                        </Text>
                      </Link>
                    </FitContentA>
                  )}
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Holders</dt>
              <dd>
                <Badge>{summary.holders}</Badge>
              </dd>
            </DLWrap>
            {files && <ShowLog isTabLog={true} files={files} btnTextType="Logs" />}
          </DataSection>

          <DataSection title="Transactions">
            {currentPath && isCustomNetwork && <TokenDetailDatatable path={currentPath} />}
            {currentPath && !isCustomNetwork && <TokenDetailDatatablePage path={currentPath} />}
          </DataSection>
        </>
      )}
    </DetailsPageLayout>
  );
};

const StyledA = styled.a`
  ${mixins.flexbox('row', 'center', 'center')};
`;

export default TokenDetails;
