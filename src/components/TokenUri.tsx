import React, { useState, useEffect } from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import type { WeightV2 } from '@polkadot/types/interfaces'
import { BN, BN_ONE } from "@polkadot/util";
import styles from '@/styles/Home.module.css'

type TokenUriProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;

    setTokenUri: (value: string)=> void;
  };

const TokenUri: React.FC<TokenUriProps> = ({ contract, address, gasLimit, setTokenUri }) => {

  const storageDepositLimit = null;
  async function tokenUri () {

    if (contract !== null) {

      const { output }  = await contract.query['multiAsset::tokenUri'](address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },{u64:'2'})
  
        console.log("output",output)
        const humanOutput = output?.toHuman();
        if (
          humanOutput &&
          typeof humanOutput === 'object' &&
          'Ok' in humanOutput 
        ) {
          let a = console.log("aaa",humanOutput?.Ok)
          setTokenUri(String(humanOutput?.Ok));
        }
      }
  }
  

  return (
    <>
      <button className={styles.rotatebutton} onClick={tokenUri}>get Status</button>
      

    </>
  );
};

export default TokenUri;