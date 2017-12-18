//index.js
//获取应用实例
const app = getApp();
const Config = require("../../../config.js");
const Storage = require("../../../storage.js");
const util = require('../../../utils/util.js');

var setActivtyStatusCycleInter;

Page({
  data: {
    mySteps: 0, //当前步数
    initSteps: 0, //初始化步数
    durationTime: 0, //持续时间：当前时间 - 开始时间
    remainTime: 0, //剩余时间:结束时间-当前时间
    isGuest: false,
    countTime: 10,
    isShowCount: false,
    activityStatus: null
  },
  onUnload: function () {
    clearInterval(setActivtyStatusCycleInter);
  },
  onLoad: function () {
    var _this = this;
    this.setData({
      isGuest: Storage.get("isGuest")
    });
    //计时器
    this.setActivtyStatusCycle();
    if (app.globalData.userInfoTimer) {
      return;
    }
    app.globalData.userInfoTimer = true;

    //记录当前日期
    var currentDate = util.toDate(new Date().getTime() / 1000);
    let lastDate = Storage.get("currentDate");
    if (currentDate != lastDate) {
      Storage.remove("initSteps");
      Storage.remove("userSteps");
    }
    Storage.set("currentDate", currentDate);

    if (Storage.get("platform") == 'ios') {
      let userSteps = Storage.get("userSteps")
      let initSteps = Storage.get("initSteps")
      if (userSteps < initSteps) {
        Storage.set("userSteps", initSteps)
      }
      app.syncDistanceCycle();
    }

    //定时获取活动状态
    app.acquireActiveStatusCycle(function (res) {
      //活动确定，并开始
      console.log('获取活动状态完成:', res)
      Storage.set("startFlag", res.data.start);
      var beginTime = res.data.beginTime
      var endTime = res.data.endTime
      Storage.set("beginTime", beginTime);
      Storage.set("endTime", endTime);
      var now = new Date().getTime()
      console.log('开始时间:', new Date(beginTime))
      console.log('结束时间:', new Date(endTime))
      console.log('距离结束时间:', endTime - now)
      if (res.data && res.data.start == 1) {
        //未开始，清除初始化步数
        Storage.remove("initSteps");
        Storage.remove("userSteps");
      }
      //活动开始(活动进行中同步数据)
      if (res.data && res.data.start == 2) {
        
        //判断设置参数标识位是否存在
        if (!Storage.get("supplyUpdateFlag")) {
          //设置是否为开始活动后第一次进入地图
          Storage.set("lastSupplyUpdate", true);
        }
        let initSteps = Storage.get("initSteps");
        if (initSteps != "" && initSteps > 0) {
          //已经初始化，开始步数获取
          // if (app.globalData.syncTimer) {
          //   return;
          // }
          // app.globalData.syncTimer = true;
          // app.syncWalkingCycle();
          app.syncWalking()
        } else {
          //进行初始化后，进行步数获取
          // app.syncBeforeWalk(true, function(){
          //   if (app.globalData.syncTimer) {
          //     return;
          //   }
          //   app.globalData.syncTimer = true;
          //   app.syncWalkingCycle();
          // });
         
          app.syncBeforeWalk(true, function () {
            app.syncWalking()
          });
        }

      }
    });

  },
  onShow: function () {
    if (Storage.get("platform") != 'ios') {
      this.checkRunAuthAndForceAuth(function () {
        console.log("设置运动权限成功")
      });
     
    }
    this.checkLocationAuthAndForceAuth(function () {
      console.log("设置位置权限成功")
    });
    


  },
  backTo: function () {
    wx.navigateTo({
      url: '../guestInfo/guestInfo'
    })
  },

  //------------------万恶分割线---------------------
  //根据条件设置不同的状态为
  setActivtyStatus: function () {
    //console.log("获取计时状态");
    var currentTime = new Date().getTime()
    var startFlag = Storage.get("startFlag");
    var endTime = Storage.get("endTime");
    var beginTime = Storage.get("beginTime");
    var initSteps = Storage.get("initSteps") || 0;
    var userSteps = Storage.get("userSteps") || 0;
    var mySteps = userSteps - initSteps;
    if (mySteps < 0) {
      mySteps = 0;
    }
    if (currentTime < beginTime) {
      var countDownTime = beginTime - currentTime;
      //活动倒计时
      this.setData({
        activityStatus: 0,
        countTime: util.timeFormat(countDownTime)
      })
      return
    } else {
      if (startFlag && startFlag == 1) {
        //即将开始
        this.setData({
          activityStatus: 1
        })
      } else if (startFlag && startFlag == 3) {
        //活动结束
        this.setData({
          activityStatus: 3,
          mySteps: mySteps
        })
      } else if (startFlag && startFlag == 2) {
        //已经开始
        //同步位置
        app.syncLocation()
        //修改持续时间
        var durationTime = currentTime - beginTime
        //console.log("setActivtyStatus:" + userSteps, initSteps, mySteps);
        this.setData({
          activityStatus: 2,
          durationTime: util.formatDuring(durationTime),
          mySteps: mySteps
        })
      }
    }

  },
  setActivtyStatusCycle: function () {
    var _this = this
    clearInterval(setActivtyStatusCycleInter)
    this.setActivtyStatus()
    setActivtyStatusCycleInter = setInterval(function () {
      if (_this.data.activityStatus && _this.data.activityStatus == 3) {
        //活动结束，结束循环
        clearInterval(setActivtyStatusCycleInter)
        return
      }
      _this.setActivtyStatus()
    }, Config.checkActiveStatusCycleTime);
  },
  //判断是否有读取用户步数的权限 content: '美女or帅哥请授权您的微信运动步数，让我们一起happy~~',
  checkRunAuthAndForceAuth: function (callback) {
    wx.getWeRunData({
      success: function () {
        callback && callback()
      },
      fail: function () {
        console.log('获取步数失败')
        wx.getSetting({
          success: function success(res) {
            if (!res.authSetting['scope.werun']) {
              wx.showModal({
                title: '用户未授权',
                content: '请授权您的微信运动步数',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function success(res) {
                        //获取授权面板
                      }
                    });
                  }
                }
              })
            }
          }
        });


      }
    })
  },
   //判断是否读取地理位置信息
  checkLocationAuthAndForceAuth:function(callback){
      //scope.userLocation
    wx.getLocation({
      success: function () {
        callback && callback()
      },
      fail: function () {
        wx.getSetting({
          success: function success(res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.showModal({
                title: '用户未授权',
                content: '请授权您的位置',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function success(res) {
                        //获取授权面板
                      }
                    });
                  }
                }
              })
            }
          }
        });


      }
    })
  }
  


})