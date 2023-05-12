import Head from 'next/head'

import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { BN, BN_ONE } from "@polkadot/util";
import '@polkadot/api-augment'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useState, useEffect } from 'react'
const { Keyring } = require('@polkadot/keyring');
import { css } from "@emotion/react";


import ConnectWalletButton from '@/components/ConnectWalletButton';
import GetContractButton from '@/components/GetContractButton';

import Claim0Token from '@/components/Claim0Token';
import GetStatus from '@/components/GetStatus';
import EatAnApple from '@/components/EatAnApple';
import TokenUri from '@/components/TokenUri';
import tokenInfo from '@/components/TokenInfo';

import mainMetadata from "./metadata.json";
import myPsp37Metadata from "./my_psp37_enumerable.json";
import SetDeathStatus from '@/components/SetDeathStatus';
import Psp37BaseUri from '@/components/Psp37BaseUri';
import GetYourApple from '@/components/GetYourApple';
import BuyAnApple from '@/components/BuyAnApple';
import GetYourMoney from '@/components/GetYourMoney';
import DailyBonus from '@/components/DailyBonus';
import Astar from '@/components/Astar';
import Claim from '@/components/Claim';
import GetInfo from '@/components/GetInfo';
import Staking from '@/components/Staking';
import Withdraw from '@/components/Withdraw';
import GetYourStakedMoney from '@/components/GetYourStakedMoney';


import { Abi } from '@polkadot/api-contract';

// metadataの設定
const metadata = new Abi(mainMetadata);
const psp37metadata = new Abi(myPsp37Metadata);


const inter = Inter({ subsets: ['latin'] })

const storageDepositLimit = null;

const apiKey = process.env.NEXT_PUBLIC_MNEMONIC;
const DAILY_AMOUNT = 100;

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;


const mainContractAddress = "YdbxSuJkK7HCKht4ps3bxv4NjhzAqt4rxNwYRw7mJ4eoaA4"
const psp37ContractAddress = "VwRKvqjLhK4NBBwmq3QkLVcdycfqghwe8iMcs95PFQj3A3x"
  
// main().then(() => console.log('completed'))

