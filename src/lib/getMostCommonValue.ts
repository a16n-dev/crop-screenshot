/**
 * Returns the value with the most occurences in the given array
 * @param colors
 * @returns the most common color value
 */
export const getMostCommonValue = (colors: number[]) => {
  const counts: { [key: number]: number } = {};
  colors.forEach((color) => {
    counts[color] = (counts[color] || 0) + 1;
  });
  const max = Math.max(...Object.values(counts));
  const value = Object.keys(counts).find((key) => counts[key] === max);

  return Number(value);
};
