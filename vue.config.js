module.exports = {
  // 打包的相关配置
  publicPath: process.env.NODE_ENV === 'production' ? '/' : './',
  outputDir: "dist",
  assetsDir:"static",
  indexPath:'index.html'
}