module.exports = api => {
    const targets = api.env('test') ? { targets: {  node: 'current' } } : null;
    return {
        plugins: [
            '@babel/plugin-syntax-dynamic-import', // add support for dynamic imports (used in app.js)
            'lodash', // Tree-shake lodash
        ],
        presets: [
            "@babel/preset-react",
            ['@babel/preset-env', {
                //debug: true,
                loose: true, // Enable "loose" transformations for any plugins in this preset that allow them
                modules: 'auto',
                useBuiltIns: 'usage', // Tree-shake babel-polyfill
                targets: '> 1%, last 2 versions, Firefox ESR, IE 11',
                corejs: '3.14.0',
                ...targets,
            }],
        ],
    };
}
