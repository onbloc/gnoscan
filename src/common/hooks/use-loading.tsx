import {loadingState} from '@/states/loading';
import {useEffect} from 'react';
import {useRecoilState, useResetRecoilState} from 'recoil';

interface Props {
  finished?: boolean;
}

const useLoading = (
  props?: Props,
): {
  loading: boolean;
  startLoading: () => void;
  finishLoading: () => void;
  clearLoading: () => void;
} => {
  const [loading, setLoading] = useRecoilState(loadingState);
  const clearLoadingState = useResetRecoilState(loadingState);

  useEffect(() => {
    if (props?.finished !== undefined) {
      setLoading(!props.finished);
    }
  }, [props?.finished]);

  const startLoading = () => {
    setLoading(true);
  };

  const finishLoading = () => {
    setLoading(false);
  };

  const clearLoading = () => {
    clearLoadingState();
  };

  return {
    loading,
    startLoading,
    finishLoading,
    clearLoading,
  };
};

export default useLoading;
