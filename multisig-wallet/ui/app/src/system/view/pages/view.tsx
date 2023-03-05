import { BoxCentered, Button, Flex, Heading, Input, Stack, Text, toast } from "@fuel-ui/react";
import { useContract } from "../../core/hooks";
import { ContractIdInput } from "../../../contracts/MultisigContractAbi";

export function ViewPage() {
    const { contract, isLoading, isError } = useContract()

    async function getBalance() {
        const asset = document.querySelector<HTMLInputElement>(
            `[name="view-asset"]`
        )!.value;

        let assetId: ContractIdInput = {
            value: asset
        } 

        const { value } = await contract!.functions.balance(assetId).get();
        toast.success(`Balance: ${value}`, { duration: 10000 });
    }

    async function getNonce() {
        const { value } = await contract!.functions.nonce().get();
        toast.success(`Current nonce: ${value}`, { duration: 10000 });
    }

    async function getWeight() {
        const user = document.querySelector<HTMLInputElement>(
            `[name="user-weight"]`
        )!.value;

        const { value } = await contract!.functions.approval_weight(user).get();
        toast.success(`User weight: ${value}`, { duration: 10000 });
    }

    async function getThreshold() {
        const { value } = await contract!.functions.threshold().get();
        toast.success(`Threshold: ${value}`, { duration: 10000 });
    }

    return (
        <BoxCentered css={{ marginTop: "12%", width: "30%" }}>

            <Stack css={{ minWidth: "100%" }}>

                <Stack>
                    <Heading as="h3" css={{ marginLeft: "auto", marginRight: "auto", color: "$accent1" }}>
                        Check user approval weight
                    </Heading>

                    <Text color="blackA12">User address</Text>
                    <Input size="lg">
                        <Input.Field name="user-weight" placeholder="0x80d5e8c2be..." />
                    </Input>

                    <Button
                        color="accent"
                        onPress={getWeight}
                        size="lg"
                        variant="solid"
                    >
                        Get weight
                    </Button>
                </Stack>

                <Stack css={{ minWidth: "100%", marginTop: "$10" }}>

                    <Heading as="h3" css={{ marginLeft: "auto", marginRight: "auto", color: "$accent1" }}>
                        Check balance of asset
                    </Heading>

                    <Text color="blackA12">Asset id</Text>
                    <Input size="lg">
                        <Input.Field name="view-asset" placeholder="0x0000000000..." />
                    </Input>
                    <Button
                        color="accent"
                        onPress={getBalance}
                        size="lg"
                        variant="solid"
                    >
                        Get balance
                    </Button>
                </Stack>

                <Flex gap="$1" css={{ minWidth: "100%", marginTop: "$10" }}>
                    <Stack css={{ minWidth: "50%" }}>
                        <Heading as="h3" css={{ marginLeft: "auto", marginRight: "auto", marginTop: "$14", color: "$accent1" }}>
                            Check nonce
                        </Heading>

                        <Button
                            color="accent"
                            onPress={getNonce}
                            size="lg"
                            variant="solid"
                        >
                            Get nonce
                        </Button>
                    </Stack>

                    <Stack css={{ minWidth: "50%" }}>
                        <Heading as="h3" css={{ marginLeft: "auto", marginRight: "auto", marginTop: "$14", color: "$accent1" }}>
                            Check threshold
                        </Heading>

                        <Button
                            color="accent"
                            onPress={getThreshold}
                            size="lg"
                            variant="solid"
                        >
                            Get threshold
                        </Button>
                    </Stack>
                </Flex>

            </Stack>
            
        </BoxCentered>
    );
}
