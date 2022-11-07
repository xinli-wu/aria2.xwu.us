import { useTheme } from '@emotion/react';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { Paper, Stack, Typography } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { DateTime } from 'luxon';
import React from 'react';
import { formatBytes } from '../utils';

export const DownloadChart = ({ speedHistory }) => {
  const theme = useTheme();

  const formatSpeedHistory = (speedHistory) => {
    return speedHistory.slice(-30).map((speed) => {
      return {
        x: DateTime.fromMillis(speed.x).toISO(),
        y: speed.y
      };
    });
  };

  const data = [
    {
      id: 'download',
      data: formatSpeedHistory(speedHistory.downloadSpeedHistory),
    },
    {
      id: 'upload',
      data: formatSpeedHistory(speedHistory.uploadSpeedHistory),
    }
  ];
  return (
    <div style={{ height: 260, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 30, right: 30, bottom: 30, left: 70 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 'auto',
          stacked: true,
          reverse: false
        }}
        // yFormat={(v) => {
        //   console.log(formatBytes(v));
        //   return formatBytes(v);
        // }}
        curve="monotoneX"
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        // pointLabelYOffset={-12}
        // useMesh={true}
        enableSlices={'x'}
        sliceTooltip={({ slice }) => {
          const download = slice.points.find(x => x.serieId === 'download')?.data?.yFormatted;
          const upload = slice.points.find(x => x.serieId === 'upload')?.data?.yFormatted;
          return (
            <Paper sx={{ bgcolor: theme.palette.background.default, p: 1 }}>
              <Stack direction={'column'} spacing={1} >
                <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center' }} >
                  <DownloadIcon color='success' />
                  <Typography>{formatBytes(download)}/s</Typography>
                </Stack>
                <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center' }}>
                  <UploadIcon color='error' />
                  <Typography>{formatBytes(upload)}/s</Typography>
                </Stack>
              </Stack>
            </Paper>
          );
        }}
        enableArea={true}
        enableGridX={false}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        // motionConfig={'molasses'}
        axisLeft={{
          format: (v) => {
            return formatBytes(v);
          }
        }}

        theme={{
          axis: {
            ticks: {
              text: {
                fill: theme.palette.text.secondary,
              }
            }
          },
        }}
      />
    </div>

  );
};