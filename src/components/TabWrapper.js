import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { TaskFiles } from './TaskFiles';
import { TaskOverview } from './TaskOverview';
import { TaskPeers } from './TaskPeers';
import { TaskPieces } from './TaskPieces';

export const TabWrapper = ({ children, onTabsChange }) => {
  const [tabId, setTabId] = useState('0');


  return (
    <TabContext value={tabId}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={onTabsChange} aria-label="lab API tabs example" centered>
          <Tab label="Overview" value="0" />
          <Tab label="Files" value="1" />
          <Tab label="Pieces" value="2" />
          <Tab label="Peers" value="3" />
        </TabList>
      </Box>
      {/* <TabPanel value="0">
      <TaskOverview data={Object.keys(overview).map((x, i) => ({ id: i, key: x, value: overview[x] }))} speedHistory={{ downloadSpeedHistory, uploadSpeedHistory }} />
    </TabPanel>
    <TabPanel value="1">
      <TaskFiles data={files} />
    </TabPanel>
    <TabPanel value="2">
      {params.bitfield && <TaskPieces bitfield={params.bitfield} />}
    </TabPanel>
    <TabPanel value="3">
      <TaskPeers />
    </TabPanel> */}
    </TabContext>
  );
};