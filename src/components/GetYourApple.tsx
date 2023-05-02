import React, { useState, useEffect } from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import type { WeightV2 } from '@polkadot/types/interfaces'
import { BN, BN_ONE } from "@polkadot/util";
import styles from '@/styles/Home.module.css'

type GetYourAppleProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;
    setAppleNumber:(value: number | null)=> void;
  };

const GetYourApple: React.FC<GetYourAppleProps> = ({ contract, address, gasLimit,setAppleNumber}) => {

  const storageDepositLimit = null;
  async function getYourApple () {

    if (contract !== null) {

      const { output }  = await contract.query['multiAsset::getYourApple'](address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },address)
  
        console.log("output",output)
        const humanOutput = output?.toHuman();
        if (
          humanOutput &&
          typeof humanOutput === 'object' &&
          'Ok' in humanOutput 
        ) {
          setAppleNumber(Number(humanOutput?.Ok));
          console.log("humanOutput?.Ok",humanOutput?.Ok)
        }
      }
  }
  

  return (
    <>
      <button className={styles.rotatebutton} onClick={getYourApple}>your Apple</button>
      
      

    </>
  );
};

export default GetYourApple;