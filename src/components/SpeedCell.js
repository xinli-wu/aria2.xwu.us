import { Stack, Typography } from '@mui/material';
import React from 'react';
import { formatBytes } from '../utils';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

export const SpeedCell = ({ downloadSpeed = undefined, uploadSpeed = undefined }) => {

  return (
    <Stack direction={'row'} spacing={0} >
      {downloadSpeed &&
        <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }} >
          <DownloadIcon color='success' />
          <Typography variant='body2' style={{ width: 80 }}>{formatBytes(downloadSpeed)}/s</Typography>
        </Stack>
      }
      {uploadSpeed &&
        <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
          <UploadIcon color='error' />
          <Typography variant='body2' style={{ width: 80 }}>{formatBytes(uploadSpeed)}/s</Typography>
        </Stack>
      }
    </Stack>
  );
};