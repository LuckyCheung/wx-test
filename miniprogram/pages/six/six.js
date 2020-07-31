let app = getApp()
import IMController from '../../libs/im.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    updateAccid: '',
    updateToken: '',
    updateName: '',
    come: '',
    to: '',
    registerAccid: '',
    registerToken: '',
    registerName: '',
    registerIcon: '',
    startAccid: '',
    startToken: '',
    startChatTo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let t = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: options.color,
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    t.setData({
      openid: app.globalData.openid,
      userInfo: app.globalData.userInfo,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  update() {
    let t = this;
    let {
      updateAccid,
      updateToken,
      updateName
    } = t.data;
    wx.cloud.callFunction({
      name: 'loginIM',
      data: {
        accid: updateAccid ? updateAccid.toLowerCase() : '',
        name: updateName,
        token: updateToken,
        type: '1',
      },
      success: res => {
        if (res && res.result && res.result.code === 0) {
          console.log('im更新成功')
        } else {
          console.log('im更新失败')
        }
      },
      fail: err => {
        console.log('im注册接口调用失败')
      }
    })
  },

  getHistory() {
    let t = this;
    let {
      come,
      to
    } = t.data;
    wx.cloud.callFunction({
      name: 'loginIM',
      data: {
        to: to || '',
        type: '2',
        come: come || '',
      },
      success: res => {
        if (res && res.result && res.result.code === 0) {
          console.log(res.result.list)
          console.log('im历史成功')
        } else {
          console.log('im历史失败')
        }
      },
      fail: err => {
        console.log('im历史接口调用失败')
      }
    })
  },

  register() {
    let t = this;
    let {
      registerAccid,
      registerToken,
      registerName,
      registerIcon
    } = t.data
    wx.cloud.callFunction({
      name: 'loginIM',
      data: {
        accid: registerAccid || '',
        name: registerName || '',
        icon: registerIcon || '',
        token: registerToken || '',
      },
      success: res => {
        if (res && res.result && res.result.code === 0) {
          console.log('im手动注册成功')
        } else {
          console.log('im手动注册失败')
        }
      },
      fail: err => {
        console.log('im手动注册接口调用失败')
      }
    })
  },

  start() {
    let t = this;
    let {
      startAccid,
      startToken,
      startChatTo,
      openid,
      userInfo,
    } = t.data
    new IMController({
      token: startToken || openid,
      account: startAccid ? startAccid.toLowerCase() : '' || userInfo.nickName.toLowerCase(),
    })
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/room/room?chatTo=${startChatTo}`,
      })
    }, 1000)
  },

  inputTxT(e) {
    let t = this;
    let id = e.currentTarget.dataset.btn
    let txt = e.detail.value
    t.setData({
      [id]: txt
    })
  }

})