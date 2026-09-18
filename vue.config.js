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
  chainWebpack: config => {
    // Vuetify component props are not native asset attributes, so vue-loader
    // leaves <v-img src="../assets/..."> as a literal string and the browser
    // 404s it. vue-cli-plugin-vuetify used to register these; the Vue 3
    // migration dropped that plugin without replacing the transform.
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = options.compilerOptions || {}
        options.transformAssetUrls = Object.assign({}, options.transformAssetUrls, {
          'v-img': ['src', 'lazy-src'],
          'v-card': 'image',
          'v-card-item': 'prepend-avatar',
          'v-carousel-item': ['src', 'lazy-src'],
          'v-parallax': 'src',
          'v-avatar': 'image',
          'v-toolbar': 'image'
        })
        return options
      })
  },

  devServer: {
    host: '0.0.0.0',
    port: 8080,
    https: true,
  }
}
