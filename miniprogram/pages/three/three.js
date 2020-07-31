const echarts = require("../../libs/ec-canvas/echarts");

let chart = null;
let data = {
  solar: 'YYYY-MM-DD',
  solar: '',
  lunar: '',
  title: {
    text: '访问来源',
    left: 'center'
  },
  series: [{
    name: '访问来源',
    type: 'pie',
    radius: '50%',
    data: [{
        value: 235,
        name: '群聊分享235人'
      },
      {
        value: 274,
        name: '单聊分享274人'
      },
      {
        value: 310,
        name: '长按分享310人'
      },
      {
        value: 335,
        name: '直接进入335人'
      },
      {
        value: 400,
        name: '其他400人'
      }
    ]
  }]
};

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  let option = data;
  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: options.color,
    })
    wx.setNavigationBarTitle({
      title: options.name,
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

  bindSolarChange() {

  },

  bindLunarChange() {

  },

})