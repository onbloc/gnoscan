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

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gnoland.
  </>
);

const TokenDetails = () => {
  const {isFetched: isFetchedUsername, getName} = useUsername();
  const {getUrlWithNetwork} = useNetwork();
  const desktop = isDesktop();
  const router = useRouter();
  const {path} = router.query;
  const currentPath = Array.isArray(path) ? path.join('/').split('?')[0] : path?.toString();

  const {isFetched: isFetchedToken, summary, files} = useToken(currentPath);

  const isFetched = useMemo(() => {
    return isFetchedToken && isFetchedUsername;
  }, [isFetchedToken, isFetchedUsername]);

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
                <Badge>{summary.totalSupply}</Badge>
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
                      {summary.packagePath}
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
                    <Text type="p4" color="blue">
                      {summary.owner}
                    </Text>
                  ) : (
                    <Link href={getUrlWithNetwork(`/accounts/${summary.owner}`)} passHref>
                      <FitContentA>
                        <Text type="p4" color="blue">
                          {getName(summary.owner) || summary.owner}
                        </Text>
                      </FitContentA>
                    </Link>
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
            {currentPath && <TokenDetailDatatable path={currentPath} />}
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
