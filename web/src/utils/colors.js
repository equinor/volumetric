function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5;
  }
  let result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

// My function to interpolate between two colors completely, returning an array
function interpolateColors(color1, color2, steps) {
  let stepFactor = 1 / (steps - 1),
    interpolatedColorArray = [];

  for (let i = 0; i < steps; i++) {
    interpolatedColorArray.push(
      interpolateColor(color1, color2, stepFactor * i),
    );
  }

  return interpolatedColorArray;
}

const rgbToHex = rgb => {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = '0' + hex;
  }
  return hex;
};

const rgbArrayToHex = color => {
  return color.reduce((color, rgb) => `${color}${rgbToHex(rgb)}`, '');
};

const COLOR1 = [0, 112, 121];
const COLOR2 = [213, 234, 244];

export function getColorPalette(nofColors) {
  if (nofColors === 1) {
    return [`#${rgbArrayToHex(COLOR1)}`];
  }
  return interpolateColors(COLOR1, COLOR2, nofColors).map(
    color => `#${rgbArrayToHex(color)}`,
  );
}
