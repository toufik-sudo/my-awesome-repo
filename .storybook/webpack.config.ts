const path = require('path');

module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [['react-app', { flow: false, typescript: true }]]
        }
      },
      require.resolve('react-docgen-typescript-loader')
    ]
  });
  config.resolve.extensions.push('.ts', '.tsx');
  config.module.rules.push({
    test: /\.tsx?$/,
    loaders: [
      {
        loader: [require.resolve('@storybook/source-loader')],
        include: path.resolve(__dirname, '../'),
        options: { parser: 'typescript' }
      }
    ],
    enforce: 'pre'
  });

  return config;
};
