import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Client } from 'rpc-websockets';
import { Main } from './Main';

const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

const wsCtx = {
  ws: new Client(`wss://${JSON.parse(localStorage.getItem('serverInfo'))?.server}`),
  isConnected: false,
  token: `token:${JSON.parse(localStorage.getItem('serverInfo'))?.token}`,
  hasToken: JSON.parse(localStorage.getItem('serverInfo'))?.token ? true : false,
  hasRpcServer: JSON.parse(localStorage.getItem('serverInfo'))?.server ? true : false
};
export const WSContext = React.createContext(wsCtx);

const appCtx = {
  drawerOpen: false,
  setDrawerOpen: (_v) => { }
};
export const AppContext = React.createContext(appCtx);

function App() {
  const [isConnected, setIsConnected] = useState(wsCtx.isConnected);

  const [drawerOpen, setDrawerOpen] = useState(appCtx.drawerOpen);
  const appCtxValue = useMemo(() => ({ drawerOpen, setDrawerOpen }), [drawerOpen]);

  const [mode, setMode] = React.useState('dark');
  const { ws, hasToken, hasRpcServer } = wsCtx;

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
    (async () => {
      if (hasToken) {
        ws.on('open', () => {
          setIsConnected(true);
          // call an RPC method with parameters
          // ws.call('aria2.getGlobalStat', [token]).then((result) => {
          //   console.log(result);
          //   setGlobalStat(result);
          // });

          // send a notification to an RPC server
          // ws.notify('openedNewsModule');

          // subscribe to receive an event
          // ws.subscribe('feedUpdated');

          // ws.on('feedUpdated', function () {
          // });

          // unsubscribe from an event
          // ws.unsubscribe('feedUpdated');

          // login your client to be able to use protected methods
          // ws.login({ 'username': 'confi1', 'password': 'foobar' }).then(() => {
          //   ws.call('account').then(function (result) {
          //   });
          // }).catch(function (error) {
          //   console.log('auth failed');
          // });

          // close a websocket connection
          // ws.close();
        });
      }
    })();
    return () => {
      if (hasRpcServer) ws.close();
    };
  }, [ws, hasToken, hasRpcServer]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContext.Provider value={appCtxValue}>
          <WSContext.Provider value={{ ...wsCtx, isConnected }}>
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
