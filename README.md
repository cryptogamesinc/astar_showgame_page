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

test contract ver.1(shibuya)
aAvEKZ4fyddW8fKLTkyFkYsyPGFdTy1GoYi1PVjFgVSBaww

ex1. set ipfs://QmYJhYes1kzp2soWYEYKzvA84V8YivL8BCpsnN773xyufr/
ex2. set ipfs://QmXtnr9aEJVywiLs1keZdyiKbQwignZT3FhwKYivF15oZp/

normal
ipfs://Qmce1gmS3s73gASHTbaNnzJNHE7mbbtq5R8pxtkaUWD1KX/
good 
ipfs://QmUcbBRAhaEMxqf2LCcXGZnVBSoUkfvkNJw3XHVEMRHbSD/
bad
ipfs://QmPaBDnTLN972GZda7oQ7EiEe4L6GAHSR2LzLuqd221785/

## 数値についての説明

このdappsにおいては、いくつかの数値を設定しています。
なお、ショーケース用であるため、効果の確認がしやすいよう、すべて短めに設定しています。

### １ Daily Bonus
- 取得ポイント：100
- クールダウン期間：５分

### 2 ステーキング
- 10秒ごとに１％増加

### 3 Buy an Apple
- 20ゲームポイントで１個取得

### 4 Get Status
- 1分ごとにステータスが変更
- hungryは+5, health, happyは-5

### 5 Eat an Apple
- 等確率（確認簡易化のため）で、次のステータスが発生(hungry, health, happyの順で記載)
- 1 通常変化（-30, +30, +30）
- 2 フルステータス (0, 100, 100)
- 3 ラッキーステータス (-50, +50, +50)
- 4 デスステータス (80, 0, 0)

-  クールダウン期間：５分

### 6 Buy Game Money
- psp22を500消費し、ゲームポイントを300取得する



## 機能についての説明


### １ Connect Walletボタンについて

ウォレット接続を行います。  

Polkadot.js, Talismanなどの対応しています。  

接続を行うと、ウォレットアドレスとソース（どのウォレットで接続しているか）が表示されます。  
(当初はフロントに設定していましたが、console画面に表示させるようにしています。)

![](src/images/1_wallet.png)

### 2 Get Contractボタンについて

コントラクトを取得するためには、下のように、provider, apiからContractPromiseでコントラクトを取得することになります。  

![](src/images/2_getContract.png)

また、コントラクト作成時にできる、jsonファイルを設定することが必要です。  

これがないと、関数の実行などを行うことができません。  

![](src/images/3_metadata.png)

### 3 Daily Bonus機能について

#### １）待機期間の設定について

下のように、待機期間を設定しています。 

設定後、現在時刻をコントラクトに書き込み、次回のDailyBonus実行時の判定に使います。

今回はモデルケースのため、5分で設定しています。
![](src/images/4_dailyBonus1.png)

#### 2）ゲーム内通貨の設定について

ゲーム内通貨はコントラクトでMappingとして設定しています。  

今回はべたうちで100としていますが、ここを関数化して、任意の数値を設定できるようにすることで汎用性が増します。

![](src/images/5_dailyBonus2.png)

### ４ Get Status機能について

ステータスの取得を行う。  

ステータスは「Hungry」「Happy」「Health」の３つがあり、時間と共に減少していく(Hungryは増える)  

ステータスの減少は前回りんごを食べた時からスタートする。  

まだ１度もりんごを食べたことがない場合は、ステータスは全て初期値の0とする

#### 1）前回りんごを食べた時間を取得

「last_eaten」で前回りんごを食べた時間を取得する。  

食べたことがない場合はステータスを0に設定する  

![](src/images/6_getCurrentStatus1.png)

#### ２）ステータスの減り具合を決定する

現在時刻から「last_eaten」を引き、経過時刻を求める。  

この際、単位はm秒となる。  

今回は図のように、１分単位で、5変化するように設定する。  

また、現在のステータスも取得する。取得できない場合は、0を取得する

![](src/images/7_getCurrentStatus2.png)

#### 3）変化後のステータスを取得する

変化するステータスを元に、変化後のステータスを取得する。  

ここでは、「saturating_sub」関数を使い、0以下になる場合は0を返すようにしている。  

![](src/images/8_getCurrentStatus3.png)

### 5 「Your Apple」, 「Your Money」, 「Staked」 機能について

コントラクトが保持しているデータを取得する。  

データは下のように、Mapping構造になっている。　　
![](src/images/9_getYourApple1.png)

取得できない場合に備え、「unwrap_or_default」関数を使用する。  　　
![](src/images/10_getYourAppleFunction.png)

### ６ Staking機能について

stakeの量が0もしくは金額不足について確認を行う。

該当すればエラー表示

![](src/images/11_stakeYourMoney.png)

ステーキング後のステーキング量、手持ちのお金の計算を行う。

![](src/images/12_stakeYourMoney2.png)

ステーキング量、手持ちのお金、現在時刻の設定を行う

![](src/images/13_stakeYourMoney3.png)

### 7 Withdraw機能について

ステーキング量を確認し、0の場合はエラーを表示する

![](src/images/14_withdrawYourMoney.png)

エラーでない場合は、引き出し後の合計額を求め、設定を行う

![](src/images/15_withdrawYourMoney2.png)