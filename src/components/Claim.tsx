import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type ClaimProps = {
    contract: ContractPromise | null;
    account: InjectedAccountWithMeta | null;
    gasLimit: any;
};

const Claim: React.FC<ClaimProps> = ({ contract, account, gasLimit }) => {

const storageDepositLimit = null;

async function claim () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);

      const { gasRequired, gasConsumed ,result, output }  = await contract.query["minting::claimANft"](account.address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        })

        console.log("### result of dry run ###" );
        console.log("### output:", output?.toHuman());
        const humanOutput = output?.toHuman();
        if (typeof humanOutput === 'object' && humanOutput !== null && 'Ok' in humanOutput && typeof humanOutput.Ok === 'object' && humanOutput.Ok !== null && 'Err' in humanOutput.Ok && typeof humanOutput.Ok.Err === 'object' && humanOutput.Ok.Err !== null && 'Rmrk' in humanOutput.Ok.Err) {
          const message = humanOutput.Ok?.Err?.Rmrk;
          console.log(message)
          alert("Already had an NFT");
        } else {
          await contract.tx['minting::claimANft'](
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
            });
        }
    } else {
      alert("Connect your wallet and contract first");
    }
  }

return (
    <>
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={claim}>claim</button>
    </>
);
};

export default Claim;