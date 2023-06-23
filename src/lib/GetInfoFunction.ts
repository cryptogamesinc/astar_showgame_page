import React from "react";
import { ContractPromise } from "@polkadot/api-contract";
import styles from "@/styles/Home.module.css";
import tokenInfo from "@/lib/TokenInfo";

const storageDepositLimit = null;
export default async function getInfoFunction(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any,
  nftName: string,
  nftDescription: string,
  nftImageUri: string,
  setNftName: (value: string) => void,
  setNftDescription: (value: string) => void,
  setNftImageUri: (value: string) => void,
  flag: number
) {
  if (contract !== null && address !== "") {
    tokenInfo(
      contract,
      address,
      gasLimit,
      setNftName,
      setNftDescription,
      setNftImageUri,
      flag
    );
  } else {
    alert("Connect your wallet first");
  }
}
