import { Button } from "@fuel-ui/react";
import { useEffect, useState } from "react";
import { useFuel } from "../hooks";

export const WalletState = () => {
  const [connected, setConnection] = useState("Connect");
  const fuel = useFuel();

  useEffect(() => {
    if (!fuel) return;

    async function main() {
      const isConnected = await fuel!.isConnected();
      if (!isConnected) {
        setConnection("Connect");
      } else {
        setConnection("Disconnect");
      }
    }
    main();
  }, [connected, fuel]);

  async function handleWalletConnection() {
    const isConnected = await fuel!.isConnected();
    if (!isConnected) {
      await fuel!.connect();
    } else {
      await fuel!.disconnect();
    }

    // trigger useEffect
    setConnection("");

    // User needs to refresh without this to be able to interact with the contract / UI
    window.location.reload();
  }

  return (
    <Button
      onPress={handleWalletConnection}
      variant="ghost"
      css={{ background: "$pink6", color: "pink", fontWeight: "$semibold" }}
    >
      {connected}
    </Button>
  );
};