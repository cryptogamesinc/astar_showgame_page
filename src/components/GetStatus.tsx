import React, { useState, useEffect } from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import type { WeightV2 } from '@polkadot/types/interfaces'
import { BN, BN_ONE } from "@polkadot/util";
import styles from '@/styles/Home.module.css'

type GetStatusProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;
    hungryStatus:string | number | null;
    healthStatus:string | number | null;
    happyStatus:string | number | null;
    setHungryStatus: (value: string | number | null) => void;
    setHealthStatus: (value: string | number | null) => void;
    setHappyStatus: (value: string | number | null) => void;
    token_number:number | null;
  };

const GetStatus: React.FC<GetStatusProps> = ({ contract, address, gasLimit, hungryStatus,healthStatus, happyStatus, setHungryStatus, setHealthStatus, setHappyStatus, token_number }) => {

  const storageDepositLimit = null;
  async function getStatus () {

    if (contract !== null && token_number!== null) {

      const { output , result}  = await contract.query['multiAsset::getStatus'](address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },{u64:token_number.toString()})
  
      console.log("output",output);
      console.log("result",result);
      const humanOutput = output?.toHuman();
      console.log("humanOutput",humanOutput);

      if (typeof humanOutput === 'object' && humanOutput !== null && 'Ok' in humanOutput) {
        const okObject = humanOutput.Ok;
        // 設定されていない場合
        if (okObject === null) {
          setHungryStatus(null);
          setHealthStatus(null);
          setHappyStatus(null);
        }
        if (typeof okObject === 'object' && okObject !== null && 'hungry' in okObject && 'health' in okObject && 'happy' in okObject) {
          const hungryValue = okObject.hungry;
          const healthValue = okObject.health;
          const happyValue = okObject.happy;
        
          // hungryValue が string または number であることを確認
          if ((typeof hungryValue === 'string' || typeof hungryValue === 'number') && 
              (typeof healthValue === 'string' || typeof healthValue === 'number') &&
              (typeof happyValue === 'string' || typeof happyValue === 'number')
            ){
            console.log("hungryValue", hungryValue);
        
            // setStatus を使って hungryValue を保存
            setHungryStatus(hungryValue);
            setHealthStatus(healthValue);
            setHappyStatus(happyValue);
          } 
        }
      }
    }
  }
  

  return (
    <>
      <button className={styles.rotatebutton} onClick={getStatus}>get Status</button>
            {hungryStatus && <p style={{marginBottom: "20px"}}>Status: {hungryStatus}</p>}
            {healthStatus && <p style={{marginBottom: "20px"}}>healthStatus: {healthStatus}</p>}
            {happyStatus && <p style={{marginBottom: "20px"}}>happyStatus: {happyStatus}</p>}

    </>
  );
};

export default GetStatus;