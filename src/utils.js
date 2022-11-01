import { DateTime } from 'luxon';

export const formatBytes = (bytes, withUnit = true, decimals = 2) => {
  if (!+bytes) return `0.00${withUnit ? ' B' : ''}`;

  const k = 1024;
  const dm = decimals;// < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${withUnit ? ` ${sizes[i]}` : ''}`;
};

export const getFileNameFromPath = (path) => {
  return path.split('/').pop();
};

export const getProgressBySize = (completedLength, totalLength) => {
  return isNaN(completedLength / totalLength) ? 0 : parseFloat((completedLength / totalLength).toFixed(4));
};

export const getDurationBySeconds = (seconds) => {
  return DateTime.now()
    .plus({ seconds })
    .diffNow(['months', 'days', 'hours', 'minutes', 'seconds']).toFormat('d:h:m:s');
};

export const hex2bin = (data) => {
  return data.split('').map(x => parseInt(x, 16).toString(2).padStart(4, '0')).join('');
};