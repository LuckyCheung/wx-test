//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    motto: '登陆后开启更多功能',
    tip: '点击头像进入',
    hasUserInfo: false,
    userInfo: {
      avatarUrl: './user-unlogin.png',
    },
  },

  onLoad: function() {
    let t = this
    if (app.globalData.openid) {
      if (app.globalData.userInfo) {
        t.checkIsRegisterIM(app.globalData.openid)
          .then(res => {
            if (!res) {
              t.registerIM({
                userInfo: app.globalData.userInfo || {},
              })
            }
          })
      }
    } else {
      app.openIdReadyCallback = res => {
        let openid = res.result.openid
        app.globalData.openid = openid
        wx.setStorageSync("user_openid", openid)
        if (app.globalData.userInfo) {
          t.checkIsRegisterIM(app.globalData.openid)
            .then(res => {
              if (!res) {
                t.registerIM({
                  userInfo: app.globalData.userInfo || {},
                })
              }
            })
        }
      }
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.navigateTo({
        url: '/pages/one/one',
      })
    } else {
      app.userInfoReadyCallback = res => {
        let userInfo = res.userInfo || {}
        app.globalData.userInfo = userInfo
        wx.setStorageSync("user_info", userInfo)
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true
        })
        wx.navigateTo({
          url: '/pages/one/one',
        })
      }
    }
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  bindViewTap() {
    wx.navigateTo({
      url: '/pages/one/one',
    })
  },

  async checkIsRegisterIM(openid) {
    let res = await db.collection('counters').where({
      _openid: openid
    }).get()
    if (res && res.data && res.data.length) {
      return true
    } else {
      return false
    }
  },

  registerIM({
    userInfo,
  }) {
    wx.cloud.callFunction({
      name: 'loginIM',
      data: {
        accid: userInfo.nickName.toLowerCase(),
        name: userInfo.nickName,
        icon: userInfo.avatarUrl,
      },
      success: res => {
        if (res && res.result && res.result.code === 0) {
          console.log('im注册成功')
        } else {
          console.log('im注册失败')
        }
      },
      fail: err => {
        console.log('im注册接口调用失败')
      }
    })
  }

})