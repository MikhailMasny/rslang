const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: ['@babel/polyfill', './src/script.js', './src/assets/css/auth.css'],
    auth: ['@babel/polyfill', './src/assets/javascript/auth.js', './src/style.css'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/signin.html',
      filename: './signin.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['auth'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/signup.html',
      filename: './signup.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['auth'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
              name: '[name].[contenthash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
};
