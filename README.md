
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

-----

# Structure of a dApp

Now that you understand what the dApp does, let us take a closer look to its structure:

1. The frontend code lives in the `○○○` folder.
2. The smart contract code is in the `○○○` folder.

## Main Contract

The contract presents many methods

1. set_default
```rust:crates/multiasset/src/lib.rs set_default function
#[ink(message)]
        #[modifiers(only_owner)]
        pub fn set_default(&mut self, account_id: AccountId) -> Result<(), PSP34Error> {
            self.set_bad_uri(String::from("ipfs://QmV1VxGsrM4MLNn1qwR9Hmu5DGFfWjzHmhHFXpTT2fevMQ/"))?;
            self.set_normal_uri(String::from("ipfs://QmTBf9GJLiw97v84Q7aEPPFHUXdyqXWC6AUp97VnLFZtWr/"))?;
            self.set_good_uri(String::from("ipfs://QmQUxL1RSWbZAWhQfWnJJrMVZsPm4Stc5C64kRuSnXe56Q/"))?;
            self.set_your_apple(account_id, 10);
            self.set_your_money(account_id, 500);
            Ok(())
        }
```

2. set_status function
```rust:crates/multiasset/src/lib.rs set_status function
#[ink(message)]
        pub fn set_status (
            &mut self,
            token_id: u64, 
            hungry: u32,
            health: u32,
            happy: u32
        ) -> Result<(), PSP34Error>{ 
            self.ensure_exists_and_get_owner(Id::U64(token_id).clone())?;
            self.asset_status.insert(&Id::U64(token_id),&Status {hungry,health,happy});
            Ok(())
        }
```

3. set_particular_status
```rust:crates/multiasset/src/lib.rs set_particular_status
pub fn set_full_status(&mut self, token_id: u64) -> Result<(), PSP34Error> {
            self.set_status(token_id, 0, 100, 100)?;
            Ok(())
        }

pub fn set_death_status(&mut self, token_id: u64) -> Result<(), PSP34Error> {
            self.set_status(token_id, 80, 0, 0)?;
            Ok(())
        }

// to change some status
#[ink(message)]
        pub fn change_some_status(&mut self, token_id: u64, number: u32) -> Result<(), PSP34Error> {
            self.ensure_exists_and_get_owner(Id::U64(token_id).clone())?;
            let original_status = self.get_current_status(token_id.clone()).unwrap_or_else(|| {
                // In case the token_id doesn't exist in the asset_status map, we just return a default status with all fields set to 0.
                Status { hungry: 0, health: 0, happy: 0 }
            });
    
            let hungry_status: u32;
            if original_status.hungry > number {
                hungry_status = original_status.hungry - number;
            } else {
                hungry_status = 0;
            }
        
            let new_status = Status {
                hungry: hungry_status,
                health: original_status.health + number,
                happy: original_status.happy + number,
            };
        
            self.asset_status.insert(&Id::U64(token_id), &new_status);
            Ok(())
        }

pub fn set_lucky_status(&mut self, token_id: u64) -> Result<(), PSP34Error> {
            self.change_some_status(token_id.clone(),50)?;
            Ok(())
        }
```

4. get_status
```rust:crates/multiasset/src/lib.rs get_status
#[ink(message)]
        pub fn get_status(&self, token_id: u64) -> Option<Status> {
            self.asset_status.get(&Id::U64(token_id))
        }
    

#[ink(message)]
        pub fn get_current_status(&self, token_id: u64) -> Option<Status> {

            //　get the current time
            let current_time = Self::env().block_timestamp();
    
            // get the last eaten time
            let last_checked_time = self.last_eaten.get(&Id::U64(token_id)).unwrap_or(Default::default());

            if last_checked_time == 0 {
                return Some(Status {
                    hungry: 0,
                    health: 0,
                    happy: 0,
                });
            } else {
            
                let past_time = current_time - last_checked_time;
    
                // 60 seconds（60 ※ 1000 miliseconds）
                let past_day = past_time / (60 * 1000) ;
                // Assuming a hypothetical decrease of 5 per unit
                let change_status = past_day * 5;
    
                let original_status = self.get_status(token_id.clone()).unwrap_or_else(|| {
                    // In case the token_id doesn't exist in the asset_status map, we just return a default status with all fields set to 0.
                    Status { hungry: 0, health: 0, happy: 0 }
                });
    
                let new_hungy_status = original_status.hungry + (change_status as u32);
                let new_health_status = original_status.health.saturating_sub(change_status as u32);
                let new_happy_status = original_status.happy.saturating_sub(change_status as u32);
    
                return Some(Status {
                    hungry: new_hungy_status,
                    health: new_health_status,
                    happy: new_happy_status,
                });
            }
        }
```

