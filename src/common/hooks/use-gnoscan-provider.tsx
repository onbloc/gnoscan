import {GnoscanContext} from '@/providers/gnoscan-provider';
import {useContext} from 'react';

export const useGnoscanProvider = () => {
  const context = useContext(GnoscanContext);
  if (context === null) {
    throw new Error('FAILED_INITIALIZE_PROVIDER');
  }
  return context;
};
