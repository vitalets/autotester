module.exports = {
  entry: './src/app.js',
  output: {
    path: './dist/unpacked',
    filename: 'bundle.js',
    sourceMapFilename: '[file].map'
  },
  devtool: '#source-map'
};
