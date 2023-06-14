const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  // Ten resolve jest niezbędny żeby można było załadować biblioteke qrcode-svg
  resolve: {
    fallback: {
      fs: false
    }
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html'
    }),
    new Dotenv()
  ],

  module: {
    rules: [
      {
        test: /.js$/,
        include: [path.resolve(__dirname, './src')],
        use: [
          'babel-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
