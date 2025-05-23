export interface GetAccountEventsResponse {
  items: {
    blockHeight: number;
    caller: string;
    callerName: string;
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
  }[];

  page: {
    cursor: string;
    hasNext: boolean;
  };
}
