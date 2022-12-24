import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import React from 'react';

export const TableCellMultiLine = ({ data, align = 'right' }) => {

  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align={align} sx={{ border: 0, p: 0 }}>
              {data.map((x, i) => <Typography key={i} variant='body2'>{x}</Typography>)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};