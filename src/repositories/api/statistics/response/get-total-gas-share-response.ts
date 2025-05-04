export interface GetTotalGasShareResponse {
  data: {
    range: string;
    series: {
      data: {
        date: string;
        gasUsed: string;
      }[];
      realm: string;
    }[];
  };
}
