import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WSContext } from '../App';
import { BitfieldCanvas } from './BitfieldCanvas';
import { SpeedCell } from './SpeedCell';
import { TableCellMultiLine } from './TableCellMultiLine';

export const TaskPeers = () => {
  const { ws, isConnected, token } = useContext(WSContext);
  const { taskId } = useParams();
  const [peers, setPeers] = useState([]);
  const ipGeoInfo = useMemo(() => ({}), []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        ws.call('system.multicall', [[
          { 'methodName': 'aria2.tellStatus', 'params': [token, taskId] },
          { 'methodName': 'aria2.getPeers', 'params': [token, taskId] }]
        ]).then((result) => {
          setPeers([result[0][0], ...result[1][0]].map((x, i) => ({ ...x, id: i })));
        });
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [ws, isConnected, token, taskId]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const filteredRemotePeers = peers.filter(x => x.ip && !ipGeoInfo[x.ip]);
      const geoInfo = await Promise.all(filteredRemotePeers.map(x => axios(`https://api.ip.xwu.us/${x.ip}`, { signal: controller.signal })));
      geoInfo.filter(x => x.status === 200).forEach(({ data }) => ipGeoInfo[data.ip] = data);
    })();
    return () => controller.abort();
  }, [peers, ipGeoInfo]);

  const columns = [
    { width: 180, field: 'ip', headerName: 'IP', valueGetter: (params) => `${params.row.ip || '(local)'}:${params.row.port || ''}` },
    {
      width: 220, field: 'location', headerName: 'Location', align: 'right',
      renderCell: (params) => {
        const { city, region, country, continent } = ipGeoInfo[params.row.ip] || {};

        return ipGeoInfo[params.row.ip] &&
          <TableCellMultiLine data={[`${city}, ${region}`, `${country}, ${continent}`]} />;

      }
    },
    {
      width: 200, field: 'isp', headerName: 'ISP', align: 'right',
      renderCell: (params) => {
        const { isp } = ipGeoInfo[params.row.ip] || {};
        return ipGeoInfo[params.row.ip] && <TableCellMultiLine data={[isp]} />;

      }
    },
    {
      width: 150, field: 'bitfield', headerName: 'Bit Fields',
      renderCell: (params) => {
        return (
          params.row.bitfield && <BitfieldCanvas bitfield={params.row.bitfield} />
        );
      }
    },
    // {
    //   width: 150, field: 'progress', headerName: 'Progress',
    //   renderCell: (params) => {
    //     const bin = hex2bin(params.row.bitfield);
    //     console.log(bin);
    //     const count = (bin.match(/1/g) || []).length;
    //     return <ProgressChart progress={count / bin.length} />;
    //   }
    // },
    {
      width: 250, field: 'speed', headerName: 'Speed',
      renderCell: (params) => {
        const { id, downloadSpeed, uploadSpeed } = params.row;
        return (
          <SpeedCell
            downloadSpeed={id ? uploadSpeed : downloadSpeed}
            uploadSpeed={id ? downloadSpeed : uploadSpeed}
          />
        );
      }
    },
    {
      width: 125, field: 'connections', headerName: 'Connections',
      renderCell: (params) => {
        const { connections, numSeeders } = params.row;
        return (
          <Typography>{numSeeders && connections && `${numSeeders}/${connections}`}</Typography>
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

