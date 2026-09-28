import React from "react";

import { DatatableOption } from "@/components/ui/datatable";
import { ActivityEvent } from "@/models/api/activity/activity-model";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { toActivityIdentifier } from "@/common/utils/activity.utility";
import { DatatableItem } from "..";
import { ActivityDetailTable } from "./activity-detail-wrapper";

interface Props {
  visible: boolean;
  txHash: string;
  events: ActivityEvent[];
}

/** Internal Transactions row expansion: Identifier / Event Type / Package / Attributes per realm event. */
export const ActivityRealmEventsDetail = ({ visible, txHash, events }: Props) => {
  const headers = React.useMemo(
    () => [
      DatatableOption.Builder.builder<ActivityEvent>()
        .key("eventIndex")
        .name("Identifier")
        .width(190)
        .renderOption(eventIndex => <DatatableItem.EventId eventId={toActivityIdentifier(txHash, eventIndex)} />)
        .build(),
      DatatableOption.Builder.builder<ActivityEvent>()
        .key("eventType")
        .name("Event Type")
        .width(180)
        .renderOption(eventType => <DatatableItem.EventName eventName={eventType} />)
        .build(),
      DatatableOption.Builder.builder<ActivityEvent>()
        .key("packagePath")
        .name("Package")
        .width(250)
        .renderOption(packagePath => {
          const path = stripGnoLandPrefix(packagePath ?? "");
          return <DatatableItem.TruncatedText text={path} lines={[{ value: path }]} />;
        })
        .build(),
      DatatableOption.Builder.builder<ActivityEvent>()
        .key("attributes")
        .name("Attributes")
        .width(430)
        .renderOption(attributes => <DatatableItem.EventAttributes attributes={attributes} />)
        .build(),
    ],
    [txHash],
  );

  return <ActivityDetailTable visible={visible} headers={headers} datas={events} />;
};
