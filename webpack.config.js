const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js'
  },

  resolve: {
    extensions: [".ts", ".js", ".json"]
  },


  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader'
          },
        ]
      },
      {
        test: /\.ts$/,
        enforce: "pre",
        loader: 'tslint-loader',
        include: path.resolve(__dirname, 'src'),
        options: {
          typeCheck: true,
          emitErrors: true,
        }
      }
    ]
  }
}