export default function Home() {
  const [address, setAddress] = useState('');
  const [source, setSource] = useState('');
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);;
  const [api, setApi] = useState<ApiPromise | null>(null);

  // main
  const [mainTokenUri, setMainTokenUri] = useState<String>('');
  const [mainNftName, setMainNftName] = useState('');
  const [mainNftDescription, setMainNftDescription] = useState('');
  const [mainNftImageUri, setMainNftImageUri] = useState('');

  // psp37
  const [psp37NftName, setPsp37NftName] = useState('');
  const [psp37NftDescription, setPsp37NftDescription] = useState('');
  const [psp37NftImageUri, setPsp37NftImageUri] = useState('');

  
  const [outputs, setOutputs] = useState<string[]>([]);


  // mainコントラクトの結果
  const [mainContract, setMainContract] = useState<ContractPromise | null>(null);
  const [getMainContractResult, setGetMainContractResult] = useState("");

  // psp37コントラクトの結果
  const [psp37Contract, setPsp37Contract] = useState<ContractPromise | null>(null);
  const [getPsp37ContractResult, setGetPsp37ContractResult] = useState("");


  const [hungryStatus, setHungryStatus] = useState<string | number | null>(null);
  const [healthStatus, setHealthStatus] = useState<string | number | null>(null);
  const [happyStatus, setHappyStatus] = useState<string | number | null>(null);

  const [psp37BaseUri, setPsp37BaseUri] = useState<string>("");

  const [appleNumber, setAppleNumber] = useState<number | null>(null);
  const [moneyNumber, setMoneyNumber] = useState<number | null>(null);
  const [stakedMoney, setStakedMoney] = useState<number | null>(null);


  const handleConnected = (account: InjectedAccountWithMeta, address: string, source: string) => {
    setAccount(account);
    setAddress(address);
    setSource(source);
  };

  const gasLimit: any = api?.registry.createType("WeightV2", {
    refTime: new BN(100_000_000_000),
    proofSize: new BN(1_000_000),
  });


  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 style={{marginBottom: "80px"}}>Get Your Contract Information(psp34)</h1>

        <header className={styles.header}>
          <div className={styles.headerItem}>
            <Claim 
                contract={mainContract} 
                account={account} 
                gasLimit={gasLimit}
              />
          </div>
          <div className={styles.headerItem}>
            <GetYourMoney 
              contract={mainContract} 
              address={address} 
              gasLimit={gasLimit} 
              moneyNumber={moneyNumber}
              setMoneyNumber={setMoneyNumber}
            />
          </div>
          
          <div className={styles.headerItem}>
            <Astar />
          </div>
          <div className={styles.headerItem}>
            <ConnectWalletButton onConnected={handleConnected} />
          </div>
          <div className={styles.headerItem}>
            <GetContractButton 
              contractAddress={mainContractAddress} 
              metadata={metadata} setApi={setApi} 
              setContract={setMainContract} 
              setGetContractResult={setGetMainContractResult}
            />
            </div>
        </header>

        <div className={styles.description}>
          <div>
            <div className={styles.item}>
            <DailyBonus 
              contract={mainContract} 
              account={account} 
              gasLimit={gasLimit}
              setMoneyNumber={setMoneyNumber}
            />
            </div>    

            <div className={styles.item}>
            <Staking 
              contract={mainContract} 
              account={account} 
              gasLimit={gasLimit}
              setMoneyNumber={setMoneyNumber}
            />
            </div>  
            
            <div className={styles.item}>
            <GetYourStakedMoney 
              contract={mainContract} 
              address={address} 
              gasLimit={gasLimit}
              stakedMoney={stakedMoney}
              setStakedMoney={setStakedMoney}
            />
            </div>  

            <div className={styles.item}>
            <Withdraw 
              contract={mainContract} 
              account={account} 
              gasLimit={gasLimit}
              setMoneyNumber={setMoneyNumber}
              setStakedMoney={setStakedMoney}
            />
            </div>  

            <BuyAnApple 
              contract={mainContract} 
              account={account} 
              gasLimit={gasLimit} 
              setAppleNumber = {setAppleNumber}
              setMoneyNumber = {setMoneyNumber}
            />

            <GetInfo
              contract={mainContract} 
              address={address} 
              gasLimit={gasLimit} 
              nftName={mainNftName}
              nftDescription={mainNftDescription}
              nftImageUri={mainNftImageUri}
              setNftName={setMainNftName}
              setNftDescription={setMainNftDescription}
              setNftImageUri={setMainNftImageUri}
              flag={0}
              />
              <div className={styles.container}>
              {mainNftImageUri && (
              <>
                <img src={mainNftImageUri} alt="Image"  width="500" height="500" />
              </>
              )}
              <div>
                {mainNftName && <p>Name: {mainNftName}</p>}
                {mainNftDescription && <p>Description: {mainNftDescription}</p>}

                <GetStatus 
                contract={mainContract} 
                address={address} 
                gasLimit={gasLimit} 
                hungryStatus={hungryStatus} 
                healthStatus={healthStatus} 
                happyStatus={happyStatus} 
                setHungryStatus={setHungryStatus} 
                setHealthStatus={setHealthStatus} 
                setHappyStatus={setHappyStatus} 
                />

                <div >
                  <GetYourApple 
                    contract={mainContract} 
                    address={address} 
                    gasLimit={gasLimit} 
                    appleNumber={appleNumber}
                    setAppleNumber={setAppleNumber}
                  />
                </div>
                <div>
                  <EatAnApple 
                      contract={mainContract} 
                      account={account} 
                      gasLimit={gasLimit} 
                      setAppleNumber={setAppleNumber}
                      setHungryStatus={setHungryStatus}
                      setHealthStatus={setHealthStatus}
                      setHappyStatus={setHappyStatus}
                    />
                </div>
              </div>
          </div>


            <GetContractButton 
              contractAddress={psp37ContractAddress} 
              metadata={psp37metadata} 
              setApi={setApi} 
              setContract={setPsp37Contract} 
              setGetContractResult={setGetPsp37ContractResult}
            />

            {getPsp37ContractResult && <p>Get Contract result: {getPsp37ContractResult}</p>}

            <Claim0Token 
              contract={psp37Contract} 
              account={account} 
              gasLimit={gasLimit}
            />

            <GetInfo
              contract={psp37Contract} 
              address={address} 
              gasLimit={gasLimit} 
              nftName={psp37NftName}
              nftDescription={psp37NftDescription}
              nftImageUri={psp37NftImageUri}
              setNftName={setPsp37NftName}
              setNftDescription={setPsp37NftDescription}
              setNftImageUri={setPsp37NftImageUri}
              flag={1}
              />
          </div>
        </div>
      </main>
    </>
  )
}
