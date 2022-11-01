import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export const TaskTable = ({ rows, columns, onCellClick = () => { } }) => {

  return (
    <div style={{ display: 'flex', height: 768 }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={rows.map((x, i) => ({ ...x, id: i }))}
          columns={columns}
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: 'primary.light',
            '& .MuiDataGrid-row:hover': {
              // color: 'primary.main',
              cursor: 'pointer',
            },
          }}
          onCellClick={onCellClick}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};