import React from "react";
import { ContractPromise } from "@polkadot/api-contract";

const storageDepositLimit = null;
export default async function getYourStakedMoney2(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any,
  setStakedMoney: (value: number | null) => void
) {
  if (contract !== null && address !== "") {
    const { output } = await contract.query["multiAsset::getYourStakedMoney"](
      address,
      {
        gasLimit: gasLimit,
        storageDepositLimit,
      },
      address
    );

    console.log("output", output);
    const humanOutput = output?.toHuman();
    if (humanOutput && typeof humanOutput === "object" && "Ok" in humanOutput) {
      setStakedMoney(Number(humanOutput?.Ok));
      console.log("humanOutput?.Ok", humanOutput?.Ok);
    }
  } else {
    alert("Connect your wallet and contract first");
  }
}
