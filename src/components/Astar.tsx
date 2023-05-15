// astar.tsx
import React from 'react';
import styles from '@/styles/Home.module.css'

const Astar: React.FC = () => {
  const redirectToAstarNetwork = () => {
    window.open('https://faucet.triangleplatform.com/astar/shibuya', '_blank');
  };

  return (
    <div  className={styles.header_bottun}  onClick={redirectToAstarNetwork}>
      Faucet
    </div>
  );
};

export default Astar;