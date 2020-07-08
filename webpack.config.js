const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: ['@babel/polyfill', './src/script.js', './src/style.css'],
    auth: ['@babel/polyfill', './src/assets/javascript/auth.js', './src/assets/css/auth.css'],
    team: ['./src/assets/css/team.css'],
    common: ['./src/assets/css/common.css'],
    audioCommon: ['./src/assets/css/audio-call-game/style.css'],
    audioHome: ['@babel/polyfill', './src/assets/javascript/audio-call-game/app.js', './src/assets/css/audio-call-game/style.css'],
    audioGame: ['@babel/polyfill', './src/assets/javascript/audio-call-game/game.js', './src/assets/css/audio-call-game/game.css'],
    audioEnd: ['@babel/polyfill', './src/assets/javascript/audio-call-game/end.js'],
    sprintGame: ['@babel/polyfill', './src/assets/javascript/sprint-game/app.js', './src/assets/css/sprint-game/style.css'],
    speakItGame: ['@babel/polyfill', './src/assets/javascript/speak-it-game/app.js', './src/assets/css/speak-it-game/style.css'],
    savanaGame: ['@babel/polyfill', './src/assets/javascript/savana-game/app.js', './src/assets/css/savana-game/style.css', './src/assets/css/savana-game/yui.css'],
    puzzleGame: ['@babel/polyfill', './src/assets/javascript/english-puzzle-game/app.js', './src/assets/css/english-puzzle-game/style.css'],
    pairHome: ['@babel/polyfill', './src/assets/javascript/find-a-pair-game/app.js', './src/assets/css/find-a-pair-game/style.css'],
    pairGame: ['@babel/polyfill', './src/assets/javascript/find-a-pair-game/game.js', './src/assets/css/find-a-pair-game/game.css'],
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
    new HtmlWebpackPlugin({
      template: './src/assets/pages/logout.html',
      filename: './logout.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['auth'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/team.html',
      filename: './team.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['team'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/audio-call-game/index.html',
      filename: './audio-call-game/index.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['audioHome'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/audio-call-game/game.html',
      filename: './audio-call-game/game.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['audioCommon', 'audioGame'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/audio-call-game/end.html',
      filename: './audio-call-game/end.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['audioCommon', 'audioEnd'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/sprint-game/index.html',
      filename: './sprint-game/index.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['sprintGame'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/speak-it-game/index.html',
      filename: './speak-it-game/index.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['speakItGame'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/savana-game/index.html',
      filename: './savana-game/index.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['savanaGame'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/english-puzzle-game/index.html',
      filename: './english-puzzle-game/index.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['puzzleGame'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/find-a-pair-game/index.html',
      filename: './find-a-pair-game/index.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['pairHome'],
    }),
    new HtmlWebpackPlugin({
      template: './src/assets/pages/find-a-pair-game/game.html',
      filename: './find-a-pair-game/game.html',
      minify: {
        collapseWhitespace: true,
      },
      inject: true,
      chunks: ['pairGame'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
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
