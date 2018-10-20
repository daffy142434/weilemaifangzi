# weilanxunce-web

> weilanxunce-web-fe

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



# 代码规划

`webapp/static/src`下为源文件

页面放到`webapp/static/src/page`下

路由在`webapp/static/src/router/index`

模块相关的`image`, `css`及其它资源按 **就近原则** 规划

状态方案采用Vuex，`webapp/src/store`放置全局`store`相关的内容

页面模块和组件模块对应的`store`按 **就近原则** 规划

