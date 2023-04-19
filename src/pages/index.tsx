import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { BN, BN_ONE } from "@polkadot/util";
import type { WeightV2 } from '@polkadot/types/interfaces'
import '@polkadot/api-augment'
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useState, useEffect } from 'react'
const { Keyring } = require('@polkadot/keyring');
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";

import ConnectWalletButton from '@/components/ConnectWalletButton';
import GetContractButton from '@/components/GetContractButton';
import TotalSupply from '@/components/TotalSupply';

import metadata from "./metadata.json";

const inter = Inter({ subsets: ['latin'] })

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);
const storageDepositLimit = null;

const apiKey = process.env.NEXT_PUBLIC_MNEMONIC;
const DAILY_AMOUNT = 100;

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  
// main().then(() => console.log('completed'))

export default function Home() {
  const [address, setAddress] = useState('');
  const [source, setSource] = useState('');
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);;
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [contract, setContract] = useState<ContractPromise | null>(null);

  const [totalSupply, setTotalSupply] = useState('');
  const [tokenUri, setTokenUri] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftImageUri, setNftImageUri] = useState('');
  const [outputs, setOutputs] = useState<string[]>([]);

  const [contractAddress, setContractAddress] = useState('');
  const [toContractAddress, setToContractAddress] = useState('');
  const [getContractResult, setGetContractResult] = useState("");

  const [tokenId, setTokenId] = useState('');;
  const [baseUri, setBaseUri] = useState('');;

  const [status, setStatus] = useState('');;
  const [connectedAccount, setConnectedAccount] = useState<InjectedAccountWithMeta | null>(null);


  const handleConnected = (account: InjectedAccountWithMeta, address: string, source: string) => {
    setConnectedAccount(account);
    setAddress(address);
    setSource(source);
  };

  const handleContractFetched = (api: ApiPromise, contract: ContractPromise) => {
    setApi(api);
    setContract(contract);
    console.log("contract", contract);
    setGetContractResult("OK");
  };

  function createGasLimit(refTime: number | BN) {
    const refTimeBN = refTime instanceof BN ? refTime : new BN(refTime);
    return api?.registry.createType('WeightV2', {
      refTime: refTimeBN,
      proofSize: PROOFSIZE,
    }) as WeightV2;
  }

  async function mint () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);
      await contract.tx['minting::mint'](
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

  async function setToBaseUri () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);
      await contract.tx['psp34Traits::setBaseUri'](
        {
          gasLimit: createGasLimit(100000000000),
          storageDepositLimit,
        },baseUri).signAndSend(account.address, { signer: injector.signer }, ({ status }) => {

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
  async function getTokenUri () {
    if (contract !== null) {
      const { output }  = await contract.query['minting::tokenUri'](address,
        {
          gasLimit: createGasLimit(MAX_CALL_WEIGHT),
          storageDepositLimit,
        },tokenId)
    
        const humanOutput = output?.toHuman();
        let url = ""
        if (typeof humanOutput === 'object' && humanOutput && 'Ok' in humanOutput)  {

          const uri = humanOutput.Ok
          
          if (typeof uri === 'string') {
            url = `https://cloudflare-ipfs.com/ipfs/${uri.replace('ipfs://', '')}`;
            setTokenUri(uri || "");
          }
          
        } else {
          console.error('Unexpected output format:', humanOutput);
        }
    
        const response = await fetch(url);
        const json = await response.json();
        const name = json.name;
        const description = json.description;
        const image = json.image;
        const imate_uri =  `https://cloudflare-ipfs.com/ipfs/${image.replace('ipfs://', '')}`;
        console.log("imate_url",imate_uri)

        setNftName(name || "");
        setNftDescription(description || "");
        setNftImageUri(imate_uri || "");

    }
  }

  async function getStatus () {
    if (contract !== null) {

      console.log("tokenId",tokenId)
      const bigIntValue = BigInt(tokenId);
      console.log("bigIntValue",bigIntValue)
      const u64Value = api?.createType('u64', bigIntValue);
      console.log("u64Value",u64Value)

      

      const { output }  = await contract.query['multiAsset::getStatus'](address,
        {
          gasLimit: createGasLimit(MAX_CALL_WEIGHT),
          storageDepositLimit,
        },u64Value)
    
        const humanOutput = output?.toHuman();
        let url = ""
        if (typeof humanOutput === 'object' && humanOutput && 'Ok' in humanOutput)  {

          const uri = humanOutput.Ok
          
          if (typeof uri === 'string') {
            url = `https://cloudflare-ipfs.com/ipfs/${uri.replace('ipfs://', '')}`;
            setStatus(uri || "");
          }
          
        } else {
          console.error('Unexpected output format:', humanOutput);
        }

    }
  }

  async function get() {
    if (contract !== null && totalSupply !== null) {
      const newOutputs = [];
  
      type HumanOutputType = {
        Ok?: {
          Ok?: {
            U64?: string;
          };
        };
      };
  
      for (let i = 0; i < parseInt(totalSupply); i++) {
        const { output } = await contract.query['psp34Enumerable::ownersTokenByIndex'](
          address,
          {
            gasLimit: createGasLimit(MAX_CALL_WEIGHT),
            storageDepositLimit,
          },
          address,
          i
        );
  
        const humanOutput = output?.toHuman() as HumanOutputType;
        const value = humanOutput?.Ok?.Ok?.U64;
        if (value !== undefined) {
          newOutputs.push(value);
        }
      }
      setOutputs(newOutputs);
      console.log('newOutputs', newOutputs);
    }
  }

  return (
    <>
    {/* <div style={{position: 'relative'}}>
    {isProcessing && <RingLoader color={"#36D7B7"} loading={isProcessing} className={styles.loadingContainer} style={{display: 'block', margin: '0 auto', borderColor: 'red'}}size={150} />}
    </div>
     */}
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 style={{marginBottom: "80px"}}>Get Your Contract Information(psp34)</h1>
        <div className={styles.description}>
          <div>
            <ConnectWalletButton onConnected={handleConnected} />

            contractAddress:<input  style={{width: "400px"}} type="text" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
            <h6 style={{color: "red",marginBottom: "20px",fontWeight: 300}}>
              contracts made by ArtZero can be set<br/>
              https://github.com/ArtZero-io/Contracts/tree/feature/ink-4-version/Azero_Contracts/contracts/psp34_standard
            </h6>

            <GetContractButton contractAddress={contractAddress} onContractFetched={handleContractFetched} />

            {getContractResult && <p>Get Contract result: {getContractResult}</p>}

            baseURI:<input  style={{width: "400px"}} type="text" value={baseUri} onChange={(e) => setBaseUri(e.target.value)} />
            <h6 style={{color: "red",marginBottom: "20px",fontWeight: 300}}>
              Now only ipfs can be set<br/>
              ex1. set ipfs://QmYJhYes1kzp2soWYEYKzvA84V8YivL8BCpsnN773xyufr/<br/>
              ex2. set ipfs://QmXtnr9aEJVywiLs1keZdyiKbQwignZT3FhwKYivF15oZp/<br/>
            </h6>
            <button className={styles.rotatebutton} onClick={setToBaseUri}>set base uri</button>

            <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={mint}>mint</button>

            
            <TotalSupply contract={contract} address={address} />

            {totalSupply && <p style={{marginBottom: "20px"}}>TotalSupply: {totalSupply}</p>}

            <button className={styles.rotatebutton} onClick={get}>get your TokenIDs</button>

            <>
              {outputs.map((output, index) => (
                <div key={index}>
                  <p>Token ID: {output}</p>
                  {/* ここにその他の表示内容を追加 */}
                </div>
              ))}
            </>

            tokenID:<input  style={{width: "400px",marginTop: "20px"}} type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
            <button className={styles.rotatebutton} onClick={getTokenUri}>get Token Information</button>
            {tokenUri && <p style={{marginBottom: "20px"}}>TokenURI: {tokenUri}</p>}
            {nftName && <p style={{marginBottom: "20px"}}>Name: {nftName}</p>}
            {nftDescription && <p style={{marginBottom: "20px"}}>Description: {nftDescription}</p>}
            {nftImageUri && (
            <>
              <h4 style={{marginBottom: "10px"}}>Image</h4>
              <img src={nftImageUri} alt="Image"  width="300" height="300" />
            </>
            
            )}

            tokenID:<input  style={{width: "400px",marginTop: "20px"}} type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
            <button className={styles.rotatebutton} onClick={getStatus}>get Status</button>
            {tokenUri && <p style={{marginBottom: "20px"}}>Status: {status}</p>}

          </div>
        </div>
      </main>
    </>
  )
}
