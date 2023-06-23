import { ContractPromise } from "@polkadot/api-contract";
import balanceOf from "@/lib/BalanceOf";

const storageDepositLimit = null;
export default async function currentPsp37TokenUri(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any
) {
  if (contract !== null) {
    const balance = await balanceOf(contract, address, gasLimit);

    if (balance) {
      const { output } = await contract.query.getBaseUri(address, {
        gasLimit: gasLimit,
        storageDepositLimit,
      });

      console.log("output", output);
      const humanOutput = output?.toHuman();
      if (
        humanOutput &&
        typeof humanOutput === "object" &&
        "Ok" in humanOutput
      ) {
        return String(humanOutput?.Ok);
      }
    } else {
      return String("error");
    }
  }
}
