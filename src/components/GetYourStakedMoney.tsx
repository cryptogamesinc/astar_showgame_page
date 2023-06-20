import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'

type GetYourStakedMoneyProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;
    stakedMoney:  number | null;
    setStakedMoney:(value: number | null)=> void;
  };

const GetYourStakedMoney: React.FC<GetYourStakedMoneyProps> = ({ contract, address, gasLimit, stakedMoney,  setStakedMoney}) => {

  const storageDepositLimit = null;
  async function getYourStakedMoney () {

    if (contract !== null && address !== "") {

      const { output }  = await contract.query['getYourStakedMoney'](address,
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
          setStakedMoney(yourBalance);
          console.log("humanOutput?.Ok",humanOutput?.Ok)
        }
    } else {
      alert("Connect your wallet first");
    }
  }
  

  return (
    <>
      <div className={styles.container_number}>
      <button className={styles.rotatebutton} onClick={getYourStakedMoney}>Staked</button>
      {stakedMoney && <span className={styles.number}>{stakedMoney}</span>}
      </div>
    </>
  );
};

export default GetYourStakedMoney;