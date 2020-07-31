class Map {
  constructor({
    size,
    that,
  }) {
    this.size = size;
    this.that = that;
  }
  render() {
    let that = this.that;
    let points = [];
    for (let i = 0; i < that.size; i++) {
      points.push([])
      for (let n = 0; n < that.size; n++) {
        points[i].push({
          type: 0,
          x: n,
          y: i,
        })
      }
    }
    that.page.setData({
      points,
    })
  }
}

class Game {
  constructor({
    page,
    wx,
    win,
    size,
  }) {
    if (!page || !wx || !win || !size) {
      throw new Error('缺少参数')
    }
    if (win > size) {
      throw new Error('win不能大于size')
    }
    this.map = new Map({
      size,
      that: this,
    })
    this.current = 1;
    this.page = page;
    this.wx = wx;
    this.win = win;
    this.size = size;
  }

  start() {
    let that = this;
    if (that.page.data.isStart) {
      return
    }
    that.map.render()
    that.page.setData({
      isStart: true,
    })
  }

  placed({
    x,
    y,
    points = this.page.data.points,
    type = this.current,
    size = this.size,
    win = this.win,
  }) {
    let that = this;
    if (points[y][x].type === 0) {
      points[y][x].type = type;
      that.page.setData({
        points,
      })
      that.checkWin({
        x,
        y,
        type,
        size,
        win,
        points,
        that,
      })
      that.current = that.current === 1 ? 2 : 1;
    }
  }

  checkWin({
    x,
    y,
    type,
    size,
    win,
    points,
  }) {
    let that = this;
    let countX = 1;
    for (let i = x - 1; i >= x - (win - 1) && i >= 0; i--) {
      if (points[y][i].type === type) {
        countX++
      } else {
        break
      }
    }
    for (let i = x + 1; i <= x + (win - 1) && i <= size - 1; i++) {
      if (points[y][i].type === type) {
        countX++
      } else {
        break
      }
    }

    let countY = 1;
    for (let i = y - 1; i >= y - (win - 1) && i >= 0; i--) {
      if (points[i][x].type === type) {
        countY++
      } else {
        break
      }
    }
    for (let i = y + 1; i <= y + (win - 1) && i <= size - 1; i++) {
      if (points[i][x].type === type) {
        countY++
      } else {
        break
      }
    }

    let countL = 1;
    for (let i = x - 1; i >= x - (win - 1) && i >= 0; i--) {
      if (y - (x - i) >= 0 && y - (x - i) >= y - (win - 1)) {
        if (points[y - (x - i)][i].type === type) {
          countL++
        } else {
          break
        }
      }
    }
    for (let i = x + 1; i <= x + (win - 1) && i <= size - 1; i++) {
      if (y + (i - x) <= size - 1 && y + (i - x) <= y + (win - 1)) {
        if (points[y + (i - x)][i].type === type) {
          countL++
        } else {
          break
        }
      }
    }

    let countR = 1;
    for (let i = x - 1; i >= x - (win - 1) && i >= 0; i--) {
      if (y + (x - i) <= size - 1 && y + (x - i) <= y + (win - 1)) {
        if (points[y + (x - i)][i].type === type) {
          countR++
        } else {
          break
        }
      }
    }
    for (let i = x + 1; i <= x + (win - 1) && i <= size - 1; i++) {
      if (y - (i - x) >= 0 && y - (i - x) >= y - (win - 1)) {
        if (points[y - (i - x)][i].type === type) {
          countR++
        } else {
          break
        }
      }
    }

    if (countX >= win || countY >= win || countL >= win || countR >= win) {
      that.wx.showModal({
        title: '提示',
        content: `${type === 1 ? 'X' : 'O'}胜利`,
        showCancel: false,
        success(res) {
          if (res.confirm) {
            that.reset()
          }
        }
      })
    }
  }

  replay() {
    let that = this
    that.map.render()
    that.current = 1;
  }

  reset() {
    let that = this
    that.page.setData({
      isStart: false,
    })
    that.map.render()
    that.current = 1;
  }


}

module.exports = {
  Game,
}