import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import ownersTokenByIndex from '@/components/OwnersTokenByIndex';

type EatAnAppleProps = {
    contract: ContractPromise | null;
    account: InjectedAccountWithMeta | null;
    gasLimit: any;
};

const EatAnApple: React.FC<EatAnAppleProps> = ({ contract, account, gasLimit }) => {

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


      const { gasRequired, gasConsumed ,result, output }  = await contract.query["multiAsset::eatAnApple"](account.address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        }, {u64: token_number})

        console.log("### result of dry run ###" );
        console.log("### output:", output?.toHuman());
        const humanOutput = output?.toHuman();
        if (typeof humanOutput === 'object' && humanOutput !== null && 'Ok' in humanOutput && typeof humanOutput.Ok === 'object' && humanOutput.Ok !== null && 'Err' in humanOutput.Ok) {
          console.log("humanReadable",humanOutput.Ok?.Err)
          alert("Time(5min) has not passed");
        } else {

          await contract.tx["multiAsset::eatAnApple"](
            {
              gasLimit: gasLimit,
              storageDepositLimit,
            }, {u64: token_number}).signAndSend(account.address, { signer: injector.signer }, ({ status }) => {
    
              if (status.isInBlock) {
                  console.log(`Completed at block hash #${status.asInBlock.toString()}`);
              } else {
                  console.log(`Current status: ${status.type}`);
                  console.log(`Current status: ${status.hash.toString()}`);
              }
            }).catch((error: any) => {
                console.log(':( transaction failed', error);
            });

        }
    }
  }


return (
    <>
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={eatAnApple}>eatAnApple</button>
    </>
);
};

export default EatAnApple;