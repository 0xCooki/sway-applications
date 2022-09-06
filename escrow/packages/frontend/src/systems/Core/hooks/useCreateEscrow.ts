import { useMutation } from "react-query";
import toast from 'react-hot-toast';

import { useContract } from "./useContract";
import { parseInputValueBigInt } from "../utils/math";
import { ArbiterInput, AssetInput, IdentityInput } from "@/types/contracts/EscrowAbi";
import { txFeedback } from "../utils/feedback";

interface UseCreateEscrowProps {
    arbiterFee: string;
    arbiterAddress: string;
    arbiterAsset: string;
    assets: {
        assetId: string;
        assetAmount: string;
    }[];
    buyerAddress: string;
    deadline: string;
}

export function useCreateEscrow({
    arbiterFee,
    arbiterAddress,
    arbiterAsset,
    assets,
    buyerAddress,
    deadline,
}: UseCreateEscrowProps) {
    const contract = useContract();
    const successMsg = "New escrow created.";

    const mutation = useMutation(
        async () => {
            if (!contract) {
                throw new Error('Contract not found');
            }

            // TODO make this more flexible for assets of arbitrary decimal precision
            const actualFee = parseInputValueBigInt(arbiterFee!);
            // TODO figure out how to get this to work with contract id too
            let arbiterArg: ArbiterInput = {
                address: { Address: { value: arbiterAddress } },
                asset: { value: arbiterAsset },
                fee_amount: actualFee,
            };
            // TODO make this more flexible when escrow takes an arbitrary amount of assets as input
            let assetsArg: [AssetInput, AssetInput] = [
                { amount: parseInputValueBigInt(assets[0].assetAmount), id: { value: assets[0].assetId } },
                { amount: parseInputValueBigInt(assets[1].assetAmount), id: { value: assets[1].assetId } }
            ];
            // TODO how to pass buyer as either an Address OR a ContractId?
            let buyerArg: IdentityInput = {
                Address: { value: buyerAddress }
            };
            const scope = await contract!.functions
                .create_escrow(arbiterArg, assetsArg, buyerArg, deadline)
                .callParams({
                    forward: [actualFee, arbiterAsset]
                })
                .txParams({
                    gasPrice: BigInt(5),
                    bytePrice: BigInt(5),
                    gasLimit: 100_000_000,
                })
                .fundWithRequiredCoins();
            console.log("tx req", scope.transactionRequest);
            const response = await contract!.wallet!.sendTransaction(scope.transactionRequest);
            const result = await response.waitForResult();

            return result;
        },
        {
            onSuccess: txFeedback(successMsg, handleSuccess),
            onError: handleError,
        }
    );

    function handleSuccess() {
        // TODO clear inputs from this hook
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleError(e: any) {
        const errors = e?.response?.errors;

        if (errors?.length) {
            if (errors[0].message === 'enough coins could not be found') {
                toast.error(
                    `Not enough balance in your wallet to create an escrow`
                );
            }
        } else {
            toast.error(`Error when trying to create an escrow`);
        }
    }

    return mutation;
}