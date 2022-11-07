import React, { useContext, useEffect, useState } from 'react';
import { WSContext } from '../App';

export const Status = () => {
  const { ws, isConnected, token } = useContext(WSContext);

  const [data, setDate] = useState(null);

  useEffect(() => {
    if (isConnected) {
      ws.call('aria2.getVersion', [token]).then((result) => {
        setDate(result);
      });
    }

  }, [ws, isConnected, token]);

  return (
    <div>
      {data?.enabledFeatures.map((x, i) => {
        return <p key={i}>{x}</p>;
      })}
    </div>
  );
}; 