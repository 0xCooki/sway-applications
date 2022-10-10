import type { BigNumberish } from 'fuels';
import { bn } from 'fuels';
import { useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

import { walletIndexAtom } from '../jotai';
import { txFeedback } from '../utils/feedback';
import { contractCheck } from '../utils/helpers';

import { useContract } from './useContract';
import { useWallet } from './useWallet';

interface UseTakePaymentProps {
  escrowId: BigNumberish;
}

export function useTakePayment({ escrowId }: UseTakePaymentProps) {
  const queryClient = useQueryClient();
  const wallet = useWallet();
  const walletIdx = useAtomValue(walletIndexAtom);
  const contract = useContract();
  const successMsg = 'Took payment successfully.';

  const mutation = useMutation(
    async () => {
      contractCheck(contract);

      const scope = await contract!.functions
        .return_deposit(escrowId)
        .txParams({
          gasPrice: bn(5),
          variableOutputs: 3,
        })
        .fundWithRequiredCoins();

      const response = await contract!.wallet?.sendTransaction(scope.transactionRequest);
      const result = await response?.waitForResult();

      return result;
    },
    {
      onSuccess: txFeedback(successMsg, handleSuccess),
      onError: handleError,
    }
  );

  function handleSuccess() {
    queryClient.invalidateQueries(['EscrowPage-balances', walletIdx]);
    queryClient.invalidateQueries(['SellerEscrows', wallet?.address.toHexString()]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleError(e: any) {
    const errors = e?.response?.errors;

    if (errors?.length) {
      if (errors[0].message === 'enough coins could not be found') {
        toast.error('Not enough balance in your wallet to deposit');
      } else {
        toast.error(errors[0].message);
      }
    } else {
      toast.error('Error when trying to deposit');
    }
  }

  return mutation;
}
