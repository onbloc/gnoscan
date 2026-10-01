import { ActivityListResponse } from "@/models/api/activity/activity-model";

// Token page's own Token Transfers tab has no in/out direction - Volume/Transfers
// (row.volume, row.transferCount, row.transfers) render instead.
export type GetTokenTransfersResponse = ActivityListResponse;
