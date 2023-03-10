/* eslint-env node */
const path = require('path');

module.exports = {
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
    entry: './js/index.js',
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
