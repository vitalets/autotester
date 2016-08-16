module.exports = {
  entry: {
    'background': './src/background/',
    'bootstrap': './src/background/bootstrap',
    'ui/ui': './src/ui/',
  },
  output: {
    path: './dist/unpacked',
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  devtool: '#source-map'
};
