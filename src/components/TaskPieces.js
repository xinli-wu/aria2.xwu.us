import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import React from 'react';
import { hex2bin } from '../utils';

export const TaskPieces = ({ bitfield }) => {
  const theme = useTheme();
  const bin = hex2bin(bitfield).toString();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {bin.split('').map((x, i) => {
        return (
          <Box key={i}
            sx={{
              height: 10,
              width: 10,
              backgroundColor: x === '1' ? theme.palette.success.light : theme.palette.background.default,
              m: '1px',
              border: `1px solid ${theme.palette.success.light}`
            }}
          />
        );
      })}
    </Box>
  );
};
