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

    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);

      const  { output } = await contract.query['psp37Mintable::claim0Token'](account.address,
        {
          value: 0, 
          gasLimit: gasLimit,
          storageDepositLimit,
        });

        console.log("### output:", output?.toHuman());

        const humanOutput = output?.toHuman();
        if (typeof humanOutput === 'object' && humanOutput !== null && 'Ok' in humanOutput && typeof humanOutput.Ok === 'object' && humanOutput.Ok !== null && 'Err' in humanOutput.Ok) {
          console.log("humanReadable",humanOutput.Ok?.Err)
          alert("You have already claimed");
        } 
        
        else {
          await contract.tx['psp37Mintable::claim0Token'](
            {
              value: 0, 
              gasLimit: gasLimit,
              storageDepositLimit,
            }).signAndSend(account.address, { signer: injector.signer }, ({ events = [],status }) => {
    
              if (status.isInBlock) {
                  console.log(`Completed at block hash #${status.asInBlock.toString()}`);
              } 
              
              else {
                  console.log(`Current status: ${status.type}`);
                  console.log(`Current status: ${status.hash.toString()}`);
              }
              
            }).catch((error: any) => {
                console.log(':( transaction failed', error);
            });
        }
    } else {
      alert("Connect your wallet and contract first");
    }
  }

return (
    <>
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={claim0Token}>claim</button>
    </>
);
};

export default Claim0Token;