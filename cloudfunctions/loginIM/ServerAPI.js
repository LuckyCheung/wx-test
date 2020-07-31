var crypto = require('crypto');
var https = require('https');
var http = require('http');
var urlParser = require('url');
var querystring = require('querystring');

module.exports = ServerApi;
const BaseHost = 'https://api.netease.im'
// const BaseHost = 'http://223.252.220.223'
/**
 * 参数初始化
 * @param $AppKey
 * @param $AppSecret
 */
function ServerApi(AppKey, AppSecret) {
  this.AppKey = AppKey;                     //开发者平台分配的AppKey
  this.AppSecret = AppSecret;                 //开发者平台分配的AppSecret,可刷新
}

/**
 * API checksum校验生成
 * @param  void
 * @return CheckSum(对象私有属性)
 */
ServerApi.prototype.checkSumBuilder = function () {
  //此部分生成随机字符串
  var charHex = '0123456789abcdef';
  this.Nonce = '';                  //随机数（最大长度128个字符）
  for (var i = 0; i < 128; i++) {			//随机字符串最大128个字符，也可以小于该数
    this.Nonce += charHex.charAt(Math.round(15 * Math.random()));
  }
  this.CurTime = Date.parse(new Date()) / 1000;		//当前UTC时间戳，从1970年1月1日0点0 分0 秒开始到现在的秒数(String)
  var join_string = this.AppSecret + this.Nonce + this.CurTime

  var sha1 = crypto.createHash('sha1');
  sha1.update(join_string);
  this.CheckSum = sha1.digest('hex');       //SHA1(AppSecret + Nonce + CurTime),三个参数拼接的字符串，进行SHA1哈希计算，转化成16进制字符(String，小写)

}

