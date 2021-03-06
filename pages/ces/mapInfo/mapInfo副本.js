// pages/ces/mapInfo/mapInfo.js
const Config = require("../../../config.js");
const Storage = require("../../../storage.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*
    get longitude() {
      let location = Storage.get("location");
      return (location && location != "") ? location.longitude : '120.996660'
    },
    get lonlatitudegitude() {
      let location = Storage.get("location");
      return (location && location != "") ? location.latitude : '31.063660'
    },
    */
    longitude: '120.999084',
    latitude: '31.059691',
    polyline: [{
      points: [{
        longitude: 121.00622885016823,
        latitude: 31.049520711896093
      },

      {
        longitude: 121.00614387132804,
        latitude: 31.04989971940945
      },

      {
        longitude: 121.00365584860074,
        latitude: 31.049701753380862
      },

      {
        longitude: 121.00352089166441,
        latitude: 31.050463766528928
      },

      {
        longitude: 121.00473390344989,
        latitude: 31.050587753747333
      },

      {
        longitude: 121.00575791418444,
        latitude: 31.050687738781477
      },

      {
        longitude: 121.00970996362446,
        latitude: 31.05105564552028
      },

      {
        longitude: 121.00846626894887,
        latitude: 31.056596768160137
      },

      {
        longitude: 121.00844829190866,
        latitude: 31.05700277491031
      },

      {
        longitude: 121.00765330353495,
        latitude: 31.057311800474597
      },

      {
        longitude: 121.00761731101483,
        latitude: 31.05744780345715
      },

      {
        longitude: 121.00778334319718,
        latitude: 31.057992807710917
      },

      {
        longitude: 121.00185538872199,
        latitude: 31.05926491380004
      },

      {
        longitude: 121.00115839008355,
        latitude: 31.059306916346756
      },

      {
        longitude: 121.00111341269763,
        latitude: 31.059705922546506
      },

      {
        longitude: 121.00087541245995,
        latitude: 31.05970592275852
      },

      {
        longitude: 121.00044039807332,
        latitude: 31.05945791880733
      },

      {
        longitude: 120.99986539203604,
        latitude: 31.0593539159863
      },

      {
        longitude: 120.99795641991592,
        latitude: 31.059813910512062
      },

      {
        longitude: 120.9953424532469,
        latitude: 31.060262879055408
      },

      {
        longitude: 120.99484845759092,
        latitude: 31.060300869640297
      },

      {
        longitude: 120.99431846132184,
        latitude: 31.06032085824779
      },

      {
        longitude: 120.99414346899154,
        latitude: 31.060439855993174
      },

      {
        longitude: 120.99371651328313,
        latitude: 31.06117885692651
      },

      {
        longitude: 120.99372051433849,
        latitude: 31.061197857319186
      },

      {
        longitude: 120.99265656612695,
        latitude: 31.061994840760395
      },

      {
        longitude: 120.9924765708585,
        latitude: 31.06205683643894
      },

      {
        longitude: 120.99099462803538,
        latitude: 31.06286880107789
      },

      {
        longitude: 120.98897771018369,
        latitude: 31.063993740613448
      },

      {
        longitude: 120.98870376591431,
        latitude: 31.064928743273136
      },

      {
        longitude: 120.9889377745088,
        latitude: 31.06512275624234
      },

      {
        longitude: 120.98909080008126,
        latitude: 31.06560177001498
      },

      {
        longitude: 120.98917980530967,
        latitude: 31.065709775371552},

{
        longitude: 120.99001981007405,
        latitude: 31.065934812354538
      },

      {
        longitude: 120.98941887451187,
        latitude: 31.06697480455328
      },

      {
        longitude: 120.98979988090699,
        latitude: 31.067151822461426
      },

      {
        longitude: 120.99060390458114,
        latitude: 31.067697861186357
      },

      {
        longitude: 120.99151191357106,
        latitude: 31.06798789713493
      },

      {
        longitude: 120.99267493531008,
        latitude: 31.068520941338058
      },

      {
        longitude: 120.99359585664814,
        latitude: 31.067229946683923
      },

      {
        longitude: 120.99746292906795,
        latitude: 31.068788042797266
      },

      {
        longitude: 120.99938097599102,
        latitude: 31.06966607219553
      },

      {
        longitude: 120.99981200356079,
        latitude: 31.070157081476893
      },

      {
        longitude: 121.00070600948794,
        latitude: 31.070257084565263
      },

      {
        longitude: 121.00113701535896,
        latitude: 31.070354085776813
      },

      {
        longitude: 121.00173402730437,
        latitude: 31.07055108731268
      },

      {
        longitude: 121.00354398278778,
        latitude: 31.06968106173869
      },

      {
        longitude: 121.00303193080353,
        latitude: 31.068788052744086
      },

      {
        longitude: 121.0018687436763,
        latitude: 31.06552500987735
      },

      {
        longitude: 121.00198073358584,
        latitude: 31.065343006614338
      },

      {
        longitude: 121.0029917307201,
        latitude: 31.065249998884838
      },

      {
        longitude: 121.00309072421422,
        latitude: 31.065129996230908
      },

      {
        longitude: 121.00305468408695,
        latitude: 31.064422985688907
      },

      {
        longitude: 121.00313566195545,
        latitude: 31.06402797894774
      },

      {
        longitude: 121.00317565335227,
        latitude: 31.063873976239627
      },

      {
        longitude: 121.00298260808587,
        latitude: 31.063084965744363
      },

      {
        longitude: 121.00269058099897,
        latitude: 31.062620960808154
      },

      {
        longitude: 121.00234450802796,
        latitude: 31.06134894346679
      },

      {
        longitude: 121.00190851020234,
        latitude: 31.061402946453253
      },

      {
        longitude: 121.00180150609594,
        latitude: 31.061333945818284
      },

      {
        longitude: 121.0013074385986,
        latitude: 31.06015792917401
      },

      {
        longitude: 121.00115842853671,
        latitude: 31.059983926758647
      },

      {
        longitude: 121.00112741271323,
        latitude: 31.05970592252772
      },

      {
        longitude: 121.00117238970202,
        latitude: 31.059299916218038
      },

      {
        longitude: 121.00083038384737,
        latitude: 31.059202915039123
      },

      {
        longitude: 121.00053036869083,
        latitude: 31.05893991092281
      },

      {
        longitude: 120.99697210975295,
        latitude: 31.054322814381482
      },

      {
        longitude: 120.9992400670,
        longitude: 12431.05363882527896
      },

      {
        longitude: 121.00376301850149,
        latitude: 31.052671798109373
      },

      {
        longitude: 121.00334993837986,
        latitude: 31.05129178096521
      },

      {
        longitude: 121.00334593859552,
        latitude: 31.05129578106428
      },

      {
        longitude: 121.00364684925526,
        latitude: 31.049713753659994
      },
      {
        longitude: 121.00347982904155,
        latitude: 31.04936975002983
      },
      {
        longitude: 121.00453583587816,
        latitude: 31.04941973846003
      }

],
      color: "#FF3333",
      width: 2,
      dottedLine:true
    }],
    markers: ''
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
   // Storage.remove('supplyPoint');
    console.log("地图渲染")
    var _this = this;
    _this.mapCtx = wx.createMapContext('myMap');
    var markers = [];
   // 缓存中有数据,且不是开始活动后第一次进入地图，可以读缓存数据
    var storageSupplyPoint = Storage.get("supplyPoint");
    console.log('读取lastSupplyUpdate');
    console.log(Storage.get("lastSupplyUpdate"));
    if (storageSupplyPoint && !Storage.get("lastSupplyUpdate")){
      console.log("地图渲染(缓存)")
      markers = storageSupplyPoint;
      _this.setData({
        markers: markers
      })
    }else{
      console.log("地图渲染(数据库)")
      if (Storage.get("lastSupplyUpdate")){
        console.log("开始后第一次进入，重新读取数据")
        //活动开始轮询方法中设置参数lastSupplyUpdate，由此参数中断
        Storage.set("supplyUpdateFlag", true);
        //开始活动后第一次进入地图表示位重置
        Storage.set("lastSupplyUpdate", false);
      }
      wx.request({
        url: Config.appurl + '/SupplyPoint/getAllSupplyPoint',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var data = res.data;
          for (var i = 0; i < data.length; i++) {
            var record = data[i];
            var recordName = record.name;
            if(recordName=='补给点1'){
                var iconPath = "../../../imag/supplypoint1.png";
            } else if (recordName == '补给点2'){
                var  iconPath = "../../../imag/supplypoint2.png";
            } else if (recordName == '补给点3'){
                var iconPath = "../../../imag/supplypoint3.png";
            } else if (recordName == '补给点4'){
               var  iconPath = "../../../imag/supplypoint4.png";
            }
            var marker = {
              id: record.id,
              longitude: record.txLongitude,
              latitude: record.txLatitude,
              width: 30,
              height: 30,
              iconPath: iconPath,
              title: record.name
            }
            markers.push(marker);
          }
          var start = {
            id: '12340001',
            longitude: '121.006358',
            latitude: '31.049377',
            width: 40,
            height: 40,
            iconPath: '../../../imag/startpoint.png',
            title: '起点'
          };
          markers.push(start);
          var end = {
            id: '12340002',
            longitude: '121.004534',
            latitude: '31.049331',
            width: 40,
            height: 40,
            iconPath: '../../../imag/endpoint.png',
            title: '终点'
          };
          markers.push(end);
          //放入全局变量
          Storage.set("supplyPoint", markers);
          console.log("set storageSupplyPoint 并取出来");
          console.log(Storage.get("supplyPoint"));
          _this.setData({
            markers: markers
          })
        }
      })
    }
    


    // var iconPath = "../../../imag/supplypoint.png";
    // var markers = [{
    //         id: '1234001',
    //         longitude: '121.001573',
    //         latitude: '31.063761',
    //         width: 30,
    //         height: 30,
    //         iconPath: iconPath,
    //         title: '补给点1'
    // }, {
    //   id: '1234002',
    //   longitude: '121.000693',
    //   latitude: '31.070139',
    //   width: 30,
    //   height: 30,
    //   iconPath: iconPath,
    //   title: '补给点2'
    //   },{
    //     id: '1234003',
    //     longitude: '120.989428',
    //     latitude: '31.065305',
    //     width: 30,
    //     height: 30,
    //     iconPath: iconPath,
    //     title: '补给点3'
    // },{
    //   id: '1234004',
    //   longitude: '120.997624',
    //   latitude: '31.059625',
    //   width: 30,
    //   height: 30,
    //   iconPath: iconPath,
    //   title: '补给点4'
    // }];
    // _this.setData({
    //   markers: markers
    // })


    
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

  }
})