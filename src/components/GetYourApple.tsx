import React from "react";
import { ContractPromise } from "@polkadot/api-contract";
import styles from "@/styles/Home.module.css";

type GetYourAppleProps = {
  contract: ContractPromise | null;
  address: string;
  gasLimit: any;
  appleNumber: number | null;
  setAppleNumber: (value: number | null) => void;
};

const GetYourApple: React.FC<GetYourAppleProps> = ({
  contract,
  address,
  gasLimit,
  appleNumber,
  setAppleNumber,
}) => {
  const storageDepositLimit = null;
  async function getYourApple() {
    if (contract !== null && address !== "") {
      const { output } = await contract.query["getYourApple"](
        address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },
        address
      );

      console.log("output", output);
      const humanOutput = output?.toHuman();
      if (
        humanOutput &&
        typeof humanOutput === "object" &&
        "Ok" in humanOutput
      ) {
        setAppleNumber(Number(humanOutput?.Ok));
        console.log("humanOutput?.Ok", humanOutput?.Ok);
      }
    } else {
      alert("Connect your wallet first");
    }
  }

  return (
    <>
      <div className={styles.container_number}>
        <button className={styles.rotatebutton} onClick={getYourApple}>
          your Apple
        </button>
        {appleNumber && <span className={styles.number}>{appleNumber}</span>}
      </div>
    </>
  );
};

export default GetYourApple;
