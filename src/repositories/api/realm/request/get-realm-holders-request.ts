// path: GRC721 collection token ID or its realm path, e.g. gno.land/r/gnoswap/gnft.GNFT.0000000
export interface GetRealmHoldersRequest {
  path: string;

  cursor?: string;

  limit?: number;
}
