import React from "react";
import { ContractPromise } from "@polkadot/api-contract";
import styles from "@/styles/Home.module.css";
import ownersTokenByIndex from "@/components/OwnersTokenByIndex";

const storageDepositLimit = null;
export default async function getStatusFunction(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any,
  setHungryStatus: (value: string | number | null) => void,
  setHealthStatus: (value: string | number | null) => void,
  setHappyStatus: (value: string | number | null) => void
) {
  if (contract !== null) {
    const token_number = await ownersTokenByIndex(contract, address, gasLimit);

    const { output, result } = await contract.query[
      "multiAsset::getCurrentStatus"
    ](
      address,
      {
        gasLimit: gasLimit,
        storageDepositLimit,
      },
      { u64: token_number }
    );

    const humanOutput = output?.toHuman();
    console.log("humanOutput", humanOutput);

    if (
      typeof humanOutput === "object" &&
      humanOutput !== null &&
      "Ok" in humanOutput
    ) {
      const okObject = humanOutput.Ok;
      // 設定されていない場合
      if (okObject === null) {
        setHungryStatus(0);
        setHealthStatus(0);
        setHappyStatus(0);
      }
      if (
        typeof okObject === "object" &&
        okObject !== null &&
        "hungry" in okObject &&
        "health" in okObject &&
        "happy" in okObject
      ) {
        const hungryValue = okObject.hungry;
        const healthValue = okObject.health;
        const happyValue = okObject.happy;

        // hungryValue が string または number であることを確認
        if (
          (typeof hungryValue === "string" ||
            typeof hungryValue === "number") &&
          (typeof healthValue === "string" ||
            typeof healthValue === "number") &&
          (typeof happyValue === "string" || typeof happyValue === "number")
        ) {
          console.log("hungryValue", hungryValue);
          setHungryStatus(hungryValue);
          setHealthStatus(healthValue);
          setHappyStatus(happyValue);
        }
      }
    }
  }
}