5. call_psp22_transfer 
```rust:crates/multiasset/src/lib.rs call_psp22_transfer function
#[ink(message)]
        pub fn call_psp22_transfer(&mut self, target_account_id:AccountId, to: AccountId, value: Balance, data: Vec<u8>)  -> Result<(), PSP22Error> {
            let mut interface: Psp22ContractRef = ink::env::call::FromAccountId::from_account_id(target_account_id);
            let from = Self::env().caller();
            interface.transfer_from_contract(from, to, value, data)?;
            Ok(())
        }
```

6. buy_game_money function
```rust:crates/multiasset/src/lib.rs buy_game_money function
#[ink(message)]
        pub fn buy_game_money(&mut self, target_account_id:AccountId, to: AccountId, data: Vec<u8>) -> Result<(), ContractError>{
            let interface: Psp22ContractRef = ink::env::call::FromAccountId::from_account_id(target_account_id);
            let from = Self::env().caller();
            let money = interface.balance_of_contract(from);
            if money < 500 {
                Err(ContractError::NotEnoughMoney.into())
            } else {
                self.call_psp22_transfer(target_account_id, to, 500, data)?;
                self.plus_your_money(from, 300);
                Ok(())
            }
        }
```

7. set or get url
```rust:crates/multiasset/src/lib.rs set get url
// normal
        #[ink(message)]
        #[modifiers(only_owner)]
        pub fn set_normal_uri(&mut self, normal_uri:String) -> Result<(), PSP34Error> {
            self.normal_uri = normal_uri;
            Ok(())
        }

        #[ink(message)]
        pub fn get_normal_uri(&self) -> String {
            self.normal_uri.clone()
        }

        // good
        #[ink(message)]
        #[modifiers(only_owner)]
        pub fn set_good_uri(&mut self, good_uri:String) -> Result<(), PSP34Error> {
            self.good_uri = good_uri;
            Ok(())
        }

        #[ink(message)]
        pub fn get_good_uri(&self) -> String {
            self.good_uri.clone()
        }

        // bad
        #[ink(message)]
        #[modifiers(only_owner)]
        pub fn set_bad_uri(&mut self, bad_uri:String) -> Result<(), PSP34Error>{
            self.bad_uri = bad_uri;
            Ok(())
        }

        #[ink(message)]
        pub fn get_bad_uri(&self) -> String {
            self.bad_uri.clone()
        }
```

8. get_total_status
```rust:crates/multiasset/src/lib.rs get_total_status function
#[ink(message)]
        pub fn get_total_status(&self, token_id: u64) -> u32 {
            let original_status = self.get_current_status(token_id.clone()).unwrap_or_else(|| {
                // In case the token_id doesn't exist in the asset_status map, we just return a default status with all fields set to 0.
                Status { hungry: 0, health: 0, happy: 0 }
            });
        
            let new_status = Status {
                hungry: original_status.hungry,
                health: original_status.health,
                happy: original_status.happy,
            };
    
            let total_status = new_status.health as i32 + new_status.happy as i32 - new_status.hungry as i32;
            let result = if total_status > 0 { total_status } else { 0 };
            result as u32
        }
```

9. get_condition function
```rust:crates/multiasset/src/lib.rs get_condition function
#[ink(message)]
        pub fn get_condition(&self , token_id: u64) -> u32 {
            let condition = self.get_total_status(token_id);
            // bad condition
            if condition < 100 {
                0
            } 
            // normal condition
            else if condition < 200 {
                1
            } 
            // good condition
            else {
                2
            }
        }
```

10. get_condition_url 
```rust:crates/multiasset/src/lib.rs get_condition_url function
#[ink(message)]
        pub fn get_condition_url(&self , token_id: u64) -> String {
            let condition = self.get_condition(token_id);
            if condition == 0 {
                self.get_bad_uri()
            } else if condition == 1 {
                self.get_normal_uri()
            } else {
                self.get_good_uri()
            }
        }
```

