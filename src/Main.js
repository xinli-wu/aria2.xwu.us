import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Stack } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { WSContext } from './App';
import { DrawerHeader } from './components/DrawerHeader';
import { LoginForm } from './components/LoginForm';
import { MenuDrawer } from './components/MenuDrawer';
import { Downloading } from './pages/Downloading';
import { Home } from './pages/Home';

const taskCtx = {
  status: null,
  setStatus: (_v) => { }
};

export const TaskContext = React.createContext(taskCtx);

const drawerWidth = 240;

const MainWrapper = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const Main = ({ colorMode }) => {
  const theme = useTheme();
  const location = useLocation();

  const navigate = useNavigate();
  const { rpc, setRpc, isConnected } = useContext(WSContext);

  const initStatus =
    location.pathname.startsWith('/active')
      ? 'active'
      : location.pathname.startsWith('/waiting')
        ? 'waiting'
        : location.pathname.startsWith('/stopped')
          ? 'stopped' : null;

  const [status, setStatus] = useState(initStatus || 'active');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDrawerOpen = () => {
    setMenuOpen(true);
  };

  const handleDrawerClose = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname === '/') navigate('/active');
  }, [location, navigate]);

  const onLogoutClick = () => {
    localStorage.setItem('serverInfo', JSON.stringify({ rpc }));
    setRpc(null);
  };

  return (
    <TaskContext.Provider value={{ status, setStatus }}>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" open={menuOpen}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Stack direction={'row'} sx={{ alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 1, ...(menuOpen && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                aria2x
              </Typography>
            </Stack>
            <Stack direction={'row'} sx={{ alignItems: 'center' }}>
              <IconButton sx={{ ml: 1 }} color="inherit" onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              {isConnected &&
                <IconButton sx={{ ml: 1 }} color="inherit" onClick={onLogoutClick}>
                  <LogoutIcon />
                </IconButton>
              }
            </Stack>
          </Toolbar>
        </AppBar>
        <MenuDrawer menuOpen={menuOpen} handleDrawerClose={handleDrawerClose} />
        <MainWrapper open={menuOpen}>
          <DrawerHeader />
          {!isConnected ? <LoginForm /> :
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/active' element={<Downloading />} />
              <Route path='/active/:taskId' element={<Downloading />} />
              <Route path='/waiting' element={<Downloading />} />
              <Route path='/waiting/:taskId' element={<Downloading />} />
              <Route path='/stopped' element={<Downloading />} />
              <Route path='/stopped/:taskId' element={<Downloading />} />
            </Routes>
          }
        </MainWrapper>
      </Box>
    </TaskContext.Provider>
  );
};
