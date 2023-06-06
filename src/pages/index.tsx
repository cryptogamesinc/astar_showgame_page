import Head from 'next/head'
import Image from 'next/image'
import image from '../images/items/background.png'
import image_apple from '../images/items/apple.png'
import image_treasure from '../images/items/treasure.png'
import image_factory from '../images/items/factory.png'
import image_store from '../images/items/store.png'
import image_house from '../images/items/house.png'
import image_logo from '../images/items/logo.png'

import Modal from 'react-modal';
import { Button, Container } from "@mui/material";

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
import GetMainContractButton from '@/components/GetMainContractButton';
import GetContractButton from '@/components/GetContractButton';

import Claim0Token from '@/components/Claim0Token';
import GetStatus from '@/components/GetStatus';
import EatAnApple from '@/components/EatAnApple';

import mainMetadata from "./metadata.json";
import myPsp22Metadata from "./my_psp22_mintable.json";
import myPsp37Metadata from "./my_psp37_enumerable.json";
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
import GetYourBalance from '@/components/GetYourBalance';
import BuyGameMoney from '@/components/BuyGameMoney';
import getContractButton from '@/components/GetContractButtonFunction';
import buyAnAppleFunction from '@/components/BuyAnAppleFunction';
import getInfoFunction from '@/components/GetInfoFunction';
import getStatusFunction2 from '@/components/GetStatusFunction2';

import { Abi } from '@polkadot/api-contract';
import { Contract } from '@polkadot/api-contract/base';

// metadataの設定
const metadata = new Abi(mainMetadata);
const psp22metadata = new Abi(myPsp22Metadata);
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


const mainContractAddress = "anwJWxiQtEQAP3wwXhpPbVhALz35hGvJa78dJh8SVL876K2"
const psp22ContractAddress = "WG7GLbCQLnuCyiURRaFsCsmg2E87mwbjoNvT675rxs5tgXe"
const psp37ContractAddress = "VwRKvqjLhK4NBBwmq3QkLVcdycfqghwe8iMcs95PFQj3A3x"

