module.exports = {
  entry: {
    background: './src/background/app',
    'ui/ui': './src/ui/app',
  },
  output: {
    path: './dist/unpacked',
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  devtool: '#source-map'
};
