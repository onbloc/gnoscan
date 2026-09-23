import React from "react";

import { ActivityTransfer } from "@/models/api/activity/activity-model";
import { toDisplayAmount } from "@/common/utils/activity.utility";
import { DatatableItem } from "..";
import { ActivityDetailWrapper } from "./activity-detail-wrapper";

interface Props {
  visible: boolean;
  transfers: ActivityTransfer[];
}

/** Native/Token Transfers row expansion: From -> To, amount, and source, in event order. */
export const ActivityTransfersDetail = ({ visible, transfers }: Props) => {
  return (
    <ActivityDetailWrapper className={visible ? "active" : "hidden"}>
      {visible && (
        <div className="container">
          {transfers.length === 0 && <span className="empty">No transfers</span>}
          {transfers.map((transfer, index) => {
            const amount = toDisplayAmount(transfer.amount);
            return (
              <div className="entry" key={index}>
                <div className="entry-row">
                  {transfer.fromAddress ? <DatatableItem.Account address={transfer.fromAddress} /> : <span>-</span>}
                  <span className="entry-arrow">{"→"}</span>
                  {transfer.toAddress ? <DatatableItem.Account address={transfer.toAddress} /> : <span>-</span>}
                  <span className="badge">{transfer.source}</span>
                </div>
                <div className="entry-row">
                  <DatatableItem.Amount value={amount.value} denom={amount.denom} />
                  {amount.tokenIds && amount.tokenIds.length > 0 && (
                    <span className="entry-label">{`#${amount.tokenIds.join(", #")}`}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ActivityDetailWrapper>
  );
};
