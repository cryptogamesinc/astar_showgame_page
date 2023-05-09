// astar.tsx
import React from 'react';
import styles from '@/styles/Home.module.css'

const Astar: React.FC = () => {
  const redirectToAstarNetwork = () => {
    window.open('https://faucet.triangleplatform.com/astar/shibuya', '_blank');
  };

  return (
    <button className={styles.rotatebutton} style={{marginBottom: "20px"}} onClick={redirectToAstarNetwork}>
      Astar Networkにアクセス
    </button>
  );
};

export default Astar;