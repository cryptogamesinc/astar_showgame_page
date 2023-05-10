import { ContractPromise } from "@polkadot/api-contract";
import currentTokenUri from "@/components/CurrentTokenUri";
import currentPsp37TokenUri from "@/components/CurrentPsp37TokenUri";

export default async function tokenInfo(
  contract: ContractPromise | null,
  address: string,
  gasLimit: any,
  setNftName: (value: string) => void,
  setNftDescription: (value: string) => void,
  setNftImageUri: (value: string) => void,
  contractFlag: number
) {
  let token;

  if (contractFlag == 0) {
    token = await currentTokenUri(contract, address, gasLimit);
  } else {
    token = await currentPsp37TokenUri(contract, address, gasLimit);
  }

  if (typeof token === "string") {
    let url = `https://cloudflare-ipfs.com/ipfs/${token.replace(
      "ipfs://",
      ""
    )}`;
    console.log("url", url);
    // const response = await fetch("https://cloudflare-ipfs.com/ipfs/QmYJhYes1kzp2soWYEYKzvA84V8YivL8BCpsnN773xyufr/1.json");
    try {
      const response = await fetch(`${url}.json`);
      const json = await response.json();
      const name = json.name;
      const description = json.description;
      const image = json.image;
      const image_uri = `https://cloudflare-ipfs.com/ipfs/${image.replace(
        "ipfs://",
        ""
      )}`;
      setNftName(name || "");
      setNftDescription(description || "");
      setNftImageUri(image_uri || "");
      // return name;
    } catch (error) {
      // エラーが発生した場合の処理をここに書く
      alert("You don't have a NFT");
      console.error("Fetch error:", error);
    }
  }
}
