import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import ownersTokenByIndex from '@/components/OwnersTokenByIndex';
import getYourAppleFunction from "@/components/GetYourAppleFunction";
import getStatusFunction from "@/components/GetStatusFunction";

type EatAnAppleProps = {
    contract: ContractPromise | null;
    account: InjectedAccountWithMeta | null;
    gasLimit: any;
    setAppleNumber: (value: number | null) => void;
    setHungryStatus: (value: string | number | null) => void;
    setHealthStatus: (value: string | number | null) => void;
    setHappyStatus: (value: string | number | null) => void;
};

const EatAnApple: React.FC<EatAnAppleProps> = ({ contract, account, gasLimit, setAppleNumber,setHungryStatus, setHealthStatus,setHappyStatus}) => {

const storageDepositLimit = null;

async function eatAnApple () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);
      console.log("contract",contract)
      const token_number = await ownersTokenByIndex(contract, account.address, gasLimit);

      console.log("token_number",token_number)


      const { gasRequired, gasConsumed ,result, output }  = await contract.query["eatAnApple"](account.address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        }, {u64: token_number}, account.address)

        console.log("### result of dry run ###" );
        console.log("### output:", output?.toHuman());
        const humanOutput = output?.toHuman();
        if (typeof humanOutput === 'object' && humanOutput !== null && 'Ok' in humanOutput && 
            typeof humanOutput.Ok === 'object' && humanOutput.Ok !== null && 'Err' in humanOutput.Ok) {
          const message = humanOutput.Ok?.Err;
          if (message == "NotEnoughApple") {
            alert("Not Enough Apple");
          } else {
            alert("Time(5min) has not passed");
          }

        } else {

          await contract.tx["eatAnApple"](
            {
              gasLimit: gasLimit,
              storageDepositLimit,
            }, {u64: token_number}, account.address).signAndSend(account.address, { signer: injector.signer }, async ({ status }) => {
    
              if (status.isInBlock) {
                  console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                  await getYourAppleFunction(contract, account.address, gasLimit, setAppleNumber);
                  await getStatusFunction(contract, account.address, gasLimit, setHungryStatus, setHealthStatus, setHappyStatus);

              } else {
                  console.log(`Current status: ${status.type}`);
                  console.log(`Current status: ${status.hash.toString()}`);
              }
            }).catch((error: any) => {
                console.log(':( transaction failed', error);
            });

        }
    } else {
      alert("Connect your wallet first");
    }
  }


return (
    <>
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={eatAnApple}>eatAnApple</button>
    </>
);
};

export default EatAnApple;