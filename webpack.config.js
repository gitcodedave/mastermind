const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/client/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.*', '.js', '.jsx']
  },
  devServer: {
    port: 8080,
    open: true,
    historyApiFallback: true,
    proxy: [{
        "/api": "http://localhost:3000"
      }]
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './public/index.html',
    })
  ]
};