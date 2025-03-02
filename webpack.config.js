const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: process.env.NODE_ENV === 'production' 
      ? '/muffet-viewer/'  // GitHub Pages path
      : '/',               // Local development path
    clean: true,          // Clean the output directory before emit
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        type: 'asset/resource'
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      favicon: './public/favicon.svg',
      publicPath: process.env.NODE_ENV === 'production' 
        ? '/muffet-viewer/'
        : '/'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
    historyApiFallback: true
  },
}; 