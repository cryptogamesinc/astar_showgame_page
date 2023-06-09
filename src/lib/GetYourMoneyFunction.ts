import React from "react";
import { ContractPromise } from "@polkadot/api-contract";
import styles from "@/styles/Home.module.css";

const storageDepositLimit = null;
export default async function getYourMoneyFunction(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any,
  setMoneyNumber: (value: number | null) => void
) {
  if (contract !== null) {
    const { output } = await contract.query["getYourMoney"](
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
      setMoneyNumber(yourBalance);
      console.log("humanOutput?.Ok", humanOutput?.Ok);
    }
  }
}
