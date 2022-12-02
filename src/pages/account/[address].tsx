import React, {useEffect, useState} from 'react';
import {NextPage} from 'next';
import styled from 'styled-components';
import {eachMedia} from '@/common/hooks/use-media';
import axios from 'axios';
import {useRouter} from 'next/router';

interface Props {
  detail: any;
  txs: any;
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const addr = context.query.addr;
//   const detail = await fetch(`${server}/account/detail/${addr}`).then((r) =>
//     r.json()
//   );
//   const txs = await fetch(`${server}/account/txs/${addr}`).then((r) =>
//     r.json()
//   );
//   return {
//     props: {
//       detail,
//       txs,
//     },
//   };
// }

const Account: NextPage<Props> = () => {
  // const [page, setPage] = useState(0);
  // const [assets, setAssets] = useState<any[]>([]);
  const media = eachMedia();
  const router = useRouter();
  const {address} = router.query;

  // const viewMoreButtonClick = () => {
  //   if (assets.length === txs.txs.length) return;
  //   setPage((prev: number) => prev + 1);
  // };

  // useEffect(() => {
  //   console.log(detail);
  //   console.log(txs);
  //   if (!Boolean(txs?.txs?.length)) return;
  //   setPage(0);
  //   setAssets(() => paginate(txs?.txs, 20, 0)); // 기본 몇개 불러올지
  // }, [txs]);

  // useEffect(() => {
  //   if (page !== 0) {
  //     setAssets((prev: any[]) => {
  //       const v = paginate(txs?.txs, 20, page); // View More 눌렀을 떄 추가 구현
  //       return prev.concat(v);
  //     });
  //   }
  // }, [page]);

  // useEffect(() => console.log(detail), [detail]);

  return (
    <Wrapper>
      {/* <TitleWithBorder>Account Details</TitleWithBorder>
      <InfoBox>
        <Text large={[20, 500, 28]} small={[17, 500, 25]}>
          Address
        </Text>
        <GrayFullBox>
          <Text large={[17, 300, 23]} small={[13, 300, 19]} className="address">
            {detail?.address}
          </Text>
          <CopyBtn
            onClick={() => {
              navigator.clipboard.writeText(detail?.address);
            }}
          >
            <Icon name="copy" />
            <Text large={[15, 300, 23]} small={[13, 300, 19]}>
              Copy
            </Text>
          </CopyBtn>
        </GrayFullBox>
        <Text large={[20, 500, 26]} small={[17, 500, 25]}>
          Assets
        </Text>
        <AssetsBox>
          {detail?.assets &&
            detail.assets.map((v: any, i: number) => (
              <GrayHalfBox key={i}>
                <Text
                  large={[17, 500, 25]}
                  small={[13, 500, 19]}
                  className="left-text"
                >
                  <img src="/gnot-logo.png" />
                  {v.name}
                </Text>
                <Text large={[17, 300, 23]}>
                  <Text large={[17, 300, 23]}>
                    {decimalPoint(v.amount)[0]}
                    <DecimalSmall>
                      {decimalPoint(v.amount)[1]
                        ? `.${decimalPoint(v.amount)[1]}`
                        : ""}
                    </DecimalSmall>
                  </Text>
                </Text>
              </GrayHalfBox>
            ))}
        </AssetsBox>
      </InfoBox>
      {assets.length && txs?.txs ? (
        <DataTable title="Transactions" from="account" data={assets}>
          <ViewMoreBtn
            onClick={viewMoreButtonClick}
            disabled={assets.length === txs.txs.length}
          >
            <Text large={[15, 300, 20]} small={[13, 300, 20]}>
              View More Transactions
            </Text>
          </ViewMoreBtn>
        </DataTable>
      ) : (
        <></>
      )} */}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

// const DecimalSmall = styled.strong`
//   font-size: 13px;
// `;

// const ViewMoreBtn = styled(Button)`
//   ${({ theme }) => theme.mixins.flexbox("row", "center", "center")};
//   width: 357px;
//   height: 52px;
//   border-radius: 4px;
//   background-color: ${({ theme }) => theme.colors.neutral[7]};
//   margin: 32px auto 0px;
//   transition: background-color 0.4s ease;
//   :hover:not(:disabled) {
//     background-color: ${({ theme }) => theme.colors.neutral[6]};
//   }
//   :disabled {
//     opacity: 0.6;
//   }
//   @media ${({ theme }) => theme.device.small} {
//     width: 100%;
//   }
// `;

// const CopyBtn = styled(Button)`
//   ${({ theme }) => theme.mixins.flexbox("row", "center", "center")};
//   padding: 0px 16px;
//   height: 40px;
//   border: 1px solid ${({ theme }) => theme.colors.neutral[4]};
//   border-radius: 4px;
//   background-color: ${({ theme }) => theme.colors.neutral[6]};
//   gap: 10px;
//   transition: background-color 0.4s ease;
//   :hover {
//     background-color: ${({ theme }) => theme.colors.neutral[5]};
//   }
//   @media ${({ theme }) => theme.device.small} {
//     width: 100%;
//   }
// `;

// const Wrapper = styled.div`
//   ${({ theme }) => theme.mixins.flexbox("column", "center", "flex-start")};
//   overflow-y: auto;
//   overflow-x: hidden;
//   width: 100%;
//   max-width: 1280px;
//   height: 100%;
//   margin: 0 auto;
//   padding: 96px 0px;
//   flex: 1 0 auto;
//   @media ${({ theme }) => theme.device.small} {
//     margin-top: 64px;
//     padding: 32px 0px;
//   }
// `;

// const InfoBox = styled.div`
//   ${({ theme }) => theme.mixins.flexbox("column", "flex-start", "center")};
//   width: 100%;
//   padding: 48px 0px;
// `;

// const GrayBox = styled.div`
//   ${({ theme }) => theme.mixins.flexbox("row", "center", "space-between")};
//   background-color: ${({ theme }) => theme.colors.neutral[7]};
//   border-radius: 4px;
//   padding: 22px 24px;
//   margin-top: 16px;
//   height: 70px;
// `;

// const GrayFullBox = styled(GrayBox)`
//   width: 100%;
//   margin-bottom: 24px;
//   .address {
//     width: 100%;
//   }
//   @media ${({ theme }) => theme.device.small} {
//     ${({ theme }) =>
//       theme.mixins.flexbox("column", "flex-start", "space-between")};
//     height: auto;
//     gap: 10px;
//   }
// `;

// const AssetsBox = styled.div`
//   width: 100%;
//   @media ${({ theme }) => theme.device.small} {
//     flex-direction: column;
//   }
// `;

// const GrayHalfBox = styled(GrayBox)`
//   width: calc(50% - 8px);
//   display: inline-flex;
//   height: 70px;
//   &:nth-child(odd) {
//     margin-right: 8px;
//   }
//   &:nth-child(even) {
//     margin-left: 8px;
//   }
//   .amount {
//     margin-left: auto;
//   }
//   .left-text {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 16px;
//   }
//   @media ${({ theme }) => theme.device.small} {
//     width: 100%;
//     &:nth-child(odd) {
//       margin-right: 0px;
//     }
//     &:nth-child(even) {
//       margin-left: 0px;
//     }
//   }
// `;

export default Account;
function useQuery(
  arg0: string,
  arg1: () => Promise<any>,
  arg2: {select: (res: any) => {supply: any; exit: any; holders: any}},
): {data: any; isSuccess: any} {
  throw new Error('Function not implemented.');
}
