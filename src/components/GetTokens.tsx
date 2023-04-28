import React, { useState, useEffect } from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import type { WeightV2 } from '@polkadot/types/interfaces'
import { BN, BN_ONE } from "@polkadot/util";
import styles from '@/styles/Home.module.css'

type GetTokensProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;
    totalSupply: string;
    setOutputs: (value: string[]) => void;
  };

const GetTokens: React.FC<GetTokensProps> = ({ contract, address, gasLimit, totalSupply, setOutputs  }) => {

  const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
  const PROOFSIZE = new BN(1_000_000);
  const storageDepositLimit = null;

  async function get() {
    if (contract !== null && totalSupply !== null) {
      const newOutputs = [];
  
      type HumanOutputType = {
        Ok?: {
          Ok?: {
            U64?: string;
          };
        };
      };
  
      for (let i = 0; i < parseInt(totalSupply); i++) {
        const { output } = await contract.query['psp34Enumerable::ownersTokenByIndex'](
          address,
          {
            gasLimit: gasLimit,
            storageDepositLimit,
          },
          address,
          i
        );
  
        const humanOutput = output?.toHuman() as HumanOutputType;
        const value = humanOutput?.Ok?.Ok?.U64;
        if (value !== undefined) {
          newOutputs.push(value);
        }
      }
      setOutputs(newOutputs);
      console.log('newOutputs', newOutputs);
    }
  }

  return (
    <>
      <button className={styles.rotatebutton} onClick={get}>get Token Information</button>
    </>
  );
};

export default GetTokens;