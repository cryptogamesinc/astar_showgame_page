import { ContractPromise } from "@polkadot/api-contract";

const storageDepositLimit = null;
export default async function currentPsp37TokenUri(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any
) {
  if (contract !== null) {
    const { output } = await contract.query.getBaseUri(address, {
      gasLimit: gasLimit,
      storageDepositLimit,
    });

    console.log("output", output);
    const humanOutput = output?.toHuman();
    if (humanOutput && typeof humanOutput === "object" && "Ok" in humanOutput) {
      return String(humanOutput?.Ok);
    }
  }
}
