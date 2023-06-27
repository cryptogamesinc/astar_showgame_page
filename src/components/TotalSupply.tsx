import React, { useState, useEffect } from "react";
import { ContractPromise } from "@polkadot/api-contract";
import type { WeightV2 } from "@polkadot/types/interfaces";
import { BN, BN_ONE } from "@polkadot/util";
import styles from "@/styles/Home.module.css";

type TotalSupplyProps = {
  contract: ContractPromise | null;
  address: string;
  totalSupply: string;
  setTotalSupply: (value: string) => void;
};

const TotalSupply: React.FC<TotalSupplyProps> = ({
  contract,
  address,
  totalSupply,
  setTotalSupply,
}) => {
  // const [totalSupply, setTotalSupply] = useState('');

  const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
  const PROOFSIZE = new BN(1_000_000);
  const storageDepositLimit = null;

  async function getTotalSupply() {
    console.log("address", address);
    if (contract !== null) {
      const { output } = await contract.query["psp34::totalSupply"](address, {
        gasLimit: createGasLimit(MAX_CALL_WEIGHT),
        storageDepositLimit,
      });

      type TotalSupplyHumanOutputType = {
        Ok?: string | number;
      };

      const totalSupplyHumanOutput =
        output?.toHuman() as TotalSupplyHumanOutputType;
      console.log("totalSupplyHumanOutput");
      setTotalSupply(String(totalSupplyHumanOutput?.Ok) || "");
    }
  }

  function createGasLimit(refTime: number | BN) {
    const refTimeBN = refTime instanceof BN ? refTime : new BN(refTime);
    return contract?.api.registry.createType("WeightV2", {
      refTime: refTimeBN,
      proofSize: PROOFSIZE,
    }) as WeightV2;
  }

  return (
    <>
      <button className={styles.rotatebutton} onClick={getTotalSupply}>
        Get Total Supply
      </button>
      {totalSupply && <p>TotalSupply: {totalSupply}</p>}
    </>
  );
};

export default TotalSupply;
