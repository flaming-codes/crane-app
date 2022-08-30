export const formatDelimiter = (total: number) => {
  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
