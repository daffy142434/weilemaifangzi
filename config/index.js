
'use strict'
// Template version: 1.1.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const isMock = !!process.env.MOCK;

module.exports = {

  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    apiAddress: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8080,
    isMock: !!process.env.MOCK,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // apiAddress: isMock ? '/mock' : '/api',
    apiAddress:'api',
    proxyTable: {
      '/api' : {
        // 三奇嘉会测试环境
        // target:'http://sqjh.paiorder.com:7084/',
        // target:'http://cc.co.cinbos.com:10101/',
        // target: 'http://113.87.194.190:7084',
        target: 'http://sqjh.paiorder.com:8010',
        // 生产环境
        // target:'http://cc.co.cinbos.com:9001/',
        
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
       }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true
  }
}
