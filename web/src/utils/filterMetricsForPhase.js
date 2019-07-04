const EXCLUDE_IN_OIL = ['giip', 'associatedliquid'];
const EXCLUDE_IN_GAS = ['stoiip', 'associatedgas'];

export default (metrics, phase) => {
  /**
   * metrics: An array of all recorded metrics in a given case.
   * phase: The currently selected phase for filtering.
   */
  phase = phase.toLowerCase();
  switch (phase) {
    case 'oil':
      return metrics.filter(key => !EXCLUDE_IN_OIL.includes(key));
    case 'gas':
      return metrics.filter(key => !EXCLUDE_IN_GAS.includes(key));
    case 'total':
      return metrics;
    default:
      return metrics;
  }
};
