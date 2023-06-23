import { ContractPromise } from "@polkadot/api-contract";
import ownersTokenByIndex from "@/lib/OwnersTokenByIndex";

const storageDepositLimit = null;
export default async function currentTokenUri(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any
) {
  if (contract !== null) {
    const token_number = await ownersTokenByIndex(contract, address, gasLimit);
    const { output } = await contract.query["tokenUri"](
      address,
      {
        gasLimit: gasLimit,
        storageDepositLimit,
      },
      { u32: token_number }
    );

    console.log("output", output);
    const humanOutput = output?.toHuman();
    if (humanOutput && typeof humanOutput === "object" && "Ok" in humanOutput) {
      return String(humanOutput?.Ok);
    }
  }
}
