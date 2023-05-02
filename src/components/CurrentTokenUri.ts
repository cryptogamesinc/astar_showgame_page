import { ContractPromise } from "@polkadot/api-contract";
import ownersTokenByIndex from "@/components/OwnersTokenByIndex";

const storageDepositLimit = null;
export default async function currentTokenUri(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any,
  setTokenUri: (value: string) => void
) {
  if (contract !== null) {
    const token_number = await ownersTokenByIndex(contract, address, gasLimit);
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
    if (humanOutput && typeof humanOutput === "object" && "Ok" in humanOutput) {
      setTokenUri(String(humanOutput?.Ok));
      return String(humanOutput?.Ok);
    }
  }
}
