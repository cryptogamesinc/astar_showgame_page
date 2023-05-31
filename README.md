# WasmShowCase

WasmShowCaseはフルオンチェーンのキャラクターの育成ゲームです。

リンゴを食べさせることにより、３つのステータス（空腹、健康、幸福）がランダムに変化します。
時間の経過とともに、これらのステータスは下がってしまいますので（空腹は上がります。）注意して育成してください。

また、スタータスの合計値によって、彼らの画像や名前も変化します。リンゴを買うにはゲーム内通貨を使用する必要があります。

ゲーム内通貨を取得するには、購入、デイリーボーナス、ステーキングなどさまざまなオプションがあります。あなただけのキャラクターを育ててください。

![](https://storage.googleapis.com/zenn-user-upload/17d5f5c3d1eb-20230531.png)

-----

# Starting the Game

ゲームを始めるために、２つの選択肢があります。

1. 直接ゲームを始める場合
2. Githubからローカルに落として遊ぶ場合

## 直接ゲームを始める場合
始める前に、Polkadot系のウォレットを取得してください。

推奨：`タリスマン`、もしくは`Polkadot.js`を使用してください。メタマスクなどのEVM系のウォレットでは動作しません。

次に、ガス代である、`Shibuya`を取得します。持っていない場合には、`Faucet`から`Shibuya`を取得してください。ウォレットの準備ができ、`Shibuya`の取得ができれば、準備完了です。

まずは種のボタンを押して、あなただけのキャラクターNFT（`psp34`）を取得しましょう。なお、キャラクターNFTはアカウントにつき、１体しかミントすることができません。

## Githubからローカルに落として遊ぶ場合

次のように、Githubを使用し、ローカルで立ち上げを行います。

### メインコントラクト
まずは、`メインコントラクト`をデプロイします。

:::message
ここに該当のGithub
:::
まずはgit cloneを行います。
```sh
git clone <後で>
```
その後コントラクトのbuildを行います。

```sh
cd examples/equippable
cargo +cnightly-2023-02-07 contract build
```
最後に、`substrate`でコントラクトのデプロイを行います。
https://contracts-ui.substrate.io/

その際に`target > ink > rmrk_example_equippable`内にある`rmrk_example_equippable.contract`ファイルを使用します。

### psp22コントラクト, psp３７コントラクト

次に、`psp22`,`psp３７`用コントラクトをデプロイします。

:::message
ここに該当のGithub
:::
まずはgit cloneを行います。
```sh
git clone <後で>
```
その後コントラクトのbuildを行います。

`psp22`
```sh
cd examples/psp22_extensions/mintable
cargo +cnightly-2023-02-07 contract build
```

`psp37`
```sh
cd examples/psp37_extensions/mintable 
cargo +cnightly-2023-02-07 contract build
```

最後に、`substrate`でコントラクトのデプロイを行います。
https://contracts-ui.substrate.io/

`psp22`
その際に`psp22_extensions > mintable > target > ink`内にある`my_psp22_mintable.contractt`ファイルを使用します。

`psp37`
その際に`psp37_extensions > mintable > target > ink`内にある`my_psp37_mintable.contract`ファイルを使用します。


### フロントエンド

最後に、フロントエンドを立ち上げます。

:::message
ここに該当のGithub
:::
git cloneを行った後、`yarn`を実行します。
```sh
git clone <後で>
cd astar-showgame-page
yarn
```

`src > pages`内の`index.tsx`について、コントラクトアドレスを上で取得したものに変更します。

```js
const mainContractAddress = <Main Contract Address> 
const psp22ContractAddress = <psp22 Contract Address> 
const psp37ContractAddress = <psp37 Contract Address> 
```

ゲーム内通貨を購入した際の売上が入るアドレスを設定します。
```js
const ownerAddress = <Wallet Address>
```
最後に、`yarn dev`で立ち上げ、`http://localhost:3000/`で確認を行います。

後は「直接ゲームを始める場合」のやり方に沿って進めていきます。

# 現在ここまでです！

# Structure of a dApp

## Contract


# Frontend































This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
# Specific description of this project below

## Explanation of the values

In this dapps, several values are set.
Since this is a showcase project, all the values are short so that you can easily check the effect of the project.

### 1 Daily Bonus
- Acquisition point: 100
- Cooldown period: 5 minutes

### 2 Staking
- 1% increase every 10 seconds

### 3 Buy an Apple
- Get 1 for 20 game points

### 4 Get Status
- Status changes every minute
- +5 for hungry, -5 for healthy and happy

### 5 Eat an Apple
- The following statuses occur with equal probability (for simplicity) (listed in the order of hungry, health, happy)
- 1 Normal change (-30, +30, +30)
- 2 Full status (0, 100, 100)
- 3 Lucky status (-50, +50, +50)
- 4 Death Status (80, 0, 0)

- Cooldown period: 5 minutes

### 6 Buy Game Money
- Spend 500 psp22 and get 300 game points

### 7 Number of NFTs (psp34, psp37) acquired
- The number of NFTs acquired is limited to 1. If you try to get more than that, an error will occur.


## Explanation of URLs

The following URL is used for the URL that causes the status change.

This one was created by Pinata.
https://www.pinata.cloud/

- normal url

ipfs://Qmce1gmS3s73gASHTbaNnzJNHE7mbbtq5R8pxtkaUWD1KX/

- good url

ipfs://QmUcbBRAhaEMxqf2LCcXGZnVBSoUkfvkNJw3XHVEMRHbSD/

- bad url

ipfs://QmPaBDnTLN972GZda7oQ7EiEe4L6GAHSR2LzLuqd221785/

The multiAsset::setDefault function can also be used to facilitate initialization.

![](src/images/33_setDefault.png)

## Description of features

### 1 About Connect Wallet button

Connect Wallet connection.  

Polkadot.js, Talisman, etc. are supported.  

Once connected, the wallet address and source (which wallet you are connecting with) will be displayed.  
(Initially it was set up on the front, but now it is displayed on the CONSOLE screen.)

![](src/images/1_wallet.png)

### 2 About the Get Contract button

To get contract, you have to get contract by ContractPromise from provider, api as shown below.  

![](src/images/2_getContract.png)

It is also necessary to set up a json file, which can be done when creating the contract.  

Without it, you will not be able to execute functions, etc.  

![](src/images/3_metadata.png)

### 3 About the Daily Bonus function

#### 1） Setting the waiting period

The waiting period is set as shown below. 

After setting, the current time is written to the contract and used to determine the next time the DailyBonus is executed.

In this case, for the model case, it is set to 5 minutes.
![](src/images/4_dailyBonus1.png)

#### 2） Setting up the in-game currency

The in-game currency is set as Mapping in the contract.  

This time, the value is set to 100 as a solid value, but it can be made more versatile by making it a function so that it can be set to any value.

![](src/images/5_dailyBonus2.png)

### 4 About the Get Status function

Get Status.  

There are three statuses: "Hungry", "Happy", and "Health", and they decrease with time (Hungry increases).  

The decrease in status starts from the last time you ate an apple.  

If an apple has never been eaten before, all statuses are initially set to 0

#### 1） Obtain the time of the last time an apple was eaten

The time when the apple was last eaten is acquired by "last_eaten".  

If the apple has never been eaten, the status is set to 0.  

![](src/images/6_getCurrentStatus1.png)

#### 2） Determine the status decrement

Subtract "last_eaten" from the current time to obtain the elapsed time.  

In this case, the unit is m seconds.  

In this case, as shown in the figure, the time is set to change by 5 in increments of 1 minute.  

The current status is also obtained. If the current status cannot be obtained, 0 is obtained.

![](src/images/7_getCurrentStatus2.png)

#### 3） Obtain the status after the change

Based on the changing status, obtain the status after the change.  

Here, the "saturating_sub" function is used to return 0 if it is less than 0.  

![](src/images/8_getCurrentStatus3.png)

### 5 "Your Apple", "Your Money" and "Staked" functions

Retrieve the data held by the contract.  

The data is in a Mapping structure as shown below.　　
![](src/images/9_getYourApple1.png)

Use the "unwrap_or_default" function in case the data cannot be obtained.  　　
![](src/images/10_getYourAppleFunction.png)

### 6 Staking function

Check the amount of staking for 0 or insufficient amount.

If applicable, an error is displayed.

![](src/images/11_stakeYourMoney.png)

Calculate the amount of staking and money on hand after staking.

![](src/images/12_stakeYourMoney2.png)

Set the amount of staking, money on hand, and current time.

![](src/images/13_stakeYourMoney3.png)

### 7 Withdraw function

Check the staking amount and display an error if it is 0.

![](src/images/14_withdrawYourMoney.png)

If not an error, find the total amount after withdrawal and set

![](src/images/15_withdrawYourMoney2.png)

### 8 About Buy an Apple feature

Buy one apple with 20 in-game money  

First, check if you have more than 20 money, if not, display an error.  

If no problem, overwrite with the changed money.
![](src/images/16_buyAnApple.png)

Next, increase the number of apples by one and overwrite with !
![](src/images/17_buyAnApple2.png)

### 9 About the Get Info function

The "tokenUri" function is used to get information.

First, the token_id of ID type is obtained and converted to String type by to_string().

At that time, match is used to branch by type.

![](src/images/18_tokenUri.png)

Next, use get_condition_url function to obtain the url

However, since this is a vec type, it must be converted to a String type.

If this is not done, it cannot be combined with a numeric value.

![](src/images/19_tokenUri2.png)

The get_condition_url function returns a different string depending on the condition, as shown below.

![](src/images/20_getConditinUrl.png)

Connect the obtained URL and token ID, and return the converted string in bytes.

![](src/images/21_tokenUri3.png)

### 10 About the Eat an Apple function

First, check the elapsed time and return an error if the set time has not elapsed.

If it has elapsed, the current time is set.

![](src/images/22_eatAnApple.png)

Next, reduce the number of apples.

![](src/images/23_eatAnApple2.png)

Finally, generate pseudo-random numbers and branch.

Note that although equal probabilities are used to provide confirmation, in general, the status change for normal: 80%,
However, it is generally assumed that the probability will be changed as follows: normal status change: 80%, rare status change: 1%, and so on.

![](src/images/24_eatAnApple3.png)

Also, here is the code to obtain pseudo-random numbers

![](src/images/25_getPseudoRandom.png)

This is taken from Astar's official page below.

https://docs.astar.network/docs/build/builder-guides/xvm_wasm/pseudo_random/

### 11 About the Buy Game Money feature

From the main contract, execute the "transfer_from_contract" function of the psp22 contract.

![](src/images/26_callPsp22Transfer.png)

To do this, describe the dependencies in "Cargo.toml".

![](src/images/27_callPsp22Transfer2.png)

On the other hand, describe the use of my_psp22_mintable in lib.rs.

![](src/images/28_callPsp22Transfer3.png)

The next step is about the reference (in this case, psp22).

Set it up so that it can be used from the outside, as shown below.

![](src/images/29_callPsp22Transfer4.png)

In Cargo.toml, also add rlib so that it can be referenced by Rust from the outside.

![](src/images/30_callPsp22Transfer5.png)

Once set up, all that is left is to set the interface and execute the function you want to call.

![](src/images/31_callPsp22Transfer6.png)

In the buy_game_money function, the call_psp22_transfer function is called.

![](src/images/32_buyGameMoney.png)

### 12 About psp22,psp37

It is based on OpenBrush.

https://github.com/Supercolony-net/openbrush-contracts

- psp22.

Used to buy in-game tokens

https://contracts-ui.substrate.io/contract/WG7GLbCQLnuCyiURRaFsCsmg2E87mwbjoNvT675rxs5tgXe

- psp37 

Used as a souvenir; limited to 1 NFT per person.

Error occurs if you try to get more than 2.

https://contracts-ui.substrate.io/contract/VwRKvqjLhK4NBBwmq3QkLVcdycfqghwe8iMcs95PFQj3A3x