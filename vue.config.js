const path = require('path')

module.exports = {
  "lintOnSave": false,
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    resolve: {
      alias: {
        // Tone 14 sets "browser": "build/Tone.js" (a UMD bundle) while also
        // declaring "type": "module". Webpack therefore parses that UMD file as
        // ESM, finds no export bindings, and every `Tone.*` binding resolves to
        // undefined at runtime. Point at the real ESM entry instead.
        tone$: path.resolve(__dirname, 'node_modules/tone/build/esm/index.js')
      }
    },
    module: {
      rules: [
        {
          // Tone's ESM build uses extensionless relative imports, which webpack
          // rejects under the package's "type": "module" unless relaxed.
          test: /\.m?js$/,
          resolve: { fullySpecified: false }
        }
      ]
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    https: true,
  }
}
