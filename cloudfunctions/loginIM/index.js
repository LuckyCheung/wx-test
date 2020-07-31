const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const ServerApi = require('./ServerAPI.js');
const AppKey = 'ebfa9f7622ba1cb3b1773e0f4b0252ba';
const AppSecret = 'f32470735ebf';

exports.main = (event, context) => {
  const wxContext = cloud.getWXContext()
  const p = new ServerApi(AppKey, AppSecret);
  let {
    accid,
    name,
    icon,
    type,
    to,
    token,
    come,
  } = event

  if (type === '1') {
    return new Promise((resolve, reject) => {
      // 更新云信Id
      p.updateUserId({
        'accid': accid,
        'name': name,
        'token': token || wxContext.OPENID
      }, function(err, data) {
        console.log(err, data, '更新')
        if (data && data.code === 200) {
          resolve({
            msg: '更新成功',
            code: 0,
          })
        } else {
          resolve({
            msg: '更新失败',
            code: 1,
          })
        }
      });
    })
  } else if (type === '2') {
    return new Promise((resolve, reject) => {
      p.querySessionMsg({
        'from': come,
        'to': to,
        'begintime': '0',
        'endtime': Date.parse(new Date()) + '',
        'limit': '10',
        'reverse': '1'
      }, function(err, data) {
        console.log(err, data, '历史')
        if (data && data.code === 200) {
          resolve({
            list: data.msgs,
            msg: '历史成功',
            code: 0,
          })
        } else {
          resolve({
            msg: '历史失败',
            code: 1,
          })
        }
      });
    })
  } else {
    return new Promise((resolve, reject) => {
      //创建云信Id
      p.createUserId({
        'accid': accid,
        'name': name,
        'icon': icon,
        'token': token || wxContext.OPENID,
      }, function(err, data) {
        console.log(err, data, '注册')
        if (data && data.code === 200) {
          db.collection('counters').add({
            data: {
              _openid: wxContext.OPENID,
              ready: true
            },
            success: res => {},
            fail: err => {}
          })
          resolve({
            msg: '注册成功',
            code: 0,
          })
        } else {
          resolve({
            msg: '注册失败',
            code: 1,
          })
        }
      });
    })
  }

}

// function q({
//   url,
//   data,
//   headers,
//   method,
//   success,
//   fail,
//   complete,
// }) {
//   if (!url) {
//     return
//   }
//   if (method === 'GET') {
//     url = `${url}?${objToQuest(data)}`
//   }
//   require({
//     url,
//     data,
//     headers,
//     method
//   }, (error, response, body) => {
//     if (!error && response.statusCode == 200) {
//       success()
//     } else {
//       fail()
//     }
//     complete()
//   })

//   function objToQuest(obj) {
//     var ary = [];
//     var str;
//     for (var i in obj) {
//       ary.push(i);
//       ary.push(`=${obj[i]}&`);
//     }
//     str = ary.join('');
//     str = str.slice(0, str.length - 1);
//     return str;
//   }
// }

// function getRandom(num) {
//   var random = Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1));
// }