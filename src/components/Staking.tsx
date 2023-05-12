import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import getYourMoney2 from "@/components/GetYourMoney2";
import getYourStakedMoney2 from "@/components/GetYourStakedMoney2";

type StakingProps = {
    contract: ContractPromise | null;
    account: InjectedAccountWithMeta | null;
    gasLimit: any;
    setMoneyNumber: (value: number | null) => void;
    setStakedMoney: (value: number | null) => void;
    userInput: number | null;
};

const Staking: React.FC<StakingProps> = ({ contract, account, gasLimit, setMoneyNumber, setStakedMoney, userInput}) => {

const storageDepositLimit = null;

async function staking () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      if (userInput === null) {
        alert("put your staking amount");
      } else {
        const injector = await web3FromSource(account.meta.source);

        const { gasRequired, gasConsumed ,result, output }  = await contract.query["multiAsset::stakeYourMoney"](account.address,
          {
            gasLimit: gasLimit,
            storageDepositLimit,
          },account.address, userInput)

          console.log("### result of dry run ###" );
          console.log("### output:", output?.toHuman());
          const humanOutput = output?.toHuman();
          if (typeof humanOutput === 'object' && humanOutput !== null && 'Ok' in humanOutput && typeof humanOutput.Ok === 'object' && humanOutput.Ok !== null && 'Err' in humanOutput.Ok && typeof humanOutput.Ok.Err === 'object' && humanOutput.Ok.Err !== null && 'Rmrk' in humanOutput.Ok.Err) {
            alert("Not Enough Money")
          } else {

            await contract.tx["multiAsset::stakeYourMoney"](
              {
                gasLimit: gasLimit,
                storageDepositLimit,
              }, account.address, userInput).signAndSend(account.address, { signer: injector.signer }, async ({ status }) => {
      
                if (status.isInBlock) {
                    console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                    await getYourMoney2(contract, account.address, gasLimit, setMoneyNumber);
                    await getYourStakedMoney2(contract, account.address, gasLimit, setStakedMoney);

                } else {
                    console.log(`Current status: ${status.type}`);
                    console.log(`Current status: ${status.hash.toString()}`);
                }
              }).catch((error: any) => {
                  console.log(':( transaction failed', error);
              });

          }
        }
    } else {
      alert("Connect your wallet and contract first");
    }
  }


return (
    <>
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={staking}>staking</button>
    </>
);
};

export default Staking;