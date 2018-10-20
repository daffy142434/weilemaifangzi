function resetPercentValue(value) {
  if (typeof value === 'string') {
    value = value.replace(/[^\d+-.]/g, '');
  }
  return value;
}
export default function listFormat(list) {
  return list.map((item) => {
    // list.ctrAmount = resetPercentValue(list.ctrAmount);
    // list.avgAcos = resetPercentValue(list.avgAcos);
    return item;
  });
};
