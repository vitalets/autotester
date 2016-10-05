
const path = require('path');
const webpack = require('webpack');
const webpackAlias = require('./webpack-alias');

exports.run = function ({outDir, dev, watch}) {
  return new Promise(resolve => {
    const config = getConfig({outDir, dev});
    console.log(`webpack: building to ${config.output.path}`);
    const handler = (err, stats) => {
      errorHandler(err, stats);
      logStats(stats);
      console.log(`webpack: ${watch ? 'done and watching...' : 'done.'}`);
      resolve();
    };
    return watch ? webpack(config).watch({}, handler) : webpack(config).run(handler);
  });
};

function getConfig({outDir, dev}) {
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
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(dev ? 'dev' : 'production')
      })
    ],
    devtool: dev ? '#source-map' : null
  }
}

function errorHandler(err, stats) {
  if (err) {
    throw err;
  }
  if (stats.hasErrors()) {
    console.log('webpack: ERRORS');
    stats.toJson('errors-only').errors.forEach(error => console.log(error));
    throw new Error('Errors in webpack');
  }
  if (stats.hasWarnings()) {
    console.log('webpack: WARNINGS');
    stats.toJson('errors-only').warnings.forEach(warning => console.log(warning));
  }
}

function logStats(stats) {
  const statsStr = stats.toString({
    chunks: false,
    colors: true
  });
  console.log(statsStr);
}
