
const webpack = require('webpack');
const webpackAlias = require('./webpack-alias');

module.exports = {
  entry: {
    'core/background/bundle': './src/background/',
    'core/background/bootstrap': './src/background/bootstrap/',
    'core/ui/bundle': './src/ui/',
    'core/ui/bootstrap': './src/ui/bootstrap',
    'core/ui/assets': './src/ui/assets',
  },
  output: {
    path: process.env.npm_config_outdir,
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(jpg|png)$/, loader: 'url?limit=25000' },
      // font-awesome loaders
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?mimetype=image/svg+xml'
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/./, webpackAlias.newResource),
  ],
  devtool: '#source-map'
};
