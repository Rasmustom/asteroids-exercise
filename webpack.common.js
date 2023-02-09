/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './js/index.js',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('./index.html'),
        }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    resolve: {
        alias: {
            /* eslint-disable key-spacing */
            js: path.resolve(__dirname, 'js'),
            classes: path.resolve(__dirname, 'js', 'classes'),
            utility: path.resolve(__dirname, 'js', 'utility'),
            /* eslint-enable key-spacing */
        },
    },
    module: {
        rules: [],
    },
    cache: false,
};
