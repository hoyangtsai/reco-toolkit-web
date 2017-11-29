exports.babelResolve = (item) => {
  if (Array.isArray(item)) {
    return [
      require.resolve(item[0]),
      item[1],
    ];
  }
  return require.resolve(item);
};
