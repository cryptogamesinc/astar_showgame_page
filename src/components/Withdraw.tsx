import React from "react";
import { ContractPromise } from "@polkadot/api-contract";
import styles from "@/styles/Home.module.css";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import getYourMoneyFunction from "@/lib/GetYourMoneyFunction";

type WithdrawProps = {
  contract: ContractPromise | null;
  account: InjectedAccountWithMeta | null;
  gasLimit: any;
  setMoneyNumber: (value: number | null) => void;
  setStakedMoney: (value: number | null) => void;
};

const Withdraw: React.FC<WithdrawProps> = ({
  contract,
  account,
  gasLimit,
  setMoneyNumber,
  setStakedMoney,
}) => {
  const storageDepositLimit = null;

  async function withdraw() {
    const { web3FromSource } = await import("@polkadot/extension-dapp");
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);

      const { gasRequired, gasConsumed, result, output } = await contract.query[
        "withdrawYourMoney"
      ](
        account.address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },
        account.address
      );

      console.log("### result of dry run ###");
      console.log("### output:", output?.toHuman());
      const humanOutput = output?.toHuman();
      if (
        typeof humanOutput === "object" &&
        humanOutput !== null &&
        "Ok" in humanOutput &&
        typeof humanOutput.Ok === "object" &&
        humanOutput.Ok !== null &&
        "Err" in humanOutput.Ok
      ) {
        alert("Not Enough Money");
      } else {
        await contract.tx["withdrawYourMoney"](
          {
            gasLimit: gasLimit,
            storageDepositLimit,
          },
          account.address
        )
          .signAndSend(
            account.address,
            { signer: injector.signer },
            async ({ status }) => {
              if (status.isInBlock) {
                console.log(
                  `Completed at block hash #${status.asInBlock.toString()}`
                );
                await getYourMoneyFunction(
                  contract,
                  account.address,
                  gasLimit,
                  setMoneyNumber
                );
                setStakedMoney(Number(0));
              } else {
                console.log(`Current status: ${status.type}`);
                console.log(`Current status: ${status.hash.toString()}`);
              }
            }
          )
          .catch((error: any) => {
            console.log(":( transaction failed", error);
          });
      }
    } else {
      alert("Connect your wallet first");
    }
  }

  return (
    <>
      <button className={styles.rotatebutton} onClick={withdraw}>
        withdraw
      </button>
    </>
  );
};

export default Withdraw;
