var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

var hmrPath = "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";
var devEntry = {};

for(var k in commonConfig.entry){
  devEntry[k] = [commonConfig.entry[k],hmrPath];
}

var res = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    app: [commonConfig.entry.app, hmrPath]
  },

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    //new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  },

  debug: true

});

console.log(res);
module.exports = res;