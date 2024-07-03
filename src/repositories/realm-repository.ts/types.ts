export interface IRealmRepository {
  getRealms(): Promise<any | null>;

  getRealm(realmPath: string): Promise<any>;

  getTokens(): Promise<any>;

  getToken(tokenPath: string): Promise<any>;
}
