import Wxml2Canvas from './../../libs/wx2canvas';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: []
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
    this.drawImage1();
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

  drawImage1() {
    let self = this;
    this.drawImage1 = new Wxml2Canvas({
      width: 340,
      height: 210,
      element: 'canvas1',
      background: '#f0f0f0',
      progress(percent) {},
      finish(url) {
        let imgs = self.data.imgs;
        imgs.push(url);

        self.setData({
          imgs
        })
      },
      error(res) {}
    });
    let data = {
      list: [{
        type: 'wxml',
        class: '.share-canvas1 .draw_canvas',
        limit: '.share-canvas1',
        x: 0,
        y: 0
      }]
    }
    this.drawImage1.draw(data);
  },

})