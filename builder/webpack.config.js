module.exports = {
  entry: {
    'background': './src/background/',
    'bootstrap': './src/background/bootstrap',
    'ui/ui': './src/ui/',
    'ui/bootstrap': './src/ui/bootstrap',
  },
  output: {
    path: './dist/unpacked',
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  devtool: '#source-map'
};
