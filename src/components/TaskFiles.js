import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { formatBytes, getFileNameFromPath } from '../utils';
import { ProgressChart } from './ProgressChart';

export const TaskFiles = ({ data }) => {
  const columns = [
    { width: 420, field: 'path', headerName: 'Name', valueFormatter: (params) => getFileNameFromPath(params.value) },
    {
      field: 'progress',
      headerName: 'Progress',
      renderCell: (params) => <ProgressChart progress={params.row.progress} />
    },
    { field: 'completedLength', headerName: 'Completed', valueFormatter: (params) => formatBytes(params.value) },
    { field: 'length', headerName: 'Size', valueFormatter: (params) => formatBytes(params.value) },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <div style={{ display: 'flex', height: 768 }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={data}
            columns={columns}
            hideFooter
            density="compact"
          />
        </div>
      </div>
    </Box>
  );
};