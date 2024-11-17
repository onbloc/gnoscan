import {NodeRPCClient} from '@/common/clients/node-client';
import {IChainRepository, TokenSupplyInfo, ValidatorInfo} from './types';

import ValidatorPortalLoopData from '../../assets/meta/portal-loop/validators.json';
import ValidatorTest4Data from '../../assets/meta/test4/validators.json';

export class ChainRepository implements IChainRepository {
  constructor(private nodeRPCClient: NodeRPCClient | null) {}

  async getTokenSupply(): Promise<TokenSupplyInfo> {
    return {
      totalSupplyAmount: 1_000_000_000_000_000,
      airdropSupplyAmount: 700_000_000_000_000,
      airdropHolder: 656_740,
    };
  }

  async getValidators(height: number): Promise<string[]> {
    if (!this.nodeRPCClient) {
      return [];
    }

    return this.nodeRPCClient
      .validators(height)
      .then(response => response.validators.map(v => v.address));
  }

  async getValidatorInfos(chainId: string): Promise<ValidatorInfo[]> {
    if (chainId === 'portal-loop') {
      return ValidatorPortalLoopData;
    }
    if (chainId === 'test4') {
      return ValidatorTest4Data;
    }
    return [];
  }
}
