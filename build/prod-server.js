const path = require('path');
const express = require('express');
const proxyMiddleware = require('http-proxy-middleware')

// const rootPath = path.resolve(__dirname, '../');
const app = express();

// 设置静态资源目录
app.use(express.static(path.join(__dirname, '../../')));
app.use(proxyMiddleware('!/resource/**', {
  target:'http://sqjh.paiorder.com:7084/',
  // target:'http://cc.co.cinbos.com:9001',
  // target:'http://113.87.193.147:7084/',
  // target:'http://192.168.0./',
}));

app.listen(3000, (err) => {
  if (err) {
    console.error(`=> OMG!!! 🙀 ${err}`);
  } else {
    console.info('==> 🚧 listening at http://%s:%s', 'localhost', '3000');
  }
});
