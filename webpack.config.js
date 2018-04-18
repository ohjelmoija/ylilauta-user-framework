const path = require('path');

module.exports = {
  entry: './src/ylilauta-user-framework.js',
  output: {
    filename: 'ylilauta-user-framework.min.js',
    path: path.resolve(__dirname, 'build')
  }
};
