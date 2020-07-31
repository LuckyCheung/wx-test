const app = getApp()
Page({
  data: {
    thingName: '',
    things: [],
    finish: 0,
    isShowPage: false,
  },
  onLoad(options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: options.color,
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    let t = this;
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    });
    let things = wx.getStorageSync('things')
    let ready = wx.getStorageSync('ready')
    if (ready === 'true') {
      t.setData({
        things: things,
        isShowPage: true,
      }, () => {
        wx.hideLoading()
      })
      t.update()
    } else {
      wx.cloud.callFunction({
          name: 'getUserData',
        })
        .then(res => {
          if (res && res.result) {
            if (res.result.code === 0 || res.result.code === 1) {
              t.setData({
                things: res.result.data,
                isShowPage: true,
              }, () => {
                wx.hideLoading()
              })
              wx.setStorageSync('ready', 'true')
              t.update()
            } else {
              t.setData({
                isShowPage: true,
              }, () => {
                wx.hideLoading()
              })
            }
          } else {
            t.setData({
              isShowPage: true,
            }, () => {
              wx.hideLoading()
            })
          }
        })
    }
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
  onShareAppMessage: function(res) {
    return {
      title: '提醒事项',
      path: 'pages/index/index',
      imageUrl: '../../assets/timg.jpg'
    }
  },
  // 输入触发
  write(e) {
    this.setData({
      thingName: e.detail.value
    })
  },

  // 修改文本
  modification(e) {
    let t = this;
    let value = e.detail.value || '';
    let index = e.currentTarget.dataset.index
    t.setData({
      [`things[${index}].name`]: value || ''
    })
    t.update()
  },

  // 添加任务
  add() {
    let {
      things,
      thingName
    } = this.data
    if (thingName.trim() == "") return
    let localID = things.length ? things[things.length - 1].localID + 1 : localID = 1;
    this.setData({
      things: [...things, {
        localID: localID,
        name: thingName,
        status: false
      }],
      thingName: "",
    })
    this.update()
  },

  // 切换单个任务状态
  select(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      [`things[${index}].status`]: !this.data.things[index].status
    })
    this.update()
  },

  // 删除任务
  del(e) {
    this.data.things.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      things: this.data.things
    })
    this.update()
  },

  // 点击切换
  toggle() {
    let {
      things
    } = this.data
    let isAllSelect = things.every(item => item.status)
    things.forEach(item => item.status = !isAllSelect)
    this.setData({
      things
    })
    this.update()
  },

  // 点击清除
  clear() {
    this.setData({
      things: this.data.things.filter(item => !item.status)
    })
    this.update()
  },

  // 更新
  update() {
    let count = this.data.things.reduce(function(count, item) {
      if (!item.status) {
        count++
      }
      return count
    }, 0)
    this.setData({
      finish: count
    })
    wx.setStorageSync('things', this.data.things)
  },

  //网络同步
  sync() {
    let t = this;
    wx.showLoading({
      title: '数据同步中...',
      mask: true,
    });
    wx.cloud.callFunction({
        name: 'syncUserData',
        data: {
          things: t.data.things,
        }
      })
      .then(res => {
        if (res && res.result) {
          if (res.result.code === 0) {
            wx.hideLoading()
            wx.showToast({
              title: '同步数据成功',
              icon: 'success',
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '同步数据失败',
              icon: 'none',
            })
          }
        }
      })
      .catch(() => {
        wx.hideLoading()
        wx.showToast({
          title: '同步数据失败',
          icon: 'none',
        })
      })
  },

})