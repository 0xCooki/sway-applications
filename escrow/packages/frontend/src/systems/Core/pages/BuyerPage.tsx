import { useAtomValue } from "jotai";
import { Flex, Card, Button } from "@fuel-ui/react";

import { Layout } from "../components/Layout";
import { ShowBalances } from "../components/ShowBalances";
import { showBalancesAtom } from "../jotai";
import { Deposit } from "../components/Deposit";
import { useBuyerEscrows } from "../hooks/useBuyerEscrows";
import { useContract } from "../hooks/useContract";
import { formatValue } from "../utils/helpers";
import { DECIMAL_PLACES } from "@/config";

export default function BuyerPage() {
  const showBalances = useAtomValue(showBalancesAtom);
  const buyerEscrows = useBuyerEscrows();
  const contract = useContract();

  return (
    <Layout>
      <Flex css={{ flexDirection: "row", justifyContent: "center" }}>
        <Card css={{ flex: "1", maxW: "900px", marginTop: "$5" }}>
          {(!!buyerEscrows && buyerEscrows.length > 0)
            ? <>
              <Card.Header>
                Buyer Escrows
              </Card.Header>
              <Card.Body>
                <div>{`Arbiter: ${!!buyerEscrows[0].arbiter.address.Address ? buyerEscrows[0].arbiter.address.Address?.value : buyerEscrows[0].arbiter.address.ContractId!.value}`}</div>
                <div>{`Arbiter Asset: ${buyerEscrows[0].arbiter.asset.value}`}</div>
                <div>{`Arbiter Fee: ${formatValue(buyerEscrows[0].arbiter.fee_amount, DECIMAL_PLACES)}`}</div>
                {buyerEscrows[0].assets.map((assetInfo) => {
                  return <>
                    <div>{`Asset Id: ${assetInfo.id.value}`}</div>
                    <div>{`Asset Amount: ${formatValue(assetInfo.amount, DECIMAL_PLACES)}`}</div>
                  </>
                })}
                <div>{`Buyer: ${!!buyerEscrows[0].buyer.address.Address ? buyerEscrows[0].buyer.address.Address?.value : buyerEscrows[0].buyer.address.ContractId?.value}`}</div>
                <div>{`Buyer Desposit Asset: ${!!buyerEscrows[0].buyer.asset.None ? "None" : buyerEscrows[0].buyer.asset.Some?.value}`}</div>
                <div>{`Buyer Deposit Amount: ${formatValue(buyerEscrows[0].buyer.deposited_amount, DECIMAL_PLACES)}`}</div>
                <div>{`Seller: ${!!buyerEscrows[0].seller.address.Address ? buyerEscrows[0].seller.address.Address?.value : buyerEscrows[0].seller.address.ContractId?.value}`}</div>
                <div>{`Deadline: ${buyerEscrows[0].deadline.toString()}`}</div>
                <div>{`Disputed: ${buyerEscrows[0].disputed}`}</div>
                <div>{`State: ${!!buyerEscrows[0].state.Pending ? "Pending" : "Completed"}`}</div>
              </Card.Body>

              <Card.Footer>
                <Deposit escrowId={BigInt(0)} />
              </Card.Footer>

              <Card.Footer justify="space-evenly">
                <Button>
                  Accept Arbiter
                </Button>
                <Button>
                  Transfer To Seller
                </Button>
                <Button>
                  Dispute
                </Button>
              </Card.Footer>

              <Card.Footer direction="row-reverse" gap="$4">
                <Button leftIcon="DotsThree">
                  Show all escrows
                </Button>
              </Card.Footer>
            </>
            : <>
              <Card.Header>
                Buyer Escrows
              </Card.Header>
              <Card.Body>
                Buyer has no Escrows
              </Card.Body>
            </>
          }

        </Card>
        {/* <Deposit /> */}
        {showBalances && <ShowBalances />}
      </Flex>
    </Layout>
  );
}
