import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'
import tokenInfo from '@/components/TokenInfo';

type GetInfoProps = {
    contract: ContractPromise | null;
    address: string;
    gasLimit: any;
    nftName: string;
    nftDescription: string;
    nftImageUri: string;
    setNftName: (value: string) => void;
    setNftDescription: (value: string) => void;
    setNftImageUri: (value: string) => void;
    flag: number;
  };

const GetInfo: React.FC<GetInfoProps> = ({ contract, address, gasLimit,nftName,nftDescription, nftImageUri, setNftName,setNftDescription,setNftImageUri, flag }) => {

  const storageDepositLimit = null;
  async function getInfo () {

    if (contract !== null) {

      tokenInfo(contract, address, gasLimit, setNftName, setNftDescription, setNftImageUri, flag)
      }
  }
  

  return (
    <>
      <button className={styles.rotatebutton} onClick={getInfo}>Get Info</button>

      {nftName && <p>mainNftName: {nftName}</p>}
      {nftDescription && <p>mainNftDescription: {nftDescription}</p>}
      {nftImageUri && (
      <>
        <h4 style={{marginBottom: "10px"}}>Image</h4>
        <img src={nftImageUri} alt="Image"  width="300" height="300" />
      </>
      )}
    </>
  );
};

export default GetInfo;