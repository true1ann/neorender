const path = require('path');

module.exports = {
  entry: './src/index.ts', // Adjust this to your entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'], // Add .ts to the list of resolvable extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development', // Change this to 'production' for production builds
};
