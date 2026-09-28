import React from "react";

import { DatatableOption } from "@/components/ui/datatable";
import { ActivityMessage } from "@/models/api/activity/activity-model";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { toActivityIdentifier } from "@/common/utils/activity.utility";
import { DatatableItem } from "..";
import { ActivityDetailTable } from "./activity-detail-wrapper";

interface Props {
  visible: boolean;
  txHash: string;
  messages: ActivityMessage[];
}

/** Transactions row expansion: Identifier / Type / Function / Package / Args per message. */
export const ActivityMessagesDetail = ({ visible, txHash, messages }: Props) => {
  const headers = React.useMemo(
    () => [
      DatatableOption.Builder.builder<ActivityMessage>()
        .key("index")
        .name("Identifier")
        .width(190)
        .renderOption(index => <DatatableItem.EventId eventId={toActivityIdentifier(txHash, index)} />)
        .build(),
      DatatableOption.Builder.builder<ActivityMessage>()
        .key("messageType")
        .name("Type")
        .width(150)
        .renderOption(type => <span className="ellipsis">{type}</span>)
        .build(),
      DatatableOption.Builder.builder<ActivityMessage>()
        .key("funcType")
        .name("Function")
        .width(180)
        .renderOption(func => (func ? <DatatableItem.EventName eventName={func} /> : <span>-</span>))
        .build(),
      DatatableOption.Builder.builder<ActivityMessage>()
        .key("pkgPath")
        .name("Package")
        .width(240)
        .renderOption(pkgPath => {
          const path = stripGnoLandPrefix(pkgPath ?? "");
          return <DatatableItem.TruncatedText text={path} lines={[{ value: path }]} />;
        })
        .build(),
      DatatableOption.Builder.builder<ActivityMessage>()
        .key("args")
        .name("Args")
        .width(290)
        .renderOption((args: string[]) => (
          <DatatableItem.TruncatedText text={args.join(", ")} lines={args.map(value => ({ value }))} />
        ))
        .build(),
    ],
    [txHash],
  );

  return <ActivityDetailTable visible={visible} headers={headers} datas={messages} />;
};
