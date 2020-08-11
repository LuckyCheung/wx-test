// miniprogram/pages/eight/eight.js
let Charts = require('./../../libs/wxcharts.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: options.color,
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    this.myData = {
      lineChart: null
    }
    let lineChart = new Charts({
      canvasId: 'canvas1',
      type: 'line',
      width: 375,
      height: 300,
      dataLabel: false,
      legend: false,
      extra: {
        lineStyle: 'straight',
      },
      yAxis: {
        min: 0,
        max: 8
      },
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [{
        name: '珠海世博湾',
        data: [1, 2, 4, 4, 4, 6],
        color: '#76DC89',
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }],
    });


    this.myData.lineChart = lineChart
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  touchHandler: function (e) {
    let {
      lineChart
    } = this.myData
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
})