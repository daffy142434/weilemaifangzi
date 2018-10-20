const trim = (s) => {
  if (typeof s !== 'string') {
    return s;
  }
  return s.replace(/(^\s*)|(\s*$)/g, '');
};

export default trim;
