const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
//const NpmInstallPlugin = require('npm-install-webpack-plugin');

// Load *package.json* so we can use `dependencies` from there
const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;

const common = {
  // Entry accepts a path or an object of entries. We'll be using the
  // latter form given it's convenient with more complex configurations.
  entry: {
    app: PATHS.app
  },
  // Add resolve.extensions.
  // '' is needed to allow imports without an extension.
  // Note the .'s before extensions as it will fail to match without!!!
  resolve: {
    extensions: [' ', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    // Output using entry name
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        // Test expects a RegExp! Note the slashes!
        test:/\.css$/,
        use: ['style-loader', 'css-loader'],
        // Include accepts either a path or an array of paths.
        include: PATHS.app
      },
      // Set up jsx. This accepts jsx too thanks to RegExp
      {
        test:/\.jsx?$/,
        // Enable caching for improved performance during development
        // It uses default OS directory by default. If you need something
        // more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
        use: ['babel-loader?cacheDirectory'],
        // Parse only app files! Without this it will go through entire project.
        // In addition to being slow, that will most likely result in an error.
        include: PATHS.app
      }
    ]
  }
};

// Default configuration
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      static: PATHS.build,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
//      inline: true,
//      progress: true,

      // Display only errors to reduce the amount of output.
//      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      //
      // If you use Vagrant or Cloud9, set
      // host: process.env.HOST || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices unlike default
      // localhost
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
//      new NpmInstallPlugin({
//        save: true // --save
//      })
    ]
  });
}

if (TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    // Define vendor entry point needed for splitting
    // entry: {
    //   vendor: Object.keys(pkg.dependencies).filter(function(v) {
    //     return v !== 'alt-utils';
    //   })
    // },
    output: {
      path: PATHS.build,
      // Output using entry name
      filename: '[name].[chunkhash].js'
    },
    optimization: {
      splitChunks: { chunks: "all" }
    },
    plugins: [
      // // Extract vendor and manifest files
      // new webpack.optimize.CommonsChunkPlugin({
      //   names: ['vendor', 'manifest']
      // }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      })
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     warnings: true
      //   }
      // })
    ]
  });
}
