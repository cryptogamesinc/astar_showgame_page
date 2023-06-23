import { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { ContractPromise } from '@polkadot/api-contract';
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import getInfoFunction from "@/lib/GetInfoFunction";


interface ConnectWalletButtonProps {
  onConnected: (account: InjectedAccountWithMeta, address: string, source: string) => void;
  contract: ContractPromise | null;
  gasLimit: any;
  nftName: string;
  nftDescription: string;
  nftImageUri: string;
  setNftName: (value: string) => void;
  setNftDescription: (value: string) => void;
  setNftImageUri: (value: string) => void;
  flag: number;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ onConnected, contract, gasLimit, nftName, nftDescription, nftImageUri, setNftName, setNftDescription, setNftImageUri, flag }) => {
  const [address, setAddress] = useState('');
  const [source, setSource] = useState('');
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);;
  const [connected, setConnected] = useState(false);

  async function connectWallet() {
    if (contract === null) {
      alert("Now connecting contract. Please wait for a minutes");
    } else {

    const { web3Accounts, web3Enable} = await import(
        "@polkadot/extension-dapp"
      );
  
      const allInjected = await web3Enable('my dapp');
    
      if (allInjected.length === 0) {
        return;
      }
      const accounts = await web3Accounts();
  
      const account = accounts[0];
      setAccount(account);
  
      const address = account?.address
      const source = account?.meta?.source
  
      console.log("address",address)
      console.log("source",source)
  
      setAddress(address);
      setSource(source);
      setConnected(true);

    onConnected(account, address, source);

    if (contract !== null) {
      await getInfoFunction(contract,address, gasLimit,nftName, nftDescription, nftImageUri, setNftName, setNftDescription, setNftImageUri, flag );
    }
  }
  }

  return (
    <>
      <div  className={styles.header_bottun}  onClick={connectWallet}>
        {connected ? 'Connected' : 'Connect Wallet'}
      </div>
    </>
  );
};

export default ConnectWalletButton;
