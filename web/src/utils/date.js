export function getFormattedDate(datestring) {
  return new Date(datestring).toLocaleDateString('nb', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}
