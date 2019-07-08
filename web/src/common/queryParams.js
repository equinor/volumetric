import { parse, stringify } from 'query-string';

const COMPARE_PARAM_NAME = 'c';

export const getCompareCases = location => {
  const compareCases =
    parse(location.search, { parseNumbers: true })[COMPARE_PARAM_NAME] || [];
  if (!compareCases) {
    return [];
  } else if (Number.isInteger(compareCases)) {
    return [compareCases];
  } else {
    return compareCases;
  }
};

export const getCompareCasesQueryParams = compareCases => {
  return stringify({ [COMPARE_PARAM_NAME]: compareCases });
};
