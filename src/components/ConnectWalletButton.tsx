import { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";


interface ConnectWalletButtonProps {
  onConnected: (account: InjectedAccountWithMeta, address: string, source: string) => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ onConnected }) => {
  const [address, setAddress] = useState('');
  const [source, setSource] = useState('');
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);;
  const [connected, setConnected] = useState(false);

  async function connectWallet() {
    // ... (connectWallet 関数のコードをここに貼り付け)
    const { web3Accounts, web3Enable} = await import(
        "@polkadot/extension-dapp"
      );
  
      const allInjected = await web3Enable('my dapp');
    
      if (allInjected.length === 0) {
        return;
      }
      const accounts = await web3Accounts();
      console.log("accounts",accounts)
  
      const account = accounts[0];
      setAccount(account);
      console.log("account",account)
  
      const address = account?.address
      const source = account?.meta?.source
  
      console.log("address",address)
      console.log("source",source)
  
      setAddress(address);
      setSource(source);
      setConnected(true);

    // アカウント情報が変更されたことを親コンポーネントに通知
    onConnected(account, address, source);
  }

  return (
    <>
      <div  className={styles.header_bottun}  onClick={connectWallet}>
        {connected ? 'Connected' : 'Connect Wallet'}
      </div>
      {/* {address && <p style={{ marginBottom: '20px' }}>Address: {address}</p>}
      {source && <p style={{ marginBottom: '20px' }}>Source: {source}</p>} */}
    </>
  );
};

export default ConnectWalletButton;
