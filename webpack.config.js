require('webpack')
require('path')
require('fs')

module.exports = {
  entry: [
    './src/mesh_server.js'
  ],
  output: {
    filename: 'dist/backend-output.js'
  },
  target: 'node',
//  externals: // specify for example node_modules to be not bundled
  // other loaders, plugins etc. specific for backend
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      }
    ]
  },
  plugins: [ /* common plugins */ ],
  resolve: {
    extensions: ['.js', '.jsx'] // common extensions
  },
    // other plugins, postcss config etc. common for frontend and backend

  devtool: 'source-map'

}
