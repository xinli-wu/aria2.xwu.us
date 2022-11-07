import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Client } from 'rpc-websockets';
import { Main } from './Main';

const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

const wsCtx = {
  ws: null,
  rpc: JSON.parse(localStorage.getItem('serverInfo'))?.rpc,
  setRpc: (_v) => { },
  token: JSON.parse(localStorage.getItem('serverInfo'))?.token ? `token:${JSON.parse(localStorage.getItem('serverInfo'))?.token}` : undefined,
  setToken: (_v) => { },
  isConnected: false,
  setIsConnected: (_v) => { },
};

export const WSContext = React.createContext(wsCtx);

const appCtx = {
  drawerOpen: false,
  setDrawerOpen: (_v) => { }
};
export const AppContext = React.createContext(appCtx);


function App() {
  const [rpc, setRpc] = useState(wsCtx.rpc);
  const [ws, setWs] = useState(wsCtx.ws);
  const [token, setToken] = useState(wsCtx.token);
  const [isConnected, setIsConnected] = useState(wsCtx.isConnected);

  const [drawerOpen, setDrawerOpen] = useState(appCtx.drawerOpen);
  const appCtxValue = useMemo(() => ({ drawerOpen, setDrawerOpen }), [drawerOpen]);

  const [mode, setMode] = React.useState('dark');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({ palette: { mode } }),
    [mode],
  );

  useEffect(() => {
    if (rpc && token) {
      setWs(new Client(`wss://${rpc.host}:${rpc.port}/${rpc.path}`));
    } else {
      setWs(null);
      setIsConnected(false);
    }

  }, [rpc, token]);

  useEffect(() => {
    (() => {
      if (ws) {
        try {
          ws.on('open', () => {
            console.log(`connecting to ${rpc.host}`);
            setIsConnected(true);
          });
        } catch (error) {
          console.error(error);
          setIsConnected(false);
        }
      }
    })();

    return () => {
      if (ws) ws.close();
    };
  }, [ws, rpc.host]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContext.Provider value={appCtxValue}>
          <WSContext.Provider value={{
            ...wsCtx,
            ws,
            isConnected, setIsConnected,
            rpc, setRpc,
            token, setToken
          }}>
            <BrowserRouter>
              <Main colorMode={colorMode} />
            </BrowserRouter>
          </WSContext.Provider>
        </AppContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
