const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [{
      name: "ToDo",
      img: "icondanzi",
      to: "/pages/two/two"
    }, {
      name: "海报",
      img: "iconlubiao",
      to: "/pages/three/three"
    }, {
      name: "Canvas",
      img: "iconjiaoxue",
      to: "/pages/four/four"
    }, {
      name: "五子棋",
      img: "iconfenxiang1",
      to: "/pages/five/five"
    }, {
      name: "聊天",
      img: "iconxiaoxi2",
      to: "/pages/six/six"
    }, {
      name: "聊天室",
      img: "iconxiaoxi",
      to: "/pages/seven/seven"
    }, {
      name: "折线图",
      img: "iconfenxiang1",
      to: "/pages/eight/eight"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let t = this;
    t.data.navList.forEach((item) => {
      let color = t.color16()
      item.color = color;
      item.to = `${item.to}?color=${color}&name=${item.name}`;
    })
    t.setData({
      navList: t.data.navList,
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

  color16() {
    var i = 0;
    var str = "#";
    var random = 0;
    var aryNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    for (i = 0; i < 6; i++) {
      random = parseInt(Math.random() * 16);
      str += aryNum[random];
    }
    return str;
  },

  onJump(e) {
    let t = this
    let to = e.currentTarget.dataset.to
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: to,
    })
  },

})