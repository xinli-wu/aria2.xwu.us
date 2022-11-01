import React, { useContext, useEffect } from 'react';
import { WSContext } from '../App';

export const Home = () => {
  const { ws, isConnected, token } = useContext(WSContext);

  useEffect(() => {
    const interval = setInterval(function () {
      if (isConnected) {
        ws.call('aria2.getGlobalStat', [token]).then((result) => {
          document.title = JSON.stringify(result);
        });
        ws.call('aria2.tellActive', [token]).then(() => {

        });
      }

    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div>
      Home
    </div>
  );
}; 