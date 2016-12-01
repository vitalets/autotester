
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
// const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpackAlias = require('./webpack-alias');

exports.run = function ({outDir, dev, watch}) {
  return new Promise((resolve, reject) => {
    const config = getConfig({outDir, dev});
    console.log(`webpack: building to ${config.output.path}`);
    const handler = getHandler({resolve, reject, watch, dev});
    return watch
      ? webpack(config).watch({}, handler)
      : webpack(config).run(handler);
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
      new webpack.DefinePlugin(Object.assign({
        'process.env.NODE_ENV': JSON.stringify(dev ? 'dev' : 'production'),
        buildInfo: {
          timestamp: Date.now(),
          buildNumber: process.env.BUILD_NUMBER || '',
          hash: process.env.BUILD_VCS_NUMBER || '',
          isDev: Boolean(dev),
        }
      }, getEnvData())),
      // todo: found many circullar dependencies in node-modules
      // new CircularDependencyPlugin({
      //   failOnError: true
      // }),
      // does not work yet because of ES6 (let)
      // new webpack.optimize.UglifyJsPlugin()
    ],
    devtool: dev ? '#source-map' : null
  }
}

function getHandler({resolve, reject, watch, dev}) {
  return (err, stats) => {
    const hasErrors = errorHandler(err, stats);
    logStats(stats);
    if (!watch && !dev) {
      writeStats(stats);
    }
    const doneMsg = `webpack: done${hasErrors ? ' (with errors)': ''}`;
    if (watch) {
      console.log(`${doneMsg} and watching...`);
    } else {
      console.log(doneMsg);
      const fulfill = hasErrors ? reject : resolve;
      fulfill();
    }
  };
}

function errorHandler(err, stats) {
  if (err) {
    console.log(err);
    return true;
  }
  if (stats.hasErrors()) {
    console.log('webpack: ERRORS');
    stats.toJson('errors-only').errors.forEach(error => console.log(error));
    return true;
  }
  if (stats.hasWarnings()) {
    console.log('webpack: WARNINGS');
    stats.toJson('errors-only').warnings.forEach(warning => console.log(warning));
    return true;
  }
  return false;
}

function logStats(stats) {
  const statsStr = stats.toString({
    chunks: false,
    colors: true
  });
  console.log(statsStr);
}

function writeStats(stats) {
  const statsFile = 'dist/stats.json';
  fs.outputJsonSync(statsFile, stats.toJson());
  console.log(`webpack: written ${statsFile}`);
}

function getEnvData() {
  try {
    const env = require('../../env');
    return Object.keys(env).reduce((res, key) => {
      res[`process.env.${key}`] = JSON.stringify(env[key]);
      return res;
    }, {});
  } catch (e) { }
}
