var path = require('path');
var webpack = require('webpack');

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

var loaders = ['babel?stage=0']

var entry = [ './index' ];

if (process.env.NODE_ENV === 'development') {
  plugins = plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]);
  loaders.unshift('react-hot');

  entry = entry.concat([
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  ]);

} else {
  plugins = plugins.concat(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = {
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : null,
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: plugins,
  resolve: {
    alias: {
      'react-motion-fun': path.join(__dirname, '..', '..', 'src')
    },
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: loaders,
      include: __dirname
    }, {
      test: /\.js$/,
      loaders: ['babel?stage=0'],
      include: path.join(__dirname, '..', '..', 'src')
    }]
  }
};
