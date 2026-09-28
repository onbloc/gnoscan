import React from "react";

import { DatatableOption } from "@/components/ui/datatable";
import { ActivityAmount, ActivityTransfer } from "@/models/api/activity/activity-model";
import { toActivityIdentifier } from "@/common/utils/activity.utility";
import { DatatableItem } from "..";
import { ActivityDetailTable } from "./activity-detail-wrapper";

interface Props {
  visible: boolean;
  txHash: string;
  transfers: ActivityTransfer[];
}

const renderAddress = (address: string) => (address ? <DatatableItem.Account address={address} /> : <span>-</span>);

/** Native/Token Transfers row expansion: Identifier / From / To / Amount / Source, in event order. */
export const ActivityTransfersDetail = ({ visible, txHash, transfers }: Props) => {
  const headers = React.useMemo(
    () => [
      DatatableOption.Builder.builder<ActivityTransfer>()
        .key("eventIndex")
        .name("Identifier")
        .width(190)
        .renderOption(eventIndex => <DatatableItem.EventId eventId={toActivityIdentifier(txHash, eventIndex)} />)
        .build(),
      DatatableOption.Builder.builder<ActivityTransfer>()
        .key("fromAddress")
        .name("From")
        .width(200)
        .colorName("blue")
        .renderOption(renderAddress)
        .build(),
      DatatableOption.Builder.builder<ActivityTransfer>()
        .key("toAddress")
        .name("To")
        .width(200)
        .colorName("blue")
        .renderOption(renderAddress)
        .build(),
      DatatableOption.Builder.builder<ActivityTransfer>()
        .key("amount")
        .name("Amount")
        .width(320)
        .renderOption((amount: ActivityAmount) => <DatatableItem.ActivityAmountStack amounts={[amount]} />)
        .build(),
      DatatableOption.Builder.builder<ActivityTransfer>()
        .key("source")
        .name("Source")
        .width(140)
        .renderOption(source => <span>{source}</span>)
        .build(),
    ],
    [txHash],
  );

  return <ActivityDetailTable visible={visible} headers={headers} datas={transfers} />;
};
