import React from "react";
import { isAxiosError } from "axios";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetGovernanceProposal, useGetGovernanceProposalVotes } from "@/common/react-query/governance/queries";
import ProposalLayout from "@/layouts/governance/ProposalLayout";
import { Message } from "@/layouts/governance/ProposalLayout.styles";
import ProposalDetail from "@/components/view/governance/proposal-detail";
import ProposalVotes from "@/components/view/governance/proposal-votes";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

const PAGE_SIZE = 40;

interface ProposalContainerProps {
  id: string;
  isReady?: boolean;
}

const StandardProposalContainer = ({ id, isReady = true }: ProposalContainerProps) => {
  const validId = /^\d+$/.test(id) && Number.isSafeInteger(Number(id));
  const proposalQuery = useGetGovernanceProposal(id, { enabled: isReady && validId });
  const [page, setPage] = useListPagination("governance-votes", id);
  const votesQuery = useGetGovernanceProposalVotes(
    { id, page, limit: PAGE_SIZE },
    { enabled: isReady && validId && proposalQuery.isSuccess },
  );
  const proposal = proposalQuery.data;
  const status = isAxiosError(proposalQuery.error) ? proposalQuery.error.response?.status : undefined;

  let content: React.ReactNode;
  if (isReady && (!validId || status === 400)) {
    content = <Message role="alert">Invalid proposal ID. Use a non-negative whole-number proposal ID.</Message>;
  } else if (status === 404) {
    content = <Message role="status">Proposal #{id} was not found.</Message>;
  } else if (proposalQuery.isError) {
    content = (
      <Message role="alert">
        Unable to load this proposal.
        <button type="button" onClick={() => proposalQuery.refetch()}>
          Try again
        </button>
      </Message>
    );
  } else if (!isReady || !proposal) {
    content = (
      <div role="status" aria-label="Loading proposal">
        <TableSkeleton />
      </div>
    );
  } else {
    content = (
      <>
        <ProposalDetail proposal={proposal} />
        <ProposalVotes
          votes={votesQuery.data?.items ?? []}
          totalCount={votesQuery.data?.page.totalCount}
          isLoading={votesQuery.isLoading}
          isError={votesQuery.isError}
          onRetry={() => {
            void votesQuery.refetch();
          }}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            totalCount: votesQuery.data?.page.totalCount,
            hasNext: votesQuery.data?.page.hasNext,
            isSettled: votesQuery.isSuccess && !votesQuery.isPreviousData,
            scope: id,
            onChangePage: setPage,
          }}
        />
      </>
    );
  }

  return (
    <ProposalLayout id={id} prevId={proposal?.prevId} nextId={proposal?.nextId}>
      {content}
    </ProposalLayout>
  );
};

const ProposalContainer = (props: ProposalContainerProps) => {
  const { isCustomNetwork, currentNetwork } = useNetworkProvider();
  if (isCustomNetwork) {
    return (
      <ProposalLayout id={props.id}>
        <Message role="status">Governance is not supported on custom networks.</Message>
      </ProposalLayout>
    );
  }

  return (
    <StandardProposalContainer key={`${currentNetwork?.chainId}:${currentNetwork?.apiUrl}:${props.id}`} {...props} />
  );
};

export default ProposalContainer;
