import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import React from 'react';
import { hex2bin } from '../utils';

export const TaskPieces = ({ bitfield }) => {
  const theme = useTheme();
  const bin = hex2bin(bitfield).toString();

  return (
    <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
      {bin.split('').map((x, i) => {
        return (
          <div key={i} style={{
            height: 10,
            width: 10,
            backgroundColor: x === '1' ? theme.palette.primary.dark : theme.palette.background.default,
            margin: 1,
            border: `1px solid ${theme.palette.primary.dark}`
          }} />);
      })}
    </Box>
  );
};
