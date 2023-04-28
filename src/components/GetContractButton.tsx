import React from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { Abi } from '@polkadot/api-contract';
import styles from '@/styles/Home.module.css'

type GetContractButtonProps = {
  contractAddress: string;
  metadata: Abi;
  onContractFetched: (api: ApiPromise, contract: ContractPromise) => void;
};

const GetContractButton: React.FC<GetContractButtonProps> = ({ contractAddress, metadata, onContractFetched }) => {
  async function getContract() {
    try {
      const provider = new WsProvider('wss://rpc.shibuya.astar.network');
      const api = await ApiPromise.create({ provider });
      const contract = new ContractPromise(api, metadata, contractAddress);
      onContractFetched(api, contract);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button className={styles.rotatebutton} onClick={getContract}>
      Get Contract
    </button>
  );
};

export default GetContractButton;
