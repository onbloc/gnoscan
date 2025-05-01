import { NetworkClient } from "@/common/clients/network-client";
import { ApiRealmRepository } from "./api-realm-repository";

export class ApiRealmRepositoryImpl implements ApiRealmRepository {
  private networkClient: NetworkClient | null;
  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }
}
