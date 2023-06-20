import { ContractPromise } from '@polkadot/api-contract';
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import getYourAppleFunction from "@/components/GetYourAppleFunction";
import getYourMoneyFunction from "@/components/GetYourMoneyFunction";

const storageDepositLimit = null;

export default async function buyAnAppleFunction (
  contract: ContractPromise | null,
  account: InjectedAccountWithMeta | null,
  gasLimit: any,
  setAppleNumber: (value: number | null) => void,
  setMoneyNumber: (value: number | null) => void
) {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);

      const { gasRequired, gasConsumed ,result, output }  = await contract.query["buyAnApple"](account.address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        }, account.address)

        console.log("### result of dry run ###" );
        console.log("### output:", output?.toHuman());
        const humanOutput = output?.toHuman();
        if (typeof humanOutput === 'object' && humanOutput !== null && 'Ok' in humanOutput && 
            typeof humanOutput.Ok === 'object' && humanOutput.Ok !== null && 'Err' in humanOutput.Ok) {
          const message = humanOutput.Ok?.Err;
          console.log(message)
          if (message == "NotEnoughMoney") {
            alert("Not Enough Money");
          } 

        } else {
          await contract.tx['buyAnApple'](
            {
              gasLimit: gasLimit,
              storageDepositLimit,
            }, account.address).signAndSend(account.address, { signer: injector.signer }, async ({ status }) => {
    
              if (status.isInBlock) {
                  console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                  await getYourAppleFunction(contract, account.address, gasLimit, setAppleNumber);
                  await getYourMoneyFunction(contract, account.address, gasLimit, setMoneyNumber);
                  
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

