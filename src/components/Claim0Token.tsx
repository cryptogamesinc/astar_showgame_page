import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type Claim0TokenProps = {
    contract: ContractPromise | null;
    account: InjectedAccountWithMeta | null;
    gasLimit: any;
    setError: (value: string | null) => void;
};

const Claim0Token: React.FC<Claim0TokenProps> = ({ contract, account, gasLimit, setError }) => {

const storageDepositLimit = null;

async function claim0Token () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);

      const {result} = await contract.query['psp37Mintable::claim0Token'](account.address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        })
      
      console.log("result",result)

      const result2 = await contract.tx['psp37Mintable::claim0Token'](
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        })
      
      console.log("result2",result2)

      await contract.tx['psp37Mintable::claim0Token'](
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        }).signAndSend(account.address, { signer: injector.signer }, ({ status }) => {

          if (status.isInBlock) {
              console.log(`Completed at block hash #${status.asInBlock.toString()}`);
          } else {
              console.log(`Current status: ${status.type}`);
              console.log(`Current status: ${status.hash.toString()}`);
          }
        }).catch((error: any) => {
            console.log(':( transaction failed', error);
            setError("既にミント済みです。")
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