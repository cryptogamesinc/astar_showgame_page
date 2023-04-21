import React, { useState, useEffect } from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import type { WeightV2 } from '@polkadot/types/interfaces'
import { BN, BN_ONE } from "@polkadot/util";
import styles from '@/styles/Home.module.css'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

type MintProps = {
    contract: ContractPromise | null;
    account: InjectedAccountWithMeta | null;
};

const GetTokens: React.FC<MintProps> = ({ contract, account }) => {

const PROOFSIZE = new BN(1_000_000);
const storageDepositLimit = null;

async function assignMetadata () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);
      await contract.tx['minting::assignMetadata'](
        {
          gasLimit: createGasLimit(100000000000),
          storageDepositLimit,
        }, account.address).signAndSend(account.address, { signer: injector.signer }, ({ status }) => {

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
  }


function createGasLimit(refTime: number | BN) {
    const refTimeBN = refTime instanceof BN ? refTime : new BN(refTime);
    return contract?.api.registry.createType('WeightV2', {
    refTime: refTimeBN,
    proofSize: PROOFSIZE,
    }) as WeightV2;
}

return (
    <>
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={assignMetadata}>assignMetadata</button>
    </>
);
};

export default GetTokens;