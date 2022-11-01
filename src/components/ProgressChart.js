import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from '@emotion/react';

export const ProgressChart = ({ progress }) => {

  const theme = useTheme();
  const bgColor = theme.palette.mode === 'dark' ? theme.palette.grey['800'] : theme.palette.grey['300'];

  const data = [{
    "progress": progress,
    "completedLength": progress * 100,
    "totalLength": 100
  }];

  return (
    <div style={{ height: 20, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ResponsiveBar
        data={data}
        keys={['completedLength']}
        height={20}
        // width={100}
        indexBy="progress"
        layout="horizontal"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={[theme.palette.primary.main, theme.palette.grey['A700']]}
        maxValue={100}
        isInteractive={false}
        theme={{
          background: bgColor
        }}
        padding={0}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={null}
        enableGridY={false}
        enableLabel={false}
        legends={[]}
        role="progress"
      />
      <div style={{ position: 'absolute' }}>{(progress * 100).toFixed(2)}%</div>
    </div>
  );
};