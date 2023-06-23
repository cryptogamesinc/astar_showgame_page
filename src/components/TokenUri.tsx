import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import ownersTokenByIndex from "@/lib/OwnersTokenByIndex";

type TokenUriProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;
    setTokenUri: (value: string)=> void;
  };

const TokenUri: React.FC<TokenUriProps> = ({ contract, address, gasLimit, setTokenUri }) => {

  const storageDepositLimit = null;
  async function tokenUri () {

    if (contract !== null) {
      const token_number = await ownersTokenByIndex(contract, address, gasLimit);

      const { output }  = await contract.query['multiAsset::tokenUri'](address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },{u64:token_number})
  
        console.log("output",output)
        const humanOutput = output?.toHuman();
        if (
          humanOutput &&
          typeof humanOutput === 'object' &&
          'Ok' in humanOutput 
        ) {
          let a = console.log("aaa",humanOutput?.Ok)
          setTokenUri(String(humanOutput?.Ok));
        }
      }
  }
  

  return (
    <>
      <button className={styles.rotatebutton} onClick={tokenUri}>get Status</button>
      

    </>
  );
};

export default TokenUri;