11. eat_an_apple function
```rust:crates/multiasset/src/lib.rs eat_an_apple function
#[ink(message)]
        pub fn eat_an_apple(&mut self, token_id: u64, account_id: AccountId) -> Result<(),ContractError> {

            // get last eaten time
            let last_eaten = self.get_last_eaten(Id::U64(token_id).clone());
            // get whether time passed
            let has_passed = self.five_minutes_has_passed(last_eaten);

            if has_passed ==false {
                Err(ContractError::TimeHasNotPassed.into())
            } else {
                // get current time 
                let current_time = Self::env().block_timestamp();
                //  set last eaten time
                self.set_last_eaten(Id::U64(token_id).clone(), current_time);
                //  minus apple
                self.subtract_your_apple(account_id)?;

                // branching by pseudo random
                let random = self.get_pseudo_random(100);
                if random < 25 {
                    self.change_some_status(token_id, 30)?;
                    Ok(())
                } else if random < 50 {
                    self.set_full_status(token_id)?;
                    Ok(())
                } else if random < 75 {
                    self.set_lucky_status(token_id)?;
                    Ok(())
                } else {
                    self.set_death_status(token_id)?;
                    Ok(())
                } 
            }
        }
```

12. token_uri function
```rust:crates/multiasset/src/lib.rs token_uri function
#[ink(message)]
        pub fn token_uri(&self , token_id: u64) -> String {
            let id_string:ink::prelude::string::String = match Id::U64(token_id).clone() {
                Id::U8(u8) => {
                    let tmp: u8 = u8;
                    tmp.to_string()
                }
                Id::U16(u16) => {
                    let tmp: u16 = u16;
                    tmp.to_string()
                }
                Id::U32(u32) => {
                    let tmp: u32 = u32;
                    tmp.to_string()
                }
                Id::U64(u64) => {
                    let tmp: u64 = u64;
                    tmp.to_string()
                }
                Id::U128(u128) => {
                    let tmp: u128 = u128;
                    tmp.to_string()
                }
                // _ => "0".to_string()
                Id::Bytes(value) => ink::prelude::string::String::from_utf8(value.clone()).unwrap(),
            };
    
            let base_uri:String = self.get_condition_url(token_id.clone());
            let tmp_uri: ink::prelude::string::String = ink::prelude::string::String::from_utf8(base_uri).unwrap();
            let uri:ink::prelude::string::String = tmp_uri + &id_string;
    
            uri.into_bytes()
        }
```

13. get set function
```rust:crates/multiasset/src/lib.rs get set function
#[ink(message)]
        pub fn get_your_apple(&self, account_id: AccountId) -> u16 {
            self.apple_number.get(&account_id).unwrap_or_default()
        }


pub fn set_your_apple(&mut self, account_id: AccountId, after_apple: u16) {
            self.apple_number.insert(&account_id, &after_apple);
        }


#[ink(message)]
        pub fn get_your_money(&self, account_id: AccountId) -> u64 {
            self.your_money.get(&account_id).unwrap_or_default()
        }

pub fn set_your_money(&mut self, account_id: AccountId, after_money: u64)  {
            self.your_money.insert(&account_id, &after_money);
        }
```

14. stake_your_money 
```rust:crates/multiasset/src/lib.rs stake_your_money function
#[ink(message)]
        pub fn stake_your_money(&mut self, account_id: AccountId, stake_money: u64) -> Result<(), ContractError> {

            //　get the current time
            let current_time = Self::env().block_timestamp();

            //　get the current money
            let current_money = self.get_your_money(account_id.clone());

            //　get the current staked money
            let current_staked_money = self.get_your_staked_money(account_id.clone());

            if current_money == 0 || current_money < stake_money {
                Err(ContractError::NotEnoughMoney.into())
            } else {
                let after_money = current_money - stake_money;

                let after_staked_money = current_staked_money + stake_money;
                // set your_money 0
                self.your_money.insert(&account_id, &after_money);

                // set your_staked_money
                self.your_staked_money.insert(&account_id, &after_staked_money);

                // set last_staked
                self.last_staked.insert(&account_id, &current_time);
                Ok(())
            }
        }
```

