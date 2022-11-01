import { Button, styled, Typography } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import React from 'react';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.grey['700']}`,
  },
}));

export const CellPopper = ({ data }) => {

  return (
    <HtmlTooltip
      title={
        <>
          <ul>{data.map((x, i) => <li key={i}><Typography variant='body2' >{x}</Typography></li>)}</ul>
        </>
      }
    >
      <Button>Total: {data.length}</Button>
    </HtmlTooltip>
  );
};