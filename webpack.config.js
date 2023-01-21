const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const baseConfig = {
  entry: path.resolve(__dirname, './src/index.ts'),
  mode: 'development',

  module: {
    rules: [
      {
        test: /.ts$/i,
        use: 'ts-loader'
      },
      {
        test: /.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.mp3$/i,
        type: 'asset/resource',
        generator: {
            filename: './assets/audio/[name][ext]'
        },
      },
      {
        test: /.(png|svg|ico|jpg|jpeg)$/i,
        type: 'asset/resource'
      },
      {
        test: /.(woff|woff2|ttf|otf|eot)$/,
        type: 'asset/resource'
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
    assetModuleFilename: 'assets/logo/[name][ext]'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      favicon: path.resolve(__dirname, './src/assets/race.png')
    }),
    new CleanWebpackPlugin(),
    new EslintPlugin({ extensions: 'ts' }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/images'),
          to: path.resolve(__dirname, './dist/assets/images')
        }
      ]
    })
  ]
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
