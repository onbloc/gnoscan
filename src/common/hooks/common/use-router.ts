import {useRouter as useNextRouter} from 'next/router';

const maintainKeys = ['chainId', 'rpcUrl', 'indexerUrl'];

export const useRouter = () => {
  const {query, push, ...remain} = useNextRouter();

  const customPush = (path: string) => {
    const queryString = Object.entries(query)
      .map(entry =>
        maintainKeys.includes(entry[0]) && !!entry[1] ? `${entry[0]}=${entry[1]}` : '',
      )
      .filter(str => str.length > 0)
      .join('&');
    return push(queryString ? path + '?' + queryString : path);
  };

  return {
    ...remain,
    query,
    push: customPush,
  };
};
