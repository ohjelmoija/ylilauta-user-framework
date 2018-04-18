const path = require('path');

module.exports = {
  entry: './src/ylilauta-user-framework.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts']
  },
  output: {
    filename: 'ylilauta-user-framework.min.js',
    path: path.resolve(__dirname, '../build')
  }
};
