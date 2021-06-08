const webpack = require('webpack');

const mergeSassConfig = {
    mode: 'production',
    entry: __dirname + '/index.js',
    optimization: {
        splitChunks: false,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/dist',
        filename: 'mergeSass.js',
        globalObject: 'this',
        library: {
            name: 'mergeSass',
            type: 'umd',
            export: 'default',
        },
    },
};

const webAppConfig = { ...mergeSassConfig };
webAppConfig.entry = __dirname + '/web/index.js';
webAppConfig.output = {
    path: __dirname + '/dist',
    publicPath: '/dist',
    filename: 'webApp.js',
    library: 'webApp',
    libraryTarget: 'umd',
    globalObject: 'self',
};
webAppConfig.devServer = {
    index: 'index.html',
    contentBase: __dirname + '/',
    host: '127.0.0.1',
    hot: true,
};
webAppConfig.plugins = [
    new webpack.HotModuleReplacementPlugin(),
];
webAppConfig.module.rules.push({
    test: /\.scss$/,
    use: [
        {
            loader: 'style-loader',
            options: {
                insert: 'body',
            },
        },
        {
            loader: 'css-loader',
            options: {
                modules: true,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    ident: 'postcss',
                    plugins: [
                        require('autoprefixer')(),
                    ],
                },
            },
        },
        'sass-loader',
    ],
});

module.exports = [
    mergeSassConfig,
    webAppConfig,
];
