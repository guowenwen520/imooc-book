function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}
const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')
module.exports = {
  // 打包的相关配置
  publicPath: process.env.NODE_ENV === 'production' ? '/' : './',
  outputDir: 'dist',
  // assetsDir: 'static',
  indexPath: 'index.html',
  devServer: {
    before(app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }
  },
  configureWebpack: {
    performance: {
      // 枚举
      hints: 'warning',
      // 生成文件的最大体积,整数类型（以字节为单位）
      maxAssetSize: 512 * 1024 * 10,
      // 入口起点的最大体积,整数类型（以字节为单位）
      maxEntrypointSize: 512 * 1024 * 10
    }
  }
}
