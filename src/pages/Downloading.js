import { Drawer } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext, WSContext } from '../App';
import { ProgressChart } from '../components/ProgressChart';
import { SpeedCell } from '../components/SpeedCell';
import { TaskDrawer } from '../components/TaskDrawer';
import { TaskTable } from '../components/TaskTable';
import { formatBytes, getDurationBySeconds, getProgressBySize } from '../utils';

export const Downloading = () => {
  const { ws, token, isConnected } = useContext(WSContext);
  const navigate = useNavigate();
  const { taskId } = useParams();

  const [data, setData] = useState({ data: [], ready: false });
  const { drawerOpen, setDrawerOpen } = useContext(AppContext);
  const [clickedRow, setClickedRow] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ws && isConnected) {
        ws.call('aria2.tellActive', [token]).then((result) => {
          if (Array.isArray(result)) {
            const now = dayjs().valueOf();
            setData(prev => {
              return {
                data: result.map(task => {
                  const duration = task.downloadSpeed === '0' ? 'Infinity' : getDurationBySeconds((task.totalLength - task.completedLength) / task.downloadSpeed);
                  return {
                    ...task,
                    remaining: task.completedLength === task.totalLength ? '-' : duration,
                    progress: getProgressBySize(task.completedLength, task.totalLength),
                  };
                }).map(task => {
                  const previous = prev.data.find(x => x.gid === task.gid);
                  if (previous) {
                    return {
                      ...task,
                      downloadSpeedHistory: [...previous.downloadSpeedHistory, { x: now, y: task.downloadSpeed }].slice(-50),
                      uploadSpeedHistory: [...previous.uploadSpeedHistory, { x: now, y: task.uploadSpeed }].slice(-50),
                    };
                  }
                  return {
                    ...task,
                    downloadSpeedHistory: [{ x: now, y: task.downloadSpeed }],
                    uploadSpeedHistory: [{ x: now, y: task.uploadSpeed }],
                  };
                }),
                ready: true
              };
            });
          }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [ws, token, isConnected]);

  const columns = [
    // { field: 'gid', headerName: 'gid' },
    { width: 500, field: 'bittorrent', headerName: 'Name', valueGetter: (params) => params.row.bittorrent?.info?.name },
    { field: 'status', headerName: 'Status' },
    {
      field: 'progress',
      headerName: 'Progress',
      renderCell: (params) => <ProgressChart progress={params.row.progress} />
    },
    { field: 'totalLength', headerName: 'Size', valueFormatter: (params) => formatBytes(params.value) },
    {
      width: 250, field: 'downloadSpeed', headerName: 'Speed', renderCell: (params) => {
        const { downloadSpeed, uploadSpeed } = params.row;
        return (
          <SpeedCell downloadSpeed={downloadSpeed} uploadSpeed={uploadSpeed} />
        );
      }
    },
    { field: 'remaining', headerName: 'Remaining' },
  ];

  const onCellClick = (params) => {
    if (params.field !== '__check__') {
      navigate(`${params.row.gid}`);
      setDrawerOpen(true);
    };
    setClickedRow(params.row);
  };

  useEffect(() => {
    if (taskId && !drawerOpen && data.data.length) {
      const selectedTask = data.data.find(x => x.gid === taskId);
      if (selectedTask) {
        setDrawerOpen(true);
        setClickedRow(selectedTask);
      } else {
        navigate(`/active`);
      }
    }
  }, [data, taskId, drawerOpen, setDrawerOpen, navigate]);

  const onDrawerClose = () => {
    setDrawerOpen(false);
    navigate(`/active`);
  };

  return (
    <>
      {data.ready && <>
        <TaskTable
          rows={data.data}
          columns={columns}
          onCellClick={onCellClick}
        />
        <Drawer
          PaperProps={{ sx: { width: '70%' } }}
          anchor={'right'}
          open={drawerOpen}
          onClose={onDrawerClose}
        >
          <TaskDrawer params={data.data.find(x => x.gid === clickedRow?.gid)} />
        </Drawer>
      </>}
    </>
  );
};