import { NetworkClient } from "@/common/clients/network-client";
import { ApiGovernanceRepositoryImpl } from "./api-governance-repository-impl";

const get = jest.fn();
const repository = new ApiGovernanceRepositoryImpl({ get } as unknown as NetworkClient);

beforeEach(() => {
  get.mockReset();
  get.mockResolvedValue({ data: { data: { items: [], page: { hasNext: false, totalCount: 0 } } } });
});

it("encodes q and forwards proposal paging, status and server sort", async () => {
  await repository.getGovernanceProposals({
    page: 2,
    limit: 40,
    q: "#20 & @alice",
    sort: "status",
    order: "asc",
    status: "ACTIVE",
  });
  expect(get).toHaveBeenCalledWith({
    url: "governance/proposals?page=2&limit=40&q=%2320+%26+%40alice&sort=status&order=asc&status=ACTIVE",
  });
});

it("omits absent sort and order and returns the already extracted API data", async () => {
  const page = { items: [], page: { hasNext: false, totalCount: 0 } };
  await expect(repository.getGovernanceProposals({ page: 1 })).resolves.toEqual(page);
  expect(get).toHaveBeenCalledWith({ url: "governance/proposals?page=1" });
});

it("keeps the proposal id out of vote query parameters", async () => {
  await repository.getGovernanceProposalVotes({ id: "12", page: 3, limit: 40 });
  expect(get).toHaveBeenCalledWith({ url: "governance/proposals/12/votes?page=3&limit=40" });
});

it("forwards member sort without inventing a default direction", async () => {
  await repository.getGovernanceMembers({ sort: "tier", order: "desc", page: 2 });
  expect(get).toHaveBeenCalledWith({ url: "governance/members?sort=tier&order=desc&page=2" });
});

it.each([400, 404])("preserves a detail HTTP %s rejection", async status => {
  const error = Object.assign(new Error("Request failed"), { response: { status } });
  get.mockRejectedValueOnce(error);
  await expect(repository.getGovernanceProposal("12")).rejects.toBe(error);
});
