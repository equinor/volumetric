export const getVisibility = (isOfficial, isShared) => {
  let visibility = 'Private';
  if (isOfficial) {
    visibility = 'Official';
  } else if (isShared) {
    visibility = 'Shared';
  }
  return visibility;
};
