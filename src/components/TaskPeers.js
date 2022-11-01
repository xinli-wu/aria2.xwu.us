import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WSContext } from '../App';
import { BitfieldCanvas } from './BitfieldCanvas';
import { SpeedCell } from './SpeedCell';

export const TaskPeers = () => {
  const { ws, isConnected, token } = useContext(WSContext);
  const { taskId } = useParams();
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        ws.call('system.multicall', [[
          { "methodName": "aria2.tellStatus", "params": [token, taskId] },
          { "methodName": "aria2.getPeers", "params": [token, taskId] }]
        ]).then((result) => {
          console.log(result[1][0]);
          setPeers([...result[1][0], result[0][0]].map(x => ({ ...x, id: x.ip || 'local' })));
        });
      }

    }, 1000);

    return () => clearInterval(interval);
  });

  const columns = [
    { width: 200, field: 'ip', headerName: 'IP', valueGetter: (params) => `${params.row.ip || params.row.id}:${params.row.port || ''}` },
    {
      width: 150, field: 'bitfield', headerName: 'Bit Fields',
      renderCell: (params) => {
        return (
          <BitfieldCanvas bitfield={params.row.bitfield} />
        );
      }
    },
    {
      width: 250, field: 'downloadSpeed', headerName: 'Download Speed',
      renderCell: (params) => {
        const { downloadSpeed, uploadSpeed } = params.row;
        return (
          <SpeedCell downloadSpeed={downloadSpeed} uploadSpeed={uploadSpeed} />
        );
      }
    },
    {
      width: 100, field: 'peerChoking', headerName: 'Peer Choking',
      renderCell: (params) => {
        const { peerChoking } = params.row;
        return (
          peerChoking ? <CheckIcon color='success' /> : <DoNotDisturbIcon color='error' />
        );
      }
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <div style={{ display: 'flex', height: 870 }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={peers}
            columns={columns}
            density="compact"
          />
        </div>
      </div>
    </Box>
  );
}

