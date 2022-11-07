import React, { useContext, useEffect, useState } from 'react';
import { WSContext } from '../App';

export const Waiting = () => {
  const { ws, isConnected, token } = useContext(WSContext);

  const [lobalStat, setGlobalStat] = useState({});

  useEffect(() => {
    const interval = setInterval(function () {
      if (isConnected) {
        ws.call('aria2.tellWaiting', [token, 0, 1000]).then((result) => {

        });
      }

    }, 1000);
    return () => clearInterval(interval);
  }, [ws, isConnected, token]);

  return (
    <div>
      Downloading
    </div>
  );
}; 