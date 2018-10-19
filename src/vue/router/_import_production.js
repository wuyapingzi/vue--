module.exports = file => {
  return () => {
    return require('@/views/' + file + '.vue')
  };
}
