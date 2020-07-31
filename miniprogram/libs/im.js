import NIM from './NIM_Web_NIM_weixin_v7.5.0.js'
import MD5 from './md5.js'
let app = getApp()
import {
  updateMultiPortStatus,
  deepClone,
  dealMsg,
  showToast
} from '../utils/utils.js'

export default class IMController {
  constructor(headers) {
    app.globalData.nim = NIM.getInstance({
      // 初始化SDk
      debug: true,
      appKey: 'ebfa9f7622ba1cb3b1773e0f4b0252ba',
      token: headers.token,
      account: headers.account,
      promise: true,
      transports: ['websocket'],
      onconnect: this.onConnect, // 建立连接
      ondisconnect: this.ondisconnect, // 丢失连接
      onerror: this.onerror, // 连接出错
      onSessions: this.onSessions, // 聊天记录
      onSyncDone: this.onSyncDone, // 同步完成
    })
  }

  onConnect() {
    console.log(' onConnect: ')
  }

  onDisconnect(error) {
    console.log(' onDisconnect: ')
    console.log(error)
    if (error) {
      switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          console.log('onError: 账号或者密码错误')
          wx.showToast({
            title: '账号或密码错误',
            image: '/images/emoji.png'
          })
          break;
          // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
        case 417:
          console.log('onError: 重复登录')
          break;
          // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          wx.showModal({
            title: '用户下线',
            showCancel: false,
            content: '在其他客户端登录，导致被踢',
            confirmText: '重新登录',
            success: (res) => {
              if (res.confirm) { //点击确定
                let pages = getCurrentPages()
                let currentPage = pages[pages.length - 1]
                if (currentPage.route.includes('videoCallMeeting')) { // 多人视频
                  try {
                    // 兼容登录网关502错误离开房间
                    if (app.globalData.netcall) {
                      app.globalData.netcall.leaveChannel()
                        .then(() => {
                          app.globalData.netcall.destroy()
                          app.globalData.nim.destroy({
                            done: function() {
                              console.log('destroy nim done !!!')
                              wx.clearStorage()
                              wx.hideLoading()
                            }
                          })
                          wx.reLaunch({
                            url: '/pages/login/login',
                          })
                        })
                    }
                  } catch (error) {}
                } else if (currentPage.route.includes('videoCall')) { // p2p
                  try {
                    // 兼容登录网关502错误离开房间
                    if (app.globalData.netcall) {
                      app.globalData.netcall.hangup()
                        .then(() => {
                          app.globalData.netcall.destroy()
                          app.globalData.nim.destroy({
                            done: function() {
                              console.log('destroy nim done !!!')
                              wx.clearStorage()
                              wx.hideLoading()
                            }
                          })
                          wx.reLaunch({
                            url: '/pages/login/login',
                          })
                        })
                    }
                  } catch (error) {
                    console.warn(error)
                  }
                } else {
                  app.globalData.netcall.destroy()
                  app.globalData.nim.destroy({
                    done: function() {
                      console.log('destroy nim done !!!')
                      wx.clearStorage()
                      wx.hideLoading()
                    }
                  })
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
                }

              }
            }
          })
          break;
        default:
          break;
      }
    }
  }

  onError(error) {
    console.log(' onError', error)
    app.globalData.nim.disconnect()
    app.globalData.nim.connect()
  }

  onSessions(sessions) {
    console.log('onSessions: ', sessions)
  }

  onSyncDone() {
    console.log('onSyncDone')
  }

}