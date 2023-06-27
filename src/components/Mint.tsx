import React from "react";
import { ContractPromise } from "@polkadot/api-contract";
import styles from "@/styles/Home.module.css";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type MintProps = {
  contract: ContractPromise | null;
  account: InjectedAccountWithMeta | null;
  gasLimit: any;
};

const Mint: React.FC<MintProps> = ({ contract, account, gasLimit }) => {
  const storageDepositLimit = null;

  async function mint() {
    const { web3FromSource } = await import("@polkadot/extension-dapp");
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);
      await contract.tx["minting::mint"](
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },
        account.address
      )
        .signAndSend(
          account.address,
          { signer: injector.signer },
          ({ status }) => {
            if (status.isInBlock) {
              console.log(
                `Completed at block hash #${status.asInBlock.toString()}`
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
  }

  return (
    <>
      <button
        className={styles.rotatebutton}
        style={{ marginBottom: "20px" }}
        onClick={mint}
      >
        mint
      </button>
    </>
  );
};

export default Mint;
