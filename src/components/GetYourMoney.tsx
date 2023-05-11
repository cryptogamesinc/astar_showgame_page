import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'

type GetYourMoneyProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;
    moneyNumber: number | null;
    setMoneyNumber:(value: number | null)=> void;
  };

const GetYourMoney: React.FC<GetYourMoneyProps> = ({ contract, address, gasLimit,moneyNumber, setMoneyNumber}) => {

  const storageDepositLimit = null;
  async function getYourMoney () {

    if (contract !== null && address !== "") {
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
          setMoneyNumber(Number(humanOutput?.Ok));
          console.log("humanOutput?.Ok",humanOutput?.Ok)
        }
    } else {
      alert("Connect your wallet and contract first");
    }
  }
  

  return (
    <>
      <div className={styles.container}>
      <button className={styles.rotatebutton} onClick={getYourMoney}>your Money</button>
      {moneyNumber && <span className={styles.moneyNumber}>{moneyNumber}</span>}
      </div>
    </>
  );
};

export default GetYourMoney;