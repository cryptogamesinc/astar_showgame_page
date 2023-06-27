import React, { useState, useEffect } from "react";
import { ContractPromise } from "@polkadot/api-contract";
import type { WeightV2 } from "@polkadot/types/interfaces";
import { BN, BN_ONE } from "@polkadot/util";
import styles from "@/styles/Home.module.css";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import ownersTokenByIndex from "@/lib/OwnersTokenByIndex";

type SetDeathStatusProps = {
  contract: ContractPromise | null;
  account: InjectedAccountWithMeta | null;
  gasLimit: any;
};

const SetDeathStatus: React.FC<SetDeathStatusProps> = ({
  contract,
  account,
  gasLimit,
}) => {
  const storageDepositLimit = null;

  async function setDeathStatus() {
    const { web3FromSource } = await import("@polkadot/extension-dapp");

    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);

      const token_number = await ownersTokenByIndex(
        contract,
        account.address,
        gasLimit
      );
      await contract.tx["multiAsset::setDeathStatus"](
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },
        { u64: token_number }
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
        onClick={setDeathStatus}
      >
        setDeathStatus
      </button>
    </>
  );
};

export default SetDeathStatus;
