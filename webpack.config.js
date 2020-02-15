const path = require('path')
const webpack = require('webpack')

const isdev = (process.env.NODE_ENV || 'development') === 'development'

console.log('isdev', isdev)

module.exports = {
    mode: isdev ? 'development' : 'production',
    context: path.resolve(__dirname, 'src'),
    entry  : './index.ts',
    output : {
        path    : path.resolve(__dirname, 'dist'),
        filename: isdev ? 'loggr.js': 'loggr.min.js',
        libraryTarget: 'umd',
        library: 'Loggr',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    resolve: {
        modules: [path.resolve('./node_modules'), path.resolve('./src')],
        extensions: ['.ts', '.js']
    },
    devtool: 'source-map',
    optimization: {
        minimize: isdev ? false: true //Update this to true or false
    },
    module : {
        rules: [{
            test   : /\.tsx?$/,
            loader    : 'ts-loader',
            exclude: /node_modules/
        }]
    },
    externals: {}
}