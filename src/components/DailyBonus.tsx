import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import getYourMoney2 from "@/components/GetYourMoney2";

type DailyBonusProps = {
    contract: ContractPromise | null;
    account: InjectedAccountWithMeta | null;
    gasLimit: any;
    setMoneyNumber: (value: number | null) => void;
};

const DailyBonus: React.FC<DailyBonusProps> = ({ contract, account, gasLimit, setMoneyNumber}) => {

const storageDepositLimit = null;

async function dailyBonus () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);

      const { gasRequired, gasConsumed ,result, output }  = await contract.query["multiAsset::dailyBonus"](account.address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        }, account.address)

        console.log("### result of dry run ###" );
        console.log("### output:", output?.toHuman());
        const humanOutput = output?.toHuman();
        if (typeof humanOutput === 'object' && humanOutput !== null && 'Ok' in humanOutput && typeof humanOutput.Ok === 'object' && humanOutput.Ok !== null && 'Err' in humanOutput.Ok && typeof humanOutput.Ok.Err === 'object' && humanOutput.Ok.Err !== null && 'Rmrk' in humanOutput.Ok.Err) {
          alert("Time(5min) has not passed");
        } else {
          await contract.tx['multiAsset::dailyBonus'](
            {
              gasLimit: gasLimit,
              storageDepositLimit,
            }, account.address).signAndSend(account.address, { signer: injector.signer }, async ({ status }) => {

              if (status.isInBlock) {
                  console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                  await getYourMoney2(contract, account.address, gasLimit, setMoneyNumber);
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
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={dailyBonus}>dailyBonus</button>
    </>
);
};

export default DailyBonus;