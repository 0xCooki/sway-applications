import { useAtomValue } from 'jotai';
import type { UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';

import { walletIndexAtom } from '../jotai';

import { useWallet } from './useWallet';

export function useBalances(opts: UseQueryOptions = {}) {
  const walletIdx = useAtomValue(walletIndexAtom);
  const wallet = useWallet();
  return useQuery(
    ['EscrowPage-balances', walletIdx],
    async () => wallet?.getBalances(),
    opts as any // eslint-disable-line @typescript-eslint/no-explicit-any
  );
}
