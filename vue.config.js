
module.exports = {
  "lintOnSave": false,
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    resolve: {
      alias: {
        // Tone ships a UMD bundle in its `browser` field, which webpack cannot
        // analyse statically ("module has no exports"). Point at the ESM build
        // so the named imports resolve and the bundle stays tree-shakeable.
        tone$: require.resolve('tone/build/esm/index.js')
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    https: true,
  }
}
