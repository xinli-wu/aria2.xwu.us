import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import React, { useState } from 'react';

export const LandingForm = () => {
  const localStorageServer = JSON.parse(localStorage.getItem('serverInfo'))?.server || 'localhost:6800/jsonrpc';
  console.log(localStorageServer);
  const [server, setServer] = useState(localStorageServer);

  const [token, setToken] = useState('');

  const onServerInfoChange = (e) => {
    setServer(e.target.value);
  };

  const onTokenChange = (e) => {
    setToken(e.target.value);
  };

  const onConnectClick = () => {
    localStorage.setItem('serverInfo', JSON.stringify({ server, token }));
    window.location.reload();
  };

  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
        <InputLabel htmlFor="standard-adornment-amount">Aria2 Server</InputLabel>
        <Input
          id="standard-adornment-amount"
          value={server}
          onChange={onServerInfoChange}
          startAdornment={<InputAdornment position="start">wws://</InputAdornment>}
        />
      </FormControl>
      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
        <InputLabel htmlFor="standard-adornment-amount">Token</InputLabel>
        <Input
          id="standard-adornment-amount"
          value={token}
          onChange={onTokenChange}
          startAdornment={<InputAdornment position="start">token:</InputAdornment>}
        />
      </FormControl>
      <Button variant="contained" onClick={onConnectClick}>Connect</Button>

    </Box>
  );
};
