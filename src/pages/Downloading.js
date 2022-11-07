import { Drawer } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext, WSContext } from '../App';
import { ProgressChart } from '../components/ProgressChart';
import { SpeedCell } from '../components/SpeedCell';
import { TaskDrawer } from '../components/TaskDrawer';
import { TaskTable } from '../components/TaskTable';
import { formatBytes, getDurationBySeconds, getProgressBySize } from '../utils';
import { DateTime } from 'luxon';
import { TaskContext } from '../Main';

export const Downloading = () => {
  const { ws, token, isConnected } = useContext(WSContext);
  const { drawerOpen, setDrawerOpen } = useContext(AppContext);
  const { status } = useContext(TaskContext);

  const navigate = useNavigate();
  const { taskId } = useParams();

  const [data, setData] = useState({ data: [], ready: false });
  const [clickedRow, setClickedRow] = useState(null);

  const callFn = useMemo(() => {
    switch (status) {
      case 'active':
        return {
          name: 'aria2.tellActive',
          params: [token]
        };
      case 'waiting':
        return {
          name: 'aria2.tellWaiting',
          params: [token, 0, 1000, ['gid'
            , 'totalLength'
            , 'completedLength'
            , 'uploadSpeed'
            , 'downloadSpeed'
            , 'connections'
            , 'numSeeders'
            , 'seeder'
            , 'status'
            , 'errorCode'
            , 'verifiedLength'
            , 'verifyIntegrityPending'
            , 'files'
            , 'bittorrent'
            , 'infoHash'
            , 'bitfield'
          ]]
        };
      case 'stopped':
        return {
          name: 'aria2.tellStopped',
          params: [token, -1, 1000, ['gid'
            , 'totalLength'
            , 'completedLength'
            , 'uploadSpeed'
            , 'downloadSpeed'
            , 'connections'
            , 'numSeeders'
            , 'seeder'
            , 'status'
            , 'errorCode'
            , 'verifiedLength'
            , 'verifyIntegrityPending'
            , 'bittorrent'
            , 'files'
            , 'bitfield'
          ]]
        };
      default:
        return {};
    }

  }, [status, token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ws && isConnected) {
        ws.call(callFn.name, callFn.params).then((result) => {
          if (Array.isArray(result)) {
            const now = DateTime.now().valueOf();

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
  }, [ws, isConnected, token, callFn]);

  const columns = [
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
    };
    setClickedRow(params.row);
  };

  useEffect(() => {
    if (data.data.length) {
      if (taskId) {
        const selectedTask = data.data.find(x => x.gid === taskId);
        if (selectedTask) {
          setDrawerOpen(true);
          setClickedRow(selectedTask);
        }
      } else {
        setDrawerOpen(false);
      }
    }
  }, [data, taskId, drawerOpen, setDrawerOpen, navigate]);

  const onDrawerClose = () => {
    navigate(-1);
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