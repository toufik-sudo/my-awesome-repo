const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'api': path.resolve(__dirname, 'src/api'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
      'constants': path.resolve(__dirname, 'src/constants'),
      'config': path.resolve(__dirname, 'src/config'),
      'containers': path.resolve(__dirname, 'src/containers'),
      'interfaces': path.resolve(__dirname, 'src/interfaces'),
      'intl': path.resolve(__dirname, 'src/intl'),
      'services': path.resolve(__dirname, 'src/services'),
      'store': path.resolve(__dirname, 'src/store'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'sass-boilerplate': path.resolve(__dirname, 'src/sass-boilerplate'),
      'process': 'process/browser'
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    ]
  }
};
