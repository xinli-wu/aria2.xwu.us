import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Stack } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { WSContext } from './App';
import { LoginForm } from './components/LoginForm';
import { SideBarItems } from './components/SideBarItems';
import { Downloading } from './pages/Downloading';
import LogoutIcon from '@mui/icons-material/Logout';
import { Home } from './pages/Home';

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export const Main = ({ colorMode }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { rpc, setRpc, isConnected, setIsConnected } = useContext(WSContext);

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
    // setIsConnected(false);
  };

  return (
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
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={menuOpen}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <SideBarItems />
        </List>
        <Divider />
      </Drawer>
      <MainWrapper open={menuOpen}>
        <DrawerHeader />
        {!isConnected
          ? <LoginForm />
          : <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/active' element={<Downloading />} />
            <Route path='/active/:taskId' element={<Downloading />} />
            <Route path='/waiting' element={<Downloading />} />
            <Route path='/stopped' element={<Downloading />} />
          </Routes>
        }

      </MainWrapper>
    </Box >
  );
};
