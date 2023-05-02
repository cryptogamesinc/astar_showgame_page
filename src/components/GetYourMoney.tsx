import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'

type GetYourMoneyProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;
    setAppleNumber:(value: number | null)=> void;
  };

const GetYourMoney: React.FC<GetYourMoneyProps> = ({ contract, address, gasLimit,setAppleNumber}) => {

  const storageDepositLimit = null;
  async function getYourMoney () {

    if (contract !== null) {

      const { output }  = await contract.query['multiAsset::getYourMoney'](address,
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
      <button className={styles.rotatebutton} onClick={getYourMoney}>your Money</button>
      
      

    </>
  );
};

export default GetYourMoney;