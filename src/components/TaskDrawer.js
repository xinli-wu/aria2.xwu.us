import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Stack, Tab } from '@mui/material';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { formatBytes, getProgressBySize } from '../utils';
import { ProgressChart } from './ProgressChart';
import { TaskFiles } from './TaskFiles';
import { TaskOverview } from './TaskOverview';
import { TaskPeers } from './TaskPeers';
import { TaskPieces } from './TaskPieces';

export const TaskDrawer = ({ params }) => {
  const [tabId, setTabId] = useState('0');

  const overview = {
    'Task Id': params.gid,
    'Task Name': params.bittorrent?.info?.name,
    'Task Size': formatBytes(params.totalLength),
    'Task Status': (
      <Stack direction={'row'} spacing={2} style={{ width: '50%', position: 'relative' }} >
        {params.status}
        <br />
        <ProgressChart progress={params.progress} />
      </Stack>
    ),
    'Download': `${formatBytes(params.completedLength)} @ ${formatBytes(params.downloadSpeed)} /s`,
    'Upload': `${formatBytes(params.uploadLength)} @ ${formatBytes(params.uploadSpeed)} /s`,
    'Share Ratio': (params.uploadLength / params.completedLength).toFixed(2),
    'Seeders/Connections': `${params.numSeeders}/${params.connections}`,
    'Remaining': params.remaining,
    'Creation Time': params.bittorrent.creationDate ? DateTime.fromSeconds(params.bittorrent.creationDate).toBSON() : params.bittorrent.creationDate,
    'Info Hash': params.infoHash,
    'Download Dir': params.dir,
    'BT Tracker Servers': params.bittorrent.announceList
  };

  const { downloadSpeedHistory, uploadSpeedHistory } = params;

  const files = params?.files.map((x, i) => {
    const { completedLength, length } = x;
    const progress = getProgressBySize(completedLength, length);
    return { ...x, id: i, progress };
  });

  const onTabsChange = (_e, newValue) => {
    setTabId(newValue);
  };

  return (
    <>
      <TabContext value={tabId}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={onTabsChange} aria-label="lab API tabs example" centered>
            <Tab label="Overview" value="0" />
            <Tab label="Files" value="1" />
            <Tab label="Pieces" value="2" />
            <Tab label="Peers" value="3" />
          </TabList>
        </Box>
        <TabPanel value="0">
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
        </TabPanel>
      </TabContext>
    </>
  );
};