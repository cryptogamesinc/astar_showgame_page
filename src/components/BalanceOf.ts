import { ContractPromise } from "@polkadot/api-contract";

const storageDepositLimit = null;
export default async function balanceOf(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any
) {
  if (contract !== null) {
    const { output } = await contract.query["psp37::balanceOf"](
      address,
      {
        gasLimit: gasLimit,
        storageDepositLimit,
      },
      address,
      { u64: 0 }
    );
    const humanOutput = output?.toHuman();
    if (
      humanOutput &&
      typeof humanOutput === "object" &&
      "Ok" in humanOutput &&
      humanOutput?.Ok &&
      humanOutput?.Ok == 0
    ) {
      return false;
    } else {
      return true;
    }
  }
}
