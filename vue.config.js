'use strict'
const path = require('path')
module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src')
        }
      }
    })
  },
  productionSourceMap: true,
  devServer: {
    port: '8081',
    open: true,
    proxy: {
      '/api': {
        target: 'http://ttapi.research.itcast.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
