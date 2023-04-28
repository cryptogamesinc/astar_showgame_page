import React, { useState, useEffect } from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import type { WeightV2 } from '@polkadot/types/interfaces'
import { BN, BN_ONE } from "@polkadot/util";
import styles from '@/styles/Home.module.css'

type Psp37BaseUri = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;

    setPsp37BaseUri: (value: string)=> void;
  };

const GetPsp37BaseUri: React.FC<Psp37BaseUri> = ({ contract, address, gasLimit, setPsp37BaseUri }) => {

  const storageDepositLimit = null;
  async function getPsp37BaseUri () {

    if (contract !== null) {

      const { output }  = await contract.query.getBaseUri(address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        })
  
        console.log("output",output)
        const humanOutput = output?.toHuman();
        if (
          humanOutput &&
          typeof humanOutput === 'object' &&
          'Ok' in humanOutput 
        ) {
          let a = console.log("aaa",humanOutput?.Ok)
          setPsp37BaseUri(String(humanOutput?.Ok));
        }
        
      }
  }
  

  return (
    <>
      <button className={styles.rotatebutton} onClick={getPsp37BaseUri}>getPsp37BaseUri</button>
      

    </>
  );
};

export default GetPsp37BaseUri;