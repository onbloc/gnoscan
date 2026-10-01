import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

export interface EventModel {
  blockHeight: number;
  caller: string;
  callerName: string;
  callerLabel?: string | null;
  callerLabelType?: ADDRESS_LABEL_TYPE | null;
  emit: {
    name: string;
    params: [
      {
        key: string;
        value: string;
      },
    ];
  };
  eventName: string;
  function: string;
  identifier: string;
  originCaller: string;
  originCallerLabel?: string | null;
  originCallerLabelType?: ADDRESS_LABEL_TYPE | null;
  realmPath: string;
  timestamp: string;
  txHash: string;
}
