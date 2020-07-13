module.exports = {
    entry: './main.js',
    module: {
        rules: [{
            test: /\.js$/,
            use: 'babel-loader',
            options: {
                presets: ['@bable/presets-env']
            }
        }]
    }
};