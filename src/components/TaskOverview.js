import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { CellPopper } from './CellPopper';
import { DownloadChart } from './DownloadChart';

export const TaskOverview = ({ data, speedHistory }) => {
  const columns = [
    { field: 'key', width: 150 },
    {
      field: 'value', width: 600,
      renderCell: (params) => {
        if (Array.isArray(params.formattedValue)) {
          return <CellPopper data={params.formattedValue} />;
        }
        if (React.isValidElement(params.formattedValue)) {
          return params.formattedValue;
        }
      }
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <div style={{ display: 'flex', height: 400 }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={data}
            columns={columns}
            headerHeight={0}
            hideFooter
            density="compact"
          />
          <DownloadChart speedHistory={speedHistory} />
        </div>
      </div>
    </Box>
  );
};