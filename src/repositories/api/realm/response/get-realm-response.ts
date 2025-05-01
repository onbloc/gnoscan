export interface GetRealmResponse {
  data: {
    balance: string;
    blockPublished: number;
    contractCallCount: number;
    func: [
      {
        typesList: string;
        typesListUrl: string;
      },
    ];
    name: string;
    path: string;
    publisher: string;
    realmAddress: string;
    sourceFiles: [
      {
        content: string;
        filename: string;
      },
    ];
    totalUsedFees: string;
  };
  page: string;
}
