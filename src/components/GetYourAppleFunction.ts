import React, { useEffect } from "react";
import { ContractPromise } from "@polkadot/api-contract";

const storageDepositLimit = null;

export default async function getYourAppleFunction(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any,
  setAppleNumber: (value: number | null) => void
) {
  if (contract !== null) {
    const { output } = await contract.query["multiAsset::getYourApple"](
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
      console.log("humanOutput?.Ok", humanOutput?.Ok);
      setAppleNumber(Number(humanOutput?.Ok));
    }
  }
}
