import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'


type GetYourBalanceProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;
    yourBalance: number | null;
    setYourBalance:(value: number | null)=> void;
  };

const GetYourBalance: React.FC<GetYourBalanceProps> = ({ contract, address, gasLimit,yourBalance, setYourBalance}) => {

  const storageDepositLimit = null;
  async function getYourBalance () {

    if (contract !== null && address !== "") {
      const { output }  = await contract.query['psp22::balanceOf'](address,
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
          setYourBalance(yourBalance);
        }
    } else {
      alert("Connect your wallet and contract first");
    }
  }
  

  return (
    <>
      <div className={styles.container_number}>
      <button className={styles.rotatebutton} onClick={getYourBalance}>your Money</button>
      {yourBalance && <span className={styles.number}>{yourBalance}</span>}
      </div>
    </>
  );
};

export default GetYourBalance;