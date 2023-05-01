import { ContractPromise } from "@polkadot/api-contract";
import currentTokenUri from "@/components/CurrentTokenUri";

export default async function tokenInfo(
  mainContract: ContractPromise | null,
  address: string,
  gasLimit: any,
  setTokenUri: (value: string) => void,
  setNftName: (value: string) => void,
  setNftDescription: (value: string) => void,
  setNftImageUri: (value: string) => void
) {
  const token = await currentTokenUri(
    mainContract,
    address,
    gasLimit,
    setTokenUri
  );

  if (typeof token === "string") {
    let url = `https://cloudflare-ipfs.com/ipfs/${token.replace(
      "ipfs://",
      ""
    )}`;
    console.log("url", url);
    // const response = await fetch("https://cloudflare-ipfs.com/ipfs/QmYJhYes1kzp2soWYEYKzvA84V8YivL8BCpsnN773xyufr/1.json");
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
  }
}
