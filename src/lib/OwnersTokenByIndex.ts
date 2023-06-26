import { ContractPromise } from "@polkadot/api-contract";

const storageDepositLimit = null;
export default async function ownersTokenByIndex(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any
) {
  if (contract !== null) {
    const { output } = await contract.query[
      "psp34Enumerable::ownersTokenByIndex"
    ](
      address,
      {
        gasLimit: gasLimit,
        storageDepositLimit,
      },
      address,
      0
    );

    console.log("output", output);
    const humanOutput = output?.toHuman();
    console.log("humanOutput", humanOutput);
    if (
      humanOutput &&
      typeof humanOutput === "object" &&
      "Ok" in humanOutput &&
      humanOutput.Ok &&
      typeof humanOutput.Ok === "object" &&
      "Ok" in humanOutput.Ok &&
      humanOutput.Ok.Ok &&
      typeof humanOutput.Ok.Ok === "object" &&
      "U64" in humanOutput.Ok.Ok
    ) {
      console.log("output", humanOutput?.Ok?.Ok?.U64);
      return String(humanOutput?.Ok?.Ok.U64);
    }
  }
}
