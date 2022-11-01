import { useTheme } from '@mui/material';
import React, { useCallback } from 'react';
import useCanvas from '../hooks/useCanvas';
import { hex2bin } from '../utils';

export const BitfieldCanvas = (props) => {
  const theme = useTheme();
  const { bitfield } = props;
  const bin = hex2bin(bitfield).toString();

  const options = {};
  const { context } = options;

  // const draw = (ctx, _frameCount) => {
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   const width = ctx.canvas.width;
  //   const coe = Math.floor(bin.length / width);

  //   for (let i = 0; i < width; i++) {
  //     ctx.beginPath();
  //     ctx.moveTo(i, 0);
  //     ctx.lineTo(i, 20);
  //     if (bin[i * coe] === '1') {
  //       ctx.strokeStyle = theme.palette.primary.dark;
  //     } else {
  //       ctx.strokeStyle = theme.palette.background.default;
  //     }
  //     ctx.stroke();
  //   }
  // };

  const memoizedCallback = useCallback(
    (ctx, _frameCount) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const width = ctx.canvas.width;
      const coe = Math.floor(bin.length / width);

      for (let i = 0; i < width; i++) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 20);
        if (bin[i * coe] === '1') {
          ctx.strokeStyle = theme.palette.primary.dark;
        } else {
          ctx.strokeStyle = theme.palette.background.default;
        }
        ctx.stroke();
      }
    },
    [bin, theme.palette.background.default, theme.palette.primary.dark],
  );

  const canvasRef = useCanvas(memoizedCallback, { context });

  return <canvas height={20} width={150} ref={canvasRef} {...props} />;
};

