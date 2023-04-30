import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type Claim0TokenProps = {
    contract: ContractPromise | null;
    account: InjectedAccountWithMeta | null;
    gasLimit: any;
};

const Claim0Token: React.FC<Claim0TokenProps> = ({ contract, account, gasLimit }) => {

const storageDepositLimit = null;

async function claim0Token () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );

    const checkEventsAndInculueError = (events: any[]): boolean => {
      let ret = false;
      events.forEach(({ event: { data } }) => {
        console.log("### data.method:", data.method);
        if (String(data.method) == "ExtrinsicFailed") {
          console.log("### check ExtrinsicFailed");
          ret = true;
        }
      });
      console.log("### ret is:", ret);
      return ret;
    };

    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);


      await contract.tx['psp37Mintable::claim0Token'](
        {
          value: 0, 
          gasLimit: gasLimit,
          storageDepositLimit,
        }).signAndSend(account.address, { signer: injector.signer }, ({ events = [],status }) => {

          if (status.isInBlock) {
              console.log(`Completed at block hash #${status.asInBlock.toString()}`);
          } 
          
          else if (status.isFinalized) {
            if (checkEventsAndInculueError(events)) {
              alert("Transaction is failure.");
            }
          }
          
          else {
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
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={claim0Token}>claim0Token</button>
    </>
);
};

export default Claim0Token;