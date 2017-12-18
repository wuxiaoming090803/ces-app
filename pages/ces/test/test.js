//test.js
//获取应用实例
function getDistance(lat1, lng1, lat2, lng2) {
  var dis = 0
  var radLat1 = toRadians(lat1)
  var radLat2 = toRadians(lat2)
  var deltaLat = radLat1 - radLat2
  var deltaLng = toRadians(lng1) - toRadians(lng2)
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)))
  dis = dis * 6378137
  return Math.round(dis*10000)/10000.0
}

//需要转换成大地坐标
function getDistance1(lat1, lng1, lat2, lng2){
  //debugger
  var dis = 0
  var x = Math.pow((lat1 - lat2), 2)
  var y = Math.pow((lng1 - lng2), 2)
  dis = Math.sqrt(x+y)
  return dis
}

function toRadians(d){
  return d * Math.PI / 180.0
}

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userSteps: 0,
    // 用户当前经度
    userLatitude: '0',
    // 当前纬度
    userLongitude: '0',
    userDistance : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this
    setInterval(function () {
      console.log('--获取位置--')
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          console.log('经度:' + res.latitude)
          console.log('维度:' + res.longitude)
          console.log(_this.data.userLatitude, _this.data.userLongitude, res.latitude, res.longitude)
          if (_this.data.userLatitude == '0') {//第一次获取
            _this.data.userLatitude = res.latitude
            _this.data.userLongitude = res.longitude
          } else if (_this.data.userLatitude != res.latitude){//第N次获取
            var distance = getDistance(_this.data.userLatitude, _this.data.userLongitude, res.latitude, res.longitude)
            console.log('距离：' + distance +'米')
            _this.data.userLatitude = res.latitude
            _this.data.userLongitude = res.longitude
            if (distance>=2){
              _this.data.userDistance += distance//总距离
              _this.setData({
                userSteps: parseInt(parseInt(_this.data.userDistance)/0.65),
                userDistance: parseInt(_this.data.userDistance)
              })
            }
          }
          
        },
      })
    }, 5000)
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

  }

})
