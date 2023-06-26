import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { Abi } from "@polkadot/api-contract";

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
