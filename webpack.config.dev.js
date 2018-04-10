import path from 'path'
import webpack from 'webpack'

export default {
	devtools: 'eval-source-map',
	entry: {
        base: [
            'webpack-hot-middleware/client',
            path.join(__dirname, '/client/index.js')
        ],
        perimeter: [
            'babel-polyfill',
            path.join(__dirname, '/perimeterx/perimeter.js')
        ],
    },
	output: {
		path: '/',
		publicPath: '/',
        filename: "[name]-bundle.js"
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'client'),
                loaders: ['react-hot', 'babel']
            },
            {
                test: /\.js$/,
                include: path.join(__dirname, 'perimeterx'),
                loaders: ['babel']
            }
        ],
        rules: [
			{
				test: /\.js$/,
				include: path.join(__dirname, 'client'),
				loaders: ['react-hot', 'babel']
			},
            {
                test: /\.js$/,
                include: path.join(__dirname, 'perimeterx'),
                loaders: ['babel']
            }
		]
	},
	resolve: {
		extentions: ['', '.js']
	}
}