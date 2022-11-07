import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import PauseIcon from '@mui/icons-material/Pause';
import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskContext } from '../Main';
import { DrawerHeader } from './DrawerHeader';

const drawerWidth = 240;

export const MenuDrawer = ({ menuOpen, handleDrawerClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { setStatus } = useContext(TaskContext);


  const items = [
    { title: 'Downloading', link: 'active', icon: <CloudDownloadIcon /> },
    { title: 'Waiting', link: 'waiting', icon: <PauseIcon /> },
    { title: 'Finished/Stopped', link: 'stopped', icon: <LibraryAddCheckIcon /> },
  ];

  const onMenuItemClick = (x) => {
    navigate(x.link);
    setStatus(x.link);
  };

  return (
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
        {items.map((x, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton onClick={() => onMenuItemClick(x)}>
              <ListItemIcon>{x.icon}</ListItemIcon>
              <ListItemText primary={x.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>

  );
};