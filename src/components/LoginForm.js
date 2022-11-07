import LoadingButton from '@mui/lab/LoadingButton';
import { LinearProgress, Paper, Stack, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useContext, useState } from 'react';
import { WSContext } from '../App';

export const LoginForm = () => {
  const { rpc, setRpc, token, setToken, isConnected } = useContext(WSContext);

  const { host, port, path } = rpc || { host: 'localhost', port: '6800', path: 'jsonrpc' };

  const [server, setServer] = useState({ host, port, path });

  const [formToken, setFormToken] = useState('');

  const onRpcHostChange = (e) => {
    setServer(prev => ({ ...prev, host: e.target.value }));
  };
  const onRpcPortChange = (e) => {
    setServer(prev => ({ ...prev, port: e.target.value }));
  };
  const onRpcPathChange = (e) => {
    setServer(prev => ({ ...prev, path: e.target.value }));
  };

  const onRpcTokenChange = (e) => {
    setFormToken(e.target.value);
  };

  const onConnectClick = () => {
    localStorage.setItem('serverInfo', JSON.stringify({ rpc: server, token: formToken }));
    setRpc(server);
    setToken(`token:${formToken}`);
  };

  return (
    <>
      {rpc && token && !isConnected && <LinearProgress />}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper sx={{ width: '70%', maxWidth: 500, position: 'absolute', top: 200 }}>
          <Stack spacing={4} sx={{ m: 4 }}>
            <Stack direction={'row'}>
              <TextField
                label='Aria2 Server'
                sx={{ width: '50ch' }}
                InputProps={{ startAdornment: <InputAdornment position='start'>wws://</InputAdornment>, }}
                variant='standard'
                value={server.host}
                onChange={onRpcHostChange}
              />
              <TextField
                label='Port'
                sx={{ width: '15ch' }}
                InputProps={{ startAdornment: <InputAdornment position='start'>:</InputAdornment>, }}
                variant='standard'
                type={'number'}
                value={server.port}
                onChange={onRpcPortChange}
              />
              <TextField
                label='Path'
                sx={{ width: '15ch', maxWidth: '15ch' }}
                InputProps={{ startAdornment: <InputAdornment position='start'>/</InputAdornment>, }}
                variant='standard'
                value={server.path}
                onChange={onRpcPathChange}
              />
            </Stack>
            <TextField
              label='Token'
              InputLabelProps={{ shrink: true, }}
              type={'password'}
              variant='standard'
              onChange={onRpcTokenChange}
            />
            <Stack direction={'row'} spacing={2} sx={{ justifyContent: 'end' }}>
              {/* <Button onClick={onConnectClick} disabled={rpc && token && !isConnected}>Clear</Button> */}
              <LoadingButton
                size="small"
                onClick={onConnectClick}
                loading={rpc && token && !isConnected}
                variant="contained"
                disabled={rpc && token && !isConnected}
              >
                Connect
              </LoadingButton>
            </Stack>
          </Stack>
        </Paper>
      </Box >
    </>
  );
};