15. get_your_staked_money
```rust:crates/multiasset/src/lib.rs get_your_staked_money function
#[ink(message)]
        pub fn get_your_staked_money(&self, account_id: AccountId) -> u64 {

            //　get the current time
            let current_time = Self::env().block_timestamp();
    
            // get your_staked_money
            let staked_money = self
                .your_staked_money
                .get(&account_id)
                .unwrap_or(Default::default());
    
            // get last_staked_time
            let last_staked_time = self
                .last_staked
                .get(&account_id)
                .unwrap_or(Default::default());
            if last_staked_time == 0 || staked_money == 0 {
                return 0
            } else {
                let past_time = current_time - last_staked_time;
                // 60 seconds（60 ※ 1000 miliseconds）
                let past_day = past_time / (10 * 1000) ;
                // Assuming a hypothetical decrease of 5 per unit
                let change_patio = past_day * 1;
                return staked_money + staked_money * change_patio / 100
            }
        }
```

16. withdraw_your_money
```rust:crates/multiasset/src/lib.rs withdraw_your_money function
#[ink(message)]
        pub fn withdraw_your_money(&mut self, account_id: AccountId) -> Result<(), ContractError> {
            let staked_money = self.get_your_staked_money(account_id);
    
            let current_money = self.get_your_money(account_id.clone());
    
            if staked_money == 0 {
                Err(ContractError::NotEnoughMoney.into())
            } else {
                let result_money = current_money + staked_money;
                // set your_staked_money 0
                self
                .your_staked_money
                .insert(&account_id, &0);
    
                // set your_money 
                self
                    .your_money
                    .insert(&account_id, &result_money);
                Ok(())
            }
        }
```

17. buy_an_apple function
```rust:crates/multiasset/src/lib.rs buy_an_apple function
#[ink(message)]
        pub fn buy_an_apple(&mut self, account_id: AccountId) -> Result<(), ContractError>{

            // the apple price is 20
            self.subtract_your_money(account_id, 20)?;
    
            // add 1
            let after_apple = self.get_your_apple(account_id) + 1;
            self.apple_number.insert(&account_id, &after_apple);
            Ok(())
        }
```

18. plus or subtract function
```rust:crates/multiasset/src/lib.rs plus or subtract function
pub fn subtract_your_apple(&mut self, account_id: AccountId) -> Result<(), ContractError> {
        
            // get apple number
            let apple_number = self.get_your_apple(account_id);
    
            if apple_number < 1 {
                Err(ContractError::NotEnoughApple.into())
            } else {
                let after_apple = apple_number - 1;
    
                self
                .apple_number
                .insert(&account_id, &after_apple);
                Ok(())
            }
        }

pub fn subtract_your_money(&mut self, account_id: AccountId, change_money: u64) -> Result<(), ContractError> {
        
            // get current game money
            let money = self.get_your_money(account_id);
    
            if money < change_money {
                Err(ContractError::NotEnoughMoney.into())
            } else {
                let after_money = money - change_money;
                self.set_your_money(account_id, after_money);
                Ok(())
            }
        }

pub fn plus_your_money(&mut self, account_id: AccountId, change_money: u64) {
        
            // get current game money
            let money = self.get_your_money(account_id);
    
            let after_money = money + change_money;
            self.set_your_money(account_id, after_money);
        }
```

19. daily_bonus function
```rust:crates/multiasset/src/lib.rs daily_bonus function
#[ink(message)]
        pub fn daily_bonus(&mut self, account_id: AccountId) -> Result<(), ContractError> {

            // Get the time when the last bonus was obtained. In case of error, return 0 
            let last_bonus = self.get_last_bonus(account_id);
            // Function of whether a predetermined amount of time has elapsed.
            let has_passed = self.five_minutes_has_passed(last_bonus);

            //  If the allotted time has not elapsed
            if has_passed ==false {
                Err(ContractError::TimeHasNotPassed.into())
            } else {
            //　Get the current time
            let current_time = Self::env().block_timestamp();
            //  Put current time in last_bonus
            self.set_last_bonus(account_id, current_time);

            let after_money = self.get_your_money(account_id) + 100;
            self.set_your_money(account_id, after_money);

            Ok(())
            }
        }
```

20. get or set time function
```rust:crates/multiasset/src/lib.rs get or set time function
#[ink(message)]
        pub fn get_last_eaten(&self, token_id: Id) -> u64 {
            self.last_eaten.get(&token_id).unwrap_or(Default::default())
        }

pub fn set_last_eaten(&mut self, token_id: Id, current_time: u64) {
            self.last_eaten.insert(&token_id, &current_time);
        }

#[ink(message)]
        pub fn get_last_bonus(&self, account_id: AccountId) -> u64 {
            self.last_bonus.get(&account_id).unwrap_or(Default::default())
        } 

pub fn set_last_bonus(&mut self, account_id: AccountId, current_time: u64) {
            self.last_bonus.insert(&account_id, &current_time);
        }
```

21. check function
```rust:crates/multiasset/src/lib.rs check function
pub fn is_nft_owner(&self, token_id: Id) -> bool {
            let token_owner = self.owner_of(token_id.clone()).unwrap();
    
            if token_owner == Self::env().caller() {
                true
            } else {
                false
            }
        }

pub fn is_account_id(&self, account_id: AccountId) -> bool {
            let caller = Self::env().caller();
            if caller == account_id {
                true
            } else {
                false
            }
        }
```
## PSP22 Contract

`OpenBrush`から変更していない部分は除きます。メインコントラクトから呼び出しを行うための実装です。
```rust:examples/psp22_extensions/mintable/lib.rs
#[ink(message)]
        pub fn transfer_from_contract(&mut self, from: AccountId, to: AccountId, value: Balance, data: Vec<u8>) -> Result<(), PSP22Error> {
            self._transfer_from_to(from, to, value, data)?;
            Ok(())
        }

#[ink(message)]
        pub fn balance_of_contract(&self, owner: AccountId) -> Balance  {
            self.balance_of(owner)
        }
```
`OpenBrush`については[こちら](https://github.com/Supercolony-net/openbrush-contracts)

## PSP37 Contract

`OpenBrush`から変更しておりません。`OpenBrush`については[こちら](https://github.com/Supercolony-net/openbrush-contracts)

## Frontend

フロントエンドは`index.tsx`と`components`フォルダからなります。

一部を抜粋します。
```rust:src/components/ConnectWalletButton.tsx/
async function connectWallet() {
    if (contract === null) {
      alert("Now connecting contract. Please wait for a minutes");
    } else {
      const { web3Accounts, web3Enable } = await import(
        "@polkadot/extension-dapp"
      );

      const allInjected = await web3Enable("my dapp");

      if (allInjected.length === 0) {
        return;
      }
      const accounts = await web3Accounts();

      const account = accounts[0];
      setAccount(account);

      const address = account?.address;
      const source = account?.meta?.source;

      console.log("address", address);
      console.log("source", source);

      setAddress(address);
      setSource(source);
      setConnected(true);

      onConnected(account, address, source);

      if (contract !== null) {
        await getInfoFunction(
          contract,
          address,
          gasLimit,
          nftName,
          nftDescription,
          nftImageUri,
          setNftName,
          setNftDescription,
          setNftImageUri,
          flag
        );
      }
    }
  }
```

```rust:src/components/GetContractButtonFunction.ts/
export default async function getContractButton(
  contractAddress: string,
  metadata: Abi,
  setApi: (value: ApiPromise | null) => void,
  setContract: (value: ContractPromise | null) => void
) {
  try {
    const provider = new WsProvider("wss://shibuya.public.blastapi.io");
    const api = await ApiPromise.create({ provider });
    const contract = new ContractPromise(api, metadata, contractAddress);
    setApi(api);
    setContract(contract);
  } catch (error) {
    console.error(error);
  }
}
```
```rust:src/components/DailyBonus.tsx/
async function dailyBonus () {
    const { web3FromSource} = await import(
      "@polkadot/extension-dapp"
    );
    if (contract !== null && account !== null) {
      const injector = await web3FromSource(account.meta.source);

      const { gasRequired, gasConsumed ,result, output }  = await contract.query["multiAsset::dailyBonus"](account.address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        }, account.address)

        console.log("### result of dry run ###" );
        console.log("### output:", output?.toHuman());
        const humanOutput = output?.toHuman();
        if (typeof humanOutput === 'object' && humanOutput !== null && 'Ok' in humanOutput && typeof humanOutput.Ok === 'object' && humanOutput.Ok !== null && 'Err' in humanOutput.Ok && typeof humanOutput.Ok.Err === 'object' && humanOutput.Ok.Err !== null && 'Rmrk' in humanOutput.Ok.Err) {
          alert("Time(5min) has not passed");
        } else {
          await contract.tx["multiAsset::dailyBonus"](
            {
              gasLimit: gasLimit,
              storageDepositLimit,
            }, account.address).signAndSend(account.address, { signer: injector.signer }, async ({ status }) => {

              if (status.isInBlock) {
                  console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                  await getYourMoneyFunction(contract, account.address, gasLimit, setMoneyNumber);
              } else {
                  console.log(`Current status: ${status.type}`);
                  console.log(`Current status: ${status.hash.toString()}`);
              }
            }).catch((error: any) => {
                console.log(':( transaction failed', error);
            });
        }
    } else {
      alert("Connect your wallet first");
    }
  }
```
```rust:src/components/TokenUri.tsx/
async function tokenUri() {
    if (contract !== null) {
      const token_number = await ownersTokenByIndex(
        contract,
        address,
        gasLimit
      );

      const { output } = await contract.query["multiAsset::tokenUri"](
        address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },
        { u64: token_number }
      );

      console.log("output", output);
      const humanOutput = output?.toHuman();
      if (
        humanOutput &&
        typeof humanOutput === "object" &&
        "Ok" in humanOutput
      ) {
        let a = console.log("aaa", humanOutput?.Ok);
        setTokenUri(String(humanOutput?.Ok));
      }
    }
  }
```

## Testing
WASMのコントラクトでは、`#[ink::test]`を使用し、テストを行うことができます。


```
cd examples/equippable
cargo +nightly-2023-02-07 test
```

```rust:examples/equippable/lib.rs/
 // default_apple_value test
#[ink::test]
fn default_apple_value() {
    let contract = Contract::new();
    let account = AccountId::from([0x0; 32]);
    assert_eq!(contract.get_your_apple(account), 0);
}

 // set_and_get_apple test
#[ink::test]
fn set_and_get_apple() {
    let mut contract = Contract::new();
    let account = AccountId::from([0x1; 32]);
    contract.set_your_apple(account, 10);
    assert_eq!(contract.get_your_apple(account), 10);
}

// set_and_get_apple test
#[ink::test]
fn set_default_works() {
    let accounts = default_accounts();
    let mut contract = Contract::new_with_owner(accounts.alice);

    set_caller(accounts.alice);
    assert!(contract.set_default(accounts.alice.clone()).is_ok());

    assert_eq!(contract.get_bad_uri(), String::from("ipfs://QmV1VxGsrM4MLNn1qwR9Hmu5DGFfWjzHmhHFXpTT2fevMQ/"));
    assert_eq!(contract.get_normal_uri(), String::from("ipfs://QmTBf9GJLiw97v84Q7aEPPFHUXdyqXWC6AUp97VnLFZtWr/"));
    assert_eq!(contract.get_good_uri(), String::from("ipfs://QmQUxL1RSWbZAWhQfWnJJrMVZsPm4Stc5C64kRuSnXe56Q/"));
    assert_eq!(contract.get_your_apple(accounts.alice.clone()), 10);
    assert_eq!(contract.get_your_money(accounts.alice.clone()), 500);
}

// set_and_get_apple test
#[ink::test]
fn get_current_status_works() {
    let accounts = default_accounts();
    set_caller(accounts.alice);
    let mut contract = Contract::new_with_owner(accounts.alice);
    let token_id: u64 = 1;
        // mint a new token
    assert!(contract.mint(accounts.alice, Id::U64(token_id).clone()).is_ok());

    contract.set_status(token_id.clone(), 100, 100, 100).unwrap();
    let initial_status = contract.get_status(token_id.clone()).unwrap();
    assert_eq!(initial_status, Status { hungry: 100, health: 100, happy: 100 });

    // get current time. but return 0 in test environment
    // let current_time = ink::env::block_timestamp::<ink::env::DefaultEnvironment>().into();

    // assume already eaten an apple at 1 second
    contract.set_last_eaten(Id::U64(token_id).clone(), 1 * 1000); // 1 second

    // Let's simulate the passage of time
    set_block_timestamp(61 * 1000); // 61 seconds
    let status_after_time = contract.get_current_status(token_id.clone()).unwrap();
    
    // // We need to manually calculate the expected new statuses because they are time-dependent
    let expected_status = Status {
        hungry: 105, // 100 + 5 (1 minute passed, so status increases by 5)
        health: 95, // 100 - 5
        happy: 95, // 100 - 5
    };
    assert_eq!(status_after_time, expected_status);

    let total_status = contract.get_total_status(token_id.clone());

    assert_eq!(total_status, 85); // 95 + 95 - 105

    set_block_timestamp(6000 * 1000); // 6000 seconds (100 minutes)

    let status_after_many_time_passed = contract.get_current_status(token_id.clone()).unwrap();

    let expected_status_many_time_passed = Status {
        hungry: 595, // 100 + 5 * 99 (100 minute passed, so status increases by 5)
        health: 0, // 100 - 5 * 99 , but not less than 0
        happy: 0, // 100 - 5 * 99 , but not less than 0
    };
    assert_eq!(status_after_many_time_passed, expected_status_many_time_passed);

    let total_status_many_time_passed = contract.get_total_status(token_id.clone());

    assert_eq!(total_status_many_time_passed, 0); // 0 + 0 - 595, but not less than 0

}

// set_and_get_apple test
#[ink::test]
fn buy_an_apple_works() {
    let mut contract = Contract::default();
    let accounts = test::default_accounts::<Environment>();
    
    contract.set_your_money(accounts.alice, 50);

    assert!(contract.buy_an_apple(accounts.alice).is_ok());

    assert_eq!(contract.get_your_apple(accounts.alice), 1);
}

// set_and_get_apple test
#[ink::test]
fn buy_an_apple_fails_without_enough_money() {
    let mut contract = Contract::default();
    let accounts = test::default_accounts::<Environment>();

    assert!(contract.buy_an_apple(accounts.alice).is_err());
}

// set_and_get_apple test
#[ink::test]
fn get_your_apple_works() {
    let contract = Contract::default();
    let accounts = test::default_accounts::<Environment>();

    assert_eq!(contract.get_your_apple(accounts.alice), 0);
}

// set_and_get_apple test
#[ink::test]
fn eat_an_apple_works() {
    let mut contract = Contract::default();
    let accounts = test::default_accounts::<Environment>();
    let token_id: u64 = 1;

    assert!(contract.mint(accounts.alice, Id::U64(token_id).clone()).is_ok());

    contract.set_your_money(accounts.alice, 50);

    contract.buy_an_apple(accounts.alice).unwrap();

    contract.set_last_eaten(Id::U64(token_id).clone(), 1 * 1000); // 1 second

    set_block_timestamp(6000 * 1000); // 600 seconds (10 minutes)
    
    assert!(contract.eat_an_apple(token_id, accounts.alice).is_ok());
    
    assert_eq!(contract.get_your_apple(accounts.alice), 0);
}

// set_and_get_apple test
#[ink::test]
fn eat_an_apple_works_without_enough_time() {
    let mut contract = Contract::default();
    let accounts = test::default_accounts::<Environment>();
    let token_id: u64 = 1;

        // mint a new token
    assert!(contract.mint(accounts.alice, Id::U64(token_id).clone()).is_ok());

    contract.set_your_money(accounts.alice, 50);

    contract.buy_an_apple(accounts.alice).unwrap();

    contract.set_last_eaten(Id::U64(token_id).clone(), 590 * 1000); // 590 seconds

    set_block_timestamp(600 * 1000); // 600 seconds (only 10 seconds has passed)
    
    assert!(contract.eat_an_apple(token_id, accounts.alice).is_err());
    
    assert_eq!(contract.get_your_apple(accounts.alice), 1);
}
```

# ここまでです！
















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

ipfs://QmTBf9GJLiw97v84Q7aEPPFHUXdyqXWC6AUp97VnLFZtWr/

- good url

ipfs://QmQUxL1RSWbZAWhQfWnJJrMVZsPm4Stc5C64kRuSnXe56Q/

- bad url

ipfs://QmV1VxGsrM4MLNn1qwR9Hmu5DGFfWjzHmhHFXpTT2fevMQ/

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