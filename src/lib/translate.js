import MD5 from 'lib/md5';
import { Message } from 'element-ui';
import jsonp from 'jsonp';
import queryString from 'query-string';

let makeTo = function(to) {
  let toMap = {
    'fr': 'fra',
    'es': 'spa',
  };
  return toMap[to] || to; 
};

let translate = function(str,from, to, callback) {
  
  if(typeof str == 'string') {
    var result = '';
    var appid = '2015063000000001';
    var key = '12345678';
    var salt = (new Date).getTime();
    var query = str;
    // var from = 'auto';
    // var to = 'zh';
    var from =from ?makeTo(from): 'zh';
    var to = to?makeTo(to):'zh';
    var str1 = appid + query + salt +key;
    var sign = MD5(str1);
    const param = {
      q: query,
      appid: appid,
      salt: salt,
      from: from,
      to: to,
      sign: sign
    }
    jsonp('http://api.fanyi.baidu.com/api/trans/vip/translate?'+queryString.stringify(param), null, function (err, data) {
      if (err) {
        console.error(err.message);
      } else {
        let temp = [];
        for(let item of data.trans_result) {
          temp.push(item.dst);
        }
        result = temp.join(" ");
        callback(result);
      }
    });
  }else {
    Message({
      showClose: true,
      message: '翻译函数的入参必须是字符串',
      type: 'error'
    });
  }
};

export default translate;
