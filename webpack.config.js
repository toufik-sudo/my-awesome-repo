// const Dotenv = require('dotenv-webpack');

// const defaultConfig = {
//     entry: './src/index.js',
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'bundle.js',
//         publicPath: '/',
//     },
//     devServer: {
//         contentBase: path.join(__dirname, 'dist'),
//         compress: true,
//         port: 9000,
//         historyApiFallback: true,
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: /node_modules/,
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: ['@babel/preset-env'],
//                     },
//                 },
//             },
//             {
//                 test: /\.css$/,
//                 use: ['style-loader', 'css-loader'],
//             },
//             {
//                 test: /\.(png|jpe?g|gif|svg)$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: '[path][name].[ext]',
//                             outputPath: 'images/',
//                         },
//                     },
//                 ],
//             },
//             {
//                 test: /\.(woff|woff2|eot|ttf|otf)$/,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             name: '[path][name].[ext]',
//                             outputPath: 'fonts/',
//                         },
//                     },
//                 ],
//             },
//         ],
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: './src/index.html',
//             filename: 'index.html',
//         }),
//     ],
//     devtool: 'source-map',
//     mode: process.env.NODE_ENV || 'development',
// };

// module.exports = (env) => {
//     let ENV_CONFIG;

//     if(env === 'dev'){
//         ENV_CONFIG = new Dotenv({path: './.env'})
//     }

//     if(env === 'staging'){
//         ENV_CONFIG = new Dotenv({path: './.env.staging'})
//     }

//     if(env === 'pre'){
//         ENV_CONFIG = new Dotenv({path: './.env.pre'})
//     }

//     if(env === 'production'){
//         ENV_CONFIG = new Dotenv({path: './.env.production'})
//     }
//     defaultConfig.plugins = [
//         ENV_CONFIG
//     ];
//     return defaultConfig;

// }