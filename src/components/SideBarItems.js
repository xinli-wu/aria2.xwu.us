import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PauseIcon from '@mui/icons-material/Pause';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

export const SideBarItems = () => {
  const navigate = useNavigate();

  const items = [
    { title: 'Downloading', link: 'active', icon: <CloudDownloadIcon /> },
    { title: 'Waiting', link: 'waiting', icon: <PauseIcon /> },
    { title: 'Finished/Stopped', link: 'stopped', icon: <LibraryAddCheckIcon /> },
  ];

  return (
    <>
      {items.map((x, i) => (
        <ListItem key={i} disablePadding>
          <ListItemButton onClick={() => navigate(x.link)}>
            <ListItemIcon>{x.icon}</ListItemIcon>
            <ListItemText primary={x.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};