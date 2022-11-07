import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useContext } from 'react';
import { TaskContext } from '../Main';
import { CellPopper } from './CellPopper';
import { DownloadChart } from './DownloadChart';

export const TaskOverview = ({ data, speedHistory }) => {
  const { status } = useContext(TaskContext);

  const columns = [
    { width: 200, field: 'key' },
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
      <div style={{ display: 'flex', height: 500 }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={data}
            columns={columns}
            headerHeight={0}
            hideFooter
            density="compact"
          />
          {status === 'active' && <DownloadChart speedHistory={speedHistory} />}
        </div>
      </div>
    </Box>
  );
};