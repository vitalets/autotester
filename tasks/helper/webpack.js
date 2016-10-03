
const path = require('path');
const webpack = require('webpack');
const webpackAlias = require('./webpack-alias');

exports.run = function (options) {
  return new Promise(resolve => {
    const config = getConfig(options.outDir);
    console.log(`webpack: build to ${config.output.path}`);
    webpack(config).run((err, stats) => {
      finishHandler(err, stats);
      resolve();
    });
  });
};

exports.watch = function (options) {
  return new Promise(resolve => {
    const config = getConfig(options.outDir);
    console.log(`webpack: build and watch to ${config.output.path}`);
    webpack(config).watch({}, (err, stats) => {
      finishHandler(err, stats);
      resolve();
    });
  })
};

function getConfig(outDir) {
  return {
    entry: {
      'core/background/boot': './src/background/boot/',
      'core/background/bundle': './src/background/',
      'core/ui/assets': './src/ui/assets',
      'core/ui/boot': './src/ui/',
    },
    output: {
      path: outDir,
      filename: '[name].js',
      chunkFilename: '[name].js',
      sourceMapFilename: '[file].map',
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          include: [
            path.resolve('./src/ui')
          ],
          query: {
            presets: ['react']
          }
        },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.(jpg|png)$/, loader: 'url?limit=25000' },
        { test: /\.woff$/, loader: 'url?mimetype=application/font-woff'}
      ]
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/./, webpackAlias.newResource),
      // to not require('react') in every jsx file
      new webpack.ProvidePlugin({
        'React': 'react'
      }),
      // todo: for prod builds
      /*
       new webpack.DefinePlugin({
       "process.env": {
       NODE_ENV: JSON.stringify("production")
       }
       })
       */
    ],
      devtool: '#source-map'
  }
}

function finishHandler(err, stats) {
  if (err) {
    throw err;
  }
  const jsonStats = stats.toJson();
  if (jsonStats.errors.length > 0) {
    jsonStats.errors.forEach(error => console.log(error));
    throw new Error('Errors in webpack');
  }
  if (jsonStats.warnings.length > 0) {
    jsonStats.warnings.forEach(error => console.log(error));
    throw new Error('Errors in webpack');
  }
  console.log('webpack: done.')
}
