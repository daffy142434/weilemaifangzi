import axios, { CancelToken } from 'axios';
import queryString from 'query-string';
import { Message } from 'element-ui';
import router from '../router';
let tokenData={};//存储token状态
let ajax = axios.create({
  // 登录失效后由此参数给后端判断是否是ajax请求，如果不传可能302错误
  headers: {'isAjax': true},
  responseType: 'json',
  withCredentials: true,
  baseURL: apiAddress,
  transformRequest: [
    (data) => {
      return queryString.stringify(data);
    }
  ],
  validateStatus(status) {
    switch(status) {
      case 302:
      case 504:
      case 510:
        sessionTimeOut();
        break;
    }
    return status >= 200 && status < 300;
  },
  transformResponse: [
    (data) => {
      if (typeof data === 'object') {
        if(data && data.code) {
          switch (data.code) {
            case 500:
              Message({
                showClose: true,
                message: data.msg || '系统错误',
                type: 'error'
              });
            break;
            case 302:
            case 504:
            case 510:
              sessionTimeOut();
            break;
            case 403:
              Message({
                showClose: true,
                message: data.msg || '您还没有当前功能的使用权限',
                type: 'error'
              });
            break;
            case 200:
            case 201:
            default:
          }
        }
        if (data.code !== 200 && data.code !== 201) {
          throw new Error(data.msg);
        }
      } else {
        throw new Error('服务器返回错误的数据格式');
      }
      return data;
    }
  ],
  cancelToken: new CancelToken(() => {})
});

ajax.interceptors.response.use(
  response => {
    if(response.config.method==="post"){
      let tokenUrl=response.config.url+response.config.data;
      if(tokenData[tokenUrl]&&tokenData[tokenUrl].token){
        tokenData[tokenUrl].token="";
      }
    }
    
    return response;
  },
  (error) => {
    if ('response' in error) {
      if (error.response === undefined || error.response === null) {
        error.message = '对不起，网络繁忙，请再试试';
      }
    }
    return Promise.reject(error);
  }
)

let errorHandle = function(error) {
  if (error.response) {
    if(error.response.status == '404') {
      Message({
        showClose: true,
        message: '您请求的接口不存在',
        type: 'error'
      });
    }
  } else {
    Message({
      showClose: true,
      message: error,
      type: 'error'
    });
  }
};
Object.assign(ajax, {errorHandle: errorHandle});

function getToken() {
  var p = ajax.get('/token');
  return p;
}

function sessionTimeOut() {
  const pageLoadTime = (+sessionStorage.getItem('pageLoadTime'));

  if (window._isClear === -1) {
    return;
  }
  window._isClear = -1;
  localStorage.clear();
  sessionStorage.clear();
  location.reload();
  if (Date.now() - pageLoadTime > 60000) {
    sessionStorage.setItem('pageLoadTime', -1);
    Message({
      showClose: true,
      message: '系统超时，重新登录',
      type: 'error'
    });
  }
}

// export default {
//   get(url, config = {params: {}}) {
//     return getToken().then((res) => {
//       config.params.token = res.data.data;
//       return ajax.get(url, config);
//     });
//   },
//   post(url, data = {}, config = {}) {
//     return getToken().then((res) => {
//       data.token = res.data.data;
//       return ajax.post(url, data, config);
//     });
//   }
// };
export default {
  get(url, config = {params: {}}) {
    return ajax.get(url, config);
  },
  post(url, data = {}, config = {}) {
    let dataStr=queryString.stringify(data);
    let tokenUrl=process.env.NODE_ENV === 'development'?'api'+url+dataStr:url+dataStr;
    if(tokenData[tokenUrl]===undefined){
      tokenData[tokenUrl]={};
      return getToken().then(res=>{
        data.token=res.data.data;
        tokenData[tokenUrl].token=data.token;
        return ajax.post(url, data, config);
      });
    }else{
      if(tokenData[tokenUrl].token){
        data.token=tokenData[tokenUrl].token;
        return ajax.post(url, data, config);
      }else{
        return getToken().then(res=>{
          data.token=res.data.data;
          tokenData[tokenUrl].token=data.token;
          return ajax.post(url, data, config);
        });
      }
    }
  }
};
