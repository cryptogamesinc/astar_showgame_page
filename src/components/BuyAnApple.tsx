import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import getYourApple2 from "@/components/GetYourApple2";

type BuyAnAppleProps = {
    contract: ContractPromise | null;
    account: InjectedAccountWithMeta | null;
    gasLimit: any;
    setAppleNumber: (value: number | null) => void;
};

const BuyAnApple: React.FC<BuyAnAppleProps> = ({ contract, account, gasLimit, setAppleNumber }) => {

const storageDepositLimit = null;

async function buyAnApple () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);
      await contract.tx['multiAsset::buyAnApple'](
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        }, account.address).signAndSend(account.address, { signer: injector.signer }, async ({ status }) => {

          if (status.isInBlock) {
              console.log(`Completed at block hash #${status.asInBlock.toString()}`);
              await getYourApple2(contract, account.address, gasLimit, setAppleNumber);
              
          } else {
              console.log(`Current status: ${status.type}`);
              console.log(`Current status: ${status.hash.toString()}`);
          }
        }).catch((error: any) => {
            console.log(':( transaction failed', error);
        });
    }
  }

return (
    <>
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={buyAnApple}>buyAnApple</button>
    </>
);
};

export default BuyAnApple;