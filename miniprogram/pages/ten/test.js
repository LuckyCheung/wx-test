export default class Test {
  palette() {
    return ({
      width: '750rpx',
      height: '1000rpx',
      background: '#eee',
      views: [{
        type: 'text',
        text: '111111111111',
        css: {
          top: "0",
          align: 'center',
          width: '400rpx',
          background: '#538e60',
          textAlign: 'center',
          padding: '10rpx',
          scalable: true,
          deletable: true,
        }
      }, {
        type: 'image',
        url: 'https://qhyxpicoss.kujiale.com/r/2017/12/04/L3D123I45VHNYULVSAEYCV3P3X6888_3200x2400.jpg@!70q',
        css: {
          top: '48rpx',
          right: '48rpx',
          width: '192rpx',
          height: '192rpx',
        },
      }],
    });
  }
}