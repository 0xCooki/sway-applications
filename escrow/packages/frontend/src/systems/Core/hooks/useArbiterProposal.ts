import type { BigNumberish } from 'fuels';
import { useQuery } from 'react-query';

import { useWallet } from './useWallet';

import { useContract } from './useContract';

export function useArbiterProposal(escrowId: BigNumberish) {
  const wallet = useWallet();
  const contract = useContract();

  const { data: arbiterProposal } = useQuery(
    ['ArbiterProposal', wallet?.address.toHexString(), escrowId.toString()],
    async () => {
      return contract && (await contract!.functions.arbiter_proposals(escrowId).get()).value;
    }
  );

  return arbiterProposal;
}