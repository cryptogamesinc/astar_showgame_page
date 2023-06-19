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
      const { output }  = await contract.query['getYourMoney'](address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },address)
  
        console.log("output",output)
        const humanOutput = output?.toHuman();
        if (
          humanOutput &&
          typeof humanOutput === 'object' &&
          'Ok' in humanOutput && humanOutput.Ok && typeof humanOutput.Ok === 'string'
        ) {
          const yourBalance = Number(humanOutput?.Ok.replace(/,/g, ''));
          setMoneyNumber(yourBalance);
        }
    } else {
      alert("Connect your wallet first");
    }
  }
  

  return (
    <>
      <div className={styles.container_number}>
      <div  className={styles.header_bottun} onClick={getYourMoney} style={{marginRight: "8px"}}>Point</div>
      {moneyNumber && <span className={styles.money_number}>{moneyNumber}</span>}
      </div>
    </>
  );
};

export default GetYourMoney;