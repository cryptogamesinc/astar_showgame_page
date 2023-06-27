import React from "react";
import { ContractPromise } from "@polkadot/api-contract";
import styles from "@/styles/Home.module.css";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import getYourMoneyFunction from "@/lib/GetYourMoneyFunction";
import getYourBalanceFunction from "@/lib/GetYourBalanceFunction";

type BuyGameMoneyProps = {
  contract: ContractPromise | null;
  psp22Contract: ContractPromise | null;
  account: InjectedAccountWithMeta | null;
  gasLimit: any;
  psp22Address: string;
  ownerAddress: string;
  setMoneyNumber: (value: number | null) => void;
  setYourBalance: (value: number | null) => void;
};

const BuyGameMoney: React.FC<BuyGameMoneyProps> = ({
  contract,
  psp22Contract,
  account,
  gasLimit,
  psp22Address,
  ownerAddress,
  setMoneyNumber,
  setYourBalance,
}) => {
  const storageDepositLimit = null;

  async function buyGameMoney() {
    const { web3FromSource } = await import("@polkadot/extension-dapp");
    if (contract !== null && psp22Contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);
      console.log("contract", contract);

      const { gasRequired, gasConsumed, result, output } = await contract.query[
        "buyGameMoney"
      ](
        account.address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },
        psp22Address,
        ownerAddress,
        ""
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
        alert("Not Enought Money");
      } else {
        await contract.tx["buyGameMoney"](
          {
            gasLimit: gasLimit,
            storageDepositLimit,
          },
          psp22Address,
          ownerAddress,
          ""
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
                await getYourBalanceFunction(
                  psp22Contract,
                  account.address,
                  gasLimit,
                  setYourBalance
                );
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
      <button
        className={styles.rotatebutton}
        style={{ marginBottom: "20px" }}
        onClick={buyGameMoney}
      >
        buyGameMoney
      </button>
    </>
  );
};

export default BuyGameMoney;