const ownerAddress = "5Fxgf74m64UyxWChkkCw2nxqgbNUMuCV64mcy7LETwRvmyuW"

  
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

  // psp22コントラクトの結果
  const [psp22Contract, setPsp22Contract] = useState<ContractPromise | null>(null);
  const [getPsp22ContractResult, setGetPsp22ContractResult] = useState("");

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

  const [inputValue, setInputValue] = useState<number | null>(null);;

  const [yourBalance, setYourBalance] = useState<number | null>(null);


  const handleConnected = (account: InjectedAccountWithMeta, address: string, source: string) => {
    setAccount(account);
    setAddress(address);
    setSource(source);
  };

  const handleInputChange = (e: any) => {
    const newValue = parseInt(e.target.value); // 入力を数値に変換
    setInputValue(isNaN(newValue) ? null : newValue); // 入力が数値でない場合はnullを設定
};

  const gasLimit: any = api?.registry.createType("WeightV2", {
    refTime: new BN(100_000_000_000),
    proofSize: new BN(1_000_000),
  });

  useEffect(() => {
    getContractButton(mainContractAddress, metadata, setApi, setMainContract);
    getContractButton(psp22ContractAddress, psp22metadata, setApi, setPsp22Contract);
    getContractButton(psp37ContractAddress, psp37metadata, setApi, setPsp37Contract);
  }, []);

  const customStyles = {
    content: {
      top: "20%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      minWidth: "40%",
    },
  };
  const [treasureModalIsOpen, setTreasureModalIsOpen] = useState(false);
  const [appleModalIsOpen, setAppleModalIsOpen] = useState(false);
  const [factoryModalIsOpen, setFactoryModalIsOpen] = useState(false);
  const [vegeModalIsOpen, setVegeModalIsOpen] = useState(false);
  // const [treasureModalIsOpen, setTreasureModalIsOpen] = useState(false);
  // const [treasureModalIsOpen, setTreasureModalIsOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
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
            <ConnectWalletButton 
              onConnected={handleConnected}
              contract={mainContract} 
              gasLimit={gasLimit} 
              nftName={mainNftName}
              nftDescription={mainNftDescription}
              nftImageUri={mainNftImageUri}
              setNftName={setMainNftName}
              setNftDescription={setMainNftDescription}
              setNftImageUri={setMainNftImageUri}
              flag={0}
            />

          </div>
        </header>



        <div className={styles.test}>
          
          <Image src={image} className={styles.background} alt="Description" width={1000} height={600} />
          <div className={styles.headerrr} >
            <div><Image src={image_logo} alt="Description" width={200}/></div>
            <div className={styles.header_right}>
              <div>
              <GetYourMoney 
                contract={mainContract} 
                address={address} 
                gasLimit={gasLimit} 
                moneyNumber={moneyNumber}
                setMoneyNumber={setMoneyNumber}
              />
              </div>
              <div className={styles.connect_wallet}>
                <ConnectWalletButton 
                  onConnected={handleConnected}
                  contract={mainContract} 
                  gasLimit={gasLimit} 
                  nftName={mainNftName}
                  nftDescription={mainNftDescription}
                  nftImageUri={mainNftImageUri}
                  setNftName={setMainNftName}
                  setNftDescription={setMainNftDescription}
                  setNftImageUri={setMainNftImageUri}
                  flag={0}
                />
              </div>
            </div>
            
          </div>
          
          {/* apple */}
          <Container maxWidth="sm">
            <Image src={image_apple} className={styles.apple_position} alt="Description" width={100} height={100} onClick={() => {
                  setAppleModalIsOpen(true);
                }}/>
            <Modal isOpen={appleModalIsOpen} style={customStyles}>
              <div className={styles.item}>

                <GetYourApple 
                  contract={mainContract} 
                  address={address} 
                  gasLimit={gasLimit} 
                  appleNumber={appleNumber}
                  setAppleNumber={setAppleNumber}
                />

                <EatAnApple 
                    contract={mainContract} 
                    account={account} 
                    gasLimit={gasLimit} 
                    setAppleNumber={setAppleNumber}
                    setHungryStatus={setHungryStatus}
                    setHealthStatus={setHealthStatus}
                    setHappyStatus={setHappyStatus}
                  />

                <button onClick={() => { setAppleModalIsOpen(false);}}>閉じる</button>
              </div>    
            </Modal>
          </Container>

          {/* treasure */}
          <Container maxWidth="sm">
            <Image src={image_treasure} className={styles.treasure_position} alt="Description" width={100} height={100} onClick={() => {
                  setTreasureModalIsOpen(true);
                }}/>
            <Modal isOpen={treasureModalIsOpen} style={customStyles}>
              <div className={styles.item}>
                <DailyBonus 
                  contract={mainContract} 
                  account={account} 
                  gasLimit={gasLimit}
                  setMoneyNumber={setMoneyNumber}
                />
                <GetYourBalance 
                  contract={psp22Contract} 
                  address={address} 
                  gasLimit={gasLimit} 
                  yourBalance={yourBalance}
                  setYourBalance={setYourBalance}
                />
                <BuyGameMoney
                  contract={mainContract} 
                  psp22Contract={psp22Contract}
                  psp22Address={psp22ContractAddress}
                  ownerAddress={ownerAddress}
                  account={account} 
                  gasLimit={gasLimit} 
                  setMoneyNumber={setMoneyNumber}
                  setYourBalance={setYourBalance}
                  />
                <button onClick={() => { setTreasureModalIsOpen(false);}}>閉じる</button>
              </div>    
            </Modal>
          </Container>

          {/* factory */}
          <Container maxWidth="sm">
            <Image src={image_factory} className={styles.factory_position} alt="Description" width={100} height={100} onClick={() => {
                  setFactoryModalIsOpen(true);
                }}/>
            <Modal isOpen={factoryModalIsOpen} style={customStyles}>
              <div className={styles.item}>
                <input 
                    type="text" 
                    value={inputValue === null ? "" : inputValue.toString()} // nullの場合は空文字列を表示
                    onChange={handleInputChange} 
                    style={{width: "100px"}}
                    placeholder="stake amount"
                />
                <Staking 
                  contract={mainContract} 
                  account={account} 
                  gasLimit={gasLimit}
                  setMoneyNumber={setMoneyNumber}
                  setStakedMoney={setStakedMoney}
                  userInput={inputValue}
                />
                <GetYourStakedMoney 
                  contract={mainContract} 
                  address={address} 
                  gasLimit={gasLimit}
                  stakedMoney={stakedMoney}
                  setStakedMoney={setStakedMoney}
                />
                <Withdraw 
                  contract={mainContract} 
                  account={account} 
                  gasLimit={gasLimit}
                  setMoneyNumber={setMoneyNumber}
                  setStakedMoney={setStakedMoney}
                />
                <button onClick={() => { setFactoryModalIsOpen(false);}}>閉じる</button>
              </div>    
            </Modal>
          </Container>

          {/* store */}
          <Image src={image_store} className={styles.store_position} alt="Description" width={100} height={100}
                onClick={() => {
                  buyAnAppleFunction(mainContract ,account, gasLimit, setAppleNumber, setMoneyNumber);
                }}/>

          {/* house */}
          <Image src={image_house} className={styles.house_position} alt="Description" width={100} height={100}
                onClick={() => {
                  getStatusFunction2(mainContract ,address, gasLimit, setHungryStatus, setHealthStatus, setHappyStatus, mainNftName, mainNftDescription, mainNftImageUri,setMainNftName,setMainNftDescription,setMainNftImageUri,0);
                }}
           />

          <Container maxWidth="sm">
            <div className={styles.vege_position} >
                {mainNftImageUri && (
                <>
                  <img src={mainNftImageUri} className={styles.nftImage} alt="Image"  width="400" height="400" onClick={() => {
                  setVegeModalIsOpen(true);
                }}/>
                </>
                )}
            </div>
            <Modal isOpen={vegeModalIsOpen} style={customStyles}>
              aa
              <button onClick={() => { setVegeModalIsOpen(false);}}>閉じる</button>
            </Modal>
          </Container>
        </div>













        <div className={styles.description}>
          <div>
          <div  className={styles.subTitle}>Main Contract</div>
            {/* money topics */}
            <div className={styles.money}>
              
              <div className={styles.item}>
                <DailyBonus 
                  contract={mainContract} 
                  account={account} 
                  gasLimit={gasLimit}
                  setMoneyNumber={setMoneyNumber}
                />
              </div>    

              <div className={styles.items}>
                <input 
                    type="text" 
                    value={inputValue === null ? "" : inputValue.toString()} // nullの場合は空文字列を表示
                    onChange={handleInputChange} 
                    style={{width: "100px"}}
                    placeholder="stake amount"
                />
                <Staking 
                  contract={mainContract} 
                  account={account} 
                  gasLimit={gasLimit}
                  setMoneyNumber={setMoneyNumber}
                  setStakedMoney={setStakedMoney}
                  userInput={inputValue}
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

              <div className={styles.item}>
                <BuyAnApple 
                  contract={mainContract} 
                  account={account} 
                  gasLimit={gasLimit} 
                  setAppleNumber = {setAppleNumber}
                  setMoneyNumber = {setMoneyNumber}
                />
              </div>  
            </div>

            <div className={styles.mainNFT}>
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
                <img src={mainNftImageUri} className={styles.nftImage} alt="Image"  width="500" height="500" />
              </>
              )}
              <div>
                {mainNftName && <p style={{marginBottom: "20px"}}>Name: {mainNftName}</p>}
                {mainNftDescription && <p style={{marginBottom: "20px"}}>Description: {mainNftDescription}</p>}

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

                <div>
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
          </div>


          {/* psp22 */}
            <div className={styles.subTitle}>
              psp22
            </div>
            <div >
              <GetYourBalance 
                contract={psp22Contract} 
                address={address} 
                gasLimit={gasLimit} 
                yourBalance={yourBalance}
                setYourBalance={setYourBalance}
              />
            </div>

            <BuyGameMoney
              contract={mainContract} 
              psp22Contract={psp22Contract}
              psp22Address={psp22ContractAddress}
              ownerAddress={ownerAddress}
              account={account} 
              gasLimit={gasLimit} 
              setMoneyNumber={setMoneyNumber}
              setYourBalance={setYourBalance}
              />

          {/* psp37 */}
          <div  className={styles.subTitle}>
            psp37
          </div>

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
            <div className={styles.container}>
            {psp37NftImageUri && (
              <>
                <img src={psp37NftImageUri} className={styles.nftImage} alt="Image"  width="300" height="300" />
              </>
            )}
              <div>
                {psp37NftName && <p style={{marginBottom: "20px"}}>Name: {psp37NftName}</p>}
                {psp37NftDescription && <p style={{marginBottom: "20px"}}>Description: {psp37NftDescription}</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