/**
 * 使用发送post请求
 * @param  url 			[请求地址]
 * @param  data    		[json格式数据]
 * @param  callback    	[请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.postDataHttps = function (url, data, callback) {
  this.checkSumBuilder();

  var urlObj = urlParser.parse(url);
  var postData = querystring.stringify(data);
  var httpHeader = {
    'AppKey': this.AppKey,
    'Nonce': this.Nonce,
    'CurTime': this.CurTime,
    'CheckSum': this.CheckSum,
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'Content-Length': Buffer.byteLength(postData, 'utf8') 
  };
  
  var options = {
    hostname: urlObj.hostname,
    port: 80,
    path: urlObj.path,
    method: 'POST',
    headers: httpHeader
  };

  var that = this;
  var req = http.request(options, function (res) {
    let data = ''
    res.setEncoding('utf8');
    // console.log("statusCode: ", res.statusCode);
    // console.log("headers: ", res.headers);

    res.on('data', function (chunk) {
      data += chunk
    });
    res.on('end', function () {
      if (Object.prototype.toString.call(callback) === '[object Function]') {
        var result = JSON.parse(data);
        callback.call(that, null, result);
      }
    })
  });

  req.write(postData);
  req.end();

  req.on('error', function (err) {
    if (Object.prototype.toString.call(callback) === '[object Function]') {
      callback.call(that, err, null);
    }
  });
}

/**
 * 创建云信ID
 * 1.第三方帐号导入到云信平台；
 * 2.注意accid，name长度以及考虑管理秘钥token
 * @param data 包含：
 *     -  accid     [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 *     -  name      [云信ID昵称，最大长度64字节，用来PUSH推送时显示的昵称]
 *     -  props     [json属性，第三方可选填，最大长度1024字节]
 *     -  icon      [云信ID头像URL，第三方可选填，最大长度1024]
 *     -  token     [云信ID可以指定登录token值，最大长度128字节，并更新，如果未指定，会自动生成token，并在创建成功后返回]
 * @param  callback    	[请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.createUserId = function (data, callback) {
  var url = `${BaseHost}/nimserver/user/create.action`
  var postData = {
    'accid': data['accid'] || '',
    'name': data['name'] || '',
    'props': data['props'] || '',
    'icon': data['icon'] || '',
    'token': data['token'] || ''
  };
  this.postDataHttps(url, postData, callback);
}

/**
 * 消息功能-发送普通消息
 * @param data 包含：
 *     -  from       [发送者accid，用户帐号，最大32字节，APP内唯一]
 *     -  ope        [0：点对点个人消息，1：群消息，其他返回414]
 *     -  to        [ope==0是表示accid，ope==1表示tid]
 *     -  type        [0 表示文本消息,1 表示图片，2 表示语音，3 表示视频，4 表示地理位置信息，6 表示文件，100 自定义消息类型]
 *     -  body       [请参考下方消息示例说明中对应消息的body字段。最大长度5000字节，为一个json字段。]
 *     -  option       [发消息时特殊指定的行为选项,Json格式，可用于指定消息的漫游，存云端历史，发送方多端同步，推送，消息抄送等特殊行为;option中字段不填时表示默认值]
 *     -  pushcontent      [推送内容，发送消息（文本消息除外，type=0），option选项中允许推送（push=true），此字段可以指定推送内容。 最长200字节]
 * @param  callback    	[请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.sendMsg = function (data, callback) {
  var url = `${BaseHost}/nimserver/msg/sendMsg.action`
  var postData = {
    'from': data['from'] || '',
    'ope': data['ope'] || '',
    'to': data['to'] || '',
    'type': data['type'] || '0',
    'body': JSON.stringify(data['body']) || '{}',
    'option': JSON.stringify(data['option']) || '{"push":false,"roam":true,"history":true,"sendersync":true, "route":false}',
    'pushcontent': data['pushcontent'] || ''
  };
  this.postDataHttps(url, postData, callback);
}

/**
 * 消息功能-发送自定义系统消息
 * 1.自定义系统通知区别于普通消息，方便开发者进行业务逻辑的通知。
 * 2.目前支持两种类型：点对点类型和群类型（仅限高级群），根据msgType有所区别。
 * @param data 包含：
 *     -  from       [发送者accid，用户帐号，最大32字节，APP内唯一]
 *     -  msgtype        [0：点对点个人消息，1：群消息，其他返回414]
 *     -  to        [msgtype==0是表示accid，msgtype==1表示tid]
 *     -  attach        [自定义通知内容，第三方组装的字符串，建议是JSON串，最大长度1024字节]
 *     -  pushcontent       [ios推送内容，第三方自己组装的推送内容，如果此属性为空串，自定义通知将不会有推送（pushcontent + payload不能超过200字节）]
 *     -  payload       [ios 推送对应的payload,必须是JSON（pushcontent + payload不能超过200字节）]
 *     -  sound      [如果有指定推送，此属性指定为客户端本地的声音文件名，长度不要超过30个字节，如果不指定，会使用默认声音]
 * @param  callback    	[请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.sendAttachMsg = function (data, callback) {
  var url = `${BaseHost}/nimserver/msg/sendAttachMsg.action`
  var postData = {
    'from': data['from'] || '',
    'msgtype': data['msgtype'] || '0',
    'to': data['to'] || '',
    'attach': data['attach'] || '',
    'pushcontent': data['pushcontent'] || '',
    'payload': JSON.stringify(data['payload']) || '{}',
    'sound': data['sound'] || ''
  };
  this.postDataHttps(url, postData, callback);
}

/**
 * 历史记录-单聊
 * @param data 包含：
 *     -  from       [发送者accid]
 *     -  to          [接收者accid]
 *     -  begintime     [开始时间，ms]
 *     -  endtime     [截止时间，ms]
 *     -  limit       [本次查询的消息条数上限(最多100条),小于等于0，或者大于100，会提示参数错误]
 *     -  reverse    [1按时间正序排列，2按时间降序排列。其它返回参数414.默认是按降序排列。]
 * @param  callback    	[请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.querySessionMsg = function (data, callback) {
  var url = `${BaseHost}/nimserver/history/querySessionMsg.action`
  var postData = {
    'from': data['from'] || '',
    'to': data['to'] || '',
    'begintime': data['begintime'] || '0',
    'endtime': data['endtime'] || (Date.parse(new Date()) + ''),
    'limit': data['limit'] || '100',
    'reverse': data['reverse'] || '1'
  };
  this.postDataHttps(url, postData, callback);
}

/**
 * 发起单人专线电话
 * @param data 包含：
 *     -  callerAcc       [发起本次请求的用户的accid]
 *     -  caller          [主叫方电话号码(不带+86这类国家码,下同)]
 *     -  callee          [被叫方电话号码]
 *     -  maxDur          [本通电话最大可持续时长,单位秒,超过该时长时通话会自动切断]
 * @param  callback    	[请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.startcall = function (data, callback) {
  var url = `${BaseHost}/call/ecp/startcall.action`
  var postData = {
    'callerAcc': data['callerAcc'] || '',
    'caller': data['caller'] || '',
    'callee': data['callee'] || '0',
    'maxDur': data['maxDur'] || '60'
  };
  this.postDataHttps(url, postData, callback);
}

/**
 * 更新云信ID
 * @param data 包含：
 *     -  accid     [云信ID，最大长度32字节，必须保证一个APP内唯一（只允许字母、数字、半角下划线_、@、半角点以及半角-组成，不区分大小写，会统一小写处理）]
 *     -  name      [云信ID昵称，最大长度64字节，用来PUSH推送时显示的昵称]
 *     -  props     [json属性，第三方可选填，最大长度1024字节]
 *     -  token     [云信ID可以指定登录token值，最大长度128字节，并更新，如果未指定，会自动生成token，并在创建成功后返回]
 * @param  callback    	[请求返回的回调函数]
 * @return 回调函数中返回两参数(err,json格式的data)
 */
ServerApi.prototype.updateUserId = function (data, callback) {
  var url = `${BaseHost}/nimserver/user/update.action`
  var postData = {
    'accid': data['accid'] || '',
    'name': data['name'] || '',
    'props': data['props'] || '',
    'token': data['token'] || ''
  };
  this.postDataHttps(url, postData, callback);
}

