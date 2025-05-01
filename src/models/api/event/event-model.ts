export interface EventModel {
  blockHeight: number;
  caller: string;
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
  realmPath: string;
  timestamp: string;
  txHash: string;
}
