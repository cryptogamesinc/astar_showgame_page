import getStatusFunction from "@/lib/GetStatusFunction";
import getInfoFunction from "@/lib/GetInfoFunction";
import React from "react";
import { ContractPromise } from "@polkadot/api-contract";
import styles from "@/styles/Home.module.css";
import ownersTokenByIndex from "@/lib/OwnersTokenByIndex";

const storageDepositLimit = null;
export default async function getStatusFunction2(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any,
  setHungryStatus: (value: string | number | null) => void,
  setHealthStatus: (value: string | number | null) => void,
  setHappyStatus: (value: string | number | null) => void,
  nftName: string,
  nftDescription: string,
  nftImageUri: string,
  setNftName: (value: string) => void,
  setNftDescription: (value: string) => void,
  setNftImageUri: (value: string) => void,
  flag: number
) {
  await getStatusFunction(
    contract,
    address,
    gasLimit,
    setHungryStatus,
    setHealthStatus,
    setHappyStatus
  );

  await getInfoFunction(
    contract,
    address,
    gasLimit,
    nftName,
    nftDescription,
    nftImageUri,
    setNftName,
    setNftDescription,
    setNftImageUri,
    flag
  );
}
