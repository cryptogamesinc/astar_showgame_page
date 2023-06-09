import React from "react";
import { ContractPromise } from "@polkadot/api-contract";
import styles from "@/styles/Home.module.css";
import ownersTokenByIndex from "@/lib/OwnersTokenByIndex";

type GetStatusProps = {
  contract: ContractPromise | null;
  address: string;
  gasLimit: any;
  hungryStatus: string | number | null;
  healthStatus: string | number | null;
  happyStatus: string | number | null;
  setHungryStatus: (value: string | number | null) => void;
  setHealthStatus: (value: string | number | null) => void;
  setHappyStatus: (value: string | number | null) => void;
};

const GetStatus: React.FC<GetStatusProps> = ({
  contract,
  address,
  gasLimit,
  hungryStatus,
  healthStatus,
  happyStatus,
  setHungryStatus,
  setHealthStatus,
  setHappyStatus,
}) => {
  const storageDepositLimit = null;
  async function getStatus() {
    if (contract !== null && address !== "") {
      const token_number = await ownersTokenByIndex(
        contract,
        address,
        gasLimit
      );

      const { output, result } = await contract.query["getCurrentStatus"](
        address,
        {
          gasLimit: gasLimit,
          storageDepositLimit,
        },
        { u64: token_number }
      );

      console.log("output", output);
      console.log("result", result);
      const humanOutput = output?.toHuman();
      console.log("humanOutput", humanOutput);

      if (
        typeof humanOutput === "object" &&
        humanOutput !== null &&
        "Ok" in humanOutput
      ) {
        const okObject = humanOutput.Ok;
        // 設定されていない場合
        if (okObject === null) {
          setHungryStatus(null);
          setHealthStatus(null);
          setHappyStatus(null);
        }
        if (
          typeof okObject === "object" &&
          okObject !== null &&
          "hungry" in okObject &&
          "health" in okObject &&
          "happy" in okObject
        ) {
          const hungryValue = okObject.hungry;
          const healthValue = okObject.health;
          const happyValue = okObject.happy;

          // hungryValue が string または number であることを確認
          if (
            (typeof hungryValue === "string" ||
              typeof hungryValue === "number") &&
            (typeof healthValue === "string" ||
              typeof healthValue === "number") &&
            (typeof happyValue === "string" || typeof happyValue === "number")
          ) {
            console.log("hungryValue", hungryValue);

            // setStatus を使って hungryValue を保存
            setHungryStatus(hungryValue);
            setHealthStatus(healthValue);
            setHappyStatus(happyValue);
          }
        }
      }
    } else {
      alert("Connect your wallet first");
    }
  }

  return (
    <>
      <button className={styles.rotatebutton} onClick={getStatus}>
        get Status
      </button>
      {hungryStatus && (
        <p style={{ marginBottom: "20px" }}>hungry: {hungryStatus}</p>
      )}
      {healthStatus && (
        <p style={{ marginBottom: "20px" }}>health: {healthStatus}</p>
      )}
      {happyStatus && (
        <p style={{ marginBottom: "20px" }}>happy: {happyStatus}</p>
      )}
    </>
  );
};

export default GetStatus;
