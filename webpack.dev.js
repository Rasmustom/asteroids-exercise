/* eslint-env node */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname),
        },
        // static: path.join(__dirname),
        devMiddleware: {
            publicPath: '/build/',
        },
    },
});
