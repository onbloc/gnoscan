import {NetworkState} from '@/states';
import {useRecoilState} from 'recoil';

export const useNetwork = () => {
  const [currentNetwork] = useRecoilState(NetworkState.currentNetwork);

  return {
    currentNetwork,
  };
};
