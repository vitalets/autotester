module.exports = {
  entry: {
    'core/background/bundle': './src/background/',
    'core/background/bootstrap': './src/background/bootstrap',
    'core/ui/bundle': './src/ui/',
    'core/ui/bootstrap': './src/ui/bootstrap',
  },
  output: {
    path: process.env.npm_config_outdir,
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  devtool: '#source-map'
};
