import { format } from 'd3-format';

export const labelFormater = format('.4~s');

export const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1);
