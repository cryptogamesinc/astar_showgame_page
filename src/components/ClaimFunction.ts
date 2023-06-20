import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

const storageDepositLimit = null;

export default async function claimFunction(
  contract: ContractPromise | null,
  account: InjectedAccountWithMeta | null,
  gasLimit: any
) {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  if (contract !== null && account !== null) {
    const injector = await web3FromSource(account.meta.source);

    const { gasRequired, gasConsumed, result, output } = await contract.query[
      "claimANft"
    ](account.address, {
      gasLimit: gasLimit,
      storageDepositLimit,
    });

    console.log("### result of dry run ###");
    console.log("### output:", output?.toHuman());
    const humanOutput = output?.toHuman();
    if (
      typeof humanOutput === "object" &&
      humanOutput !== null &&
      "Ok" in humanOutput &&
      typeof humanOutput.Ok === "object" &&
      humanOutput.Ok !== null &&
      "Err" in humanOutput.Ok
    ) {
      const message = humanOutput.Ok?.Err;
      console.log(message);
      alert("Already had an NFT");
    } else {
      await contract.tx["claimANft"]({
        gasLimit: gasLimit,
        storageDepositLimit,
      })
        .signAndSend(
          account.address,
          { signer: injector.signer },
          ({ status }) => {
            if (status.isInBlock) {
              console.log(
                `Completed at block hash #${status.asInBlock.toString()}`
              );
            } else {
              console.log(`Current status: ${status.type}`);
              console.log(`Current status: ${status.hash.toString()}`);
            }
          }
        )
        .catch((error: any) => {
          console.log(":( transaction failed", error);
        });
    }
  } else {
    alert("Connect your wallet first");
  }
}
