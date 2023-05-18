import React from "react";
import { ContractPromise } from "@polkadot/api-contract";

const storageDepositLimit = null;
export default async function getYourBalance2(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any,
  setYourBalance: (value: number | null) => void
) {
  if (contract !== null && address !== "") {
    const { output } = await contract.query["psp22::balanceOf"](
      address,
      {
        gasLimit: gasLimit,
        storageDepositLimit,
      },
      address
    );

    console.log("output", output);
    const humanOutput = output?.toHuman();
    if (
      humanOutput &&
      typeof humanOutput === "object" &&
      "Ok" in humanOutput &&
      humanOutput.Ok &&
      typeof humanOutput.Ok === "string"
    ) {
      const yourBalance = Number(humanOutput?.Ok.replace(/,/g, ""));
      setYourBalance(yourBalance);
    }
  } else {
    alert("Connect your wallet and contract first");
  }
}
