//同步工具类 @wxl
/**
 * 初始化同步
 */
const util = require("util.js");
const Config = require("../config.js");
const Storage = require("../storage.js");
const app = getApp()


const syncInit = (initUserSteps) =>{
  console.log("--开始初始化同步--");
  return new Promise((resolve, reject) => {
    var openId = Storage.get("openId");
    wx.request({
      url: Config.appurl + "/sync/init",
      data: {
        'openId': openId,
        'initialUserSteps': initUserSteps
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.statusCode != 200) {
          return;
        }
        resolve(res);
        console.log("--初始化同步完成--")
      }
    })
  });
 

}
/**
 * 同步步数
 */
const syncUserSteps = (beginSteps,endSteps,stepsRange) =>{
  console.log("---开始同步步数----");
  var openId = Storage.get("openId");
  wx.request({
    url: Config.appurl + "/sync/userSteps",
    data: {
      'openId': openId,
      'beginSteps': beginSteps,
      'endSteps':endSteps,
      'stepsRange': stepsRange

    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("--同步步数完成--")
    }
  })
}
/**
 * 同步位置
 */
const syncLocation = (location)=>{
  console.log("同步位置");
  var longitude = location.longitude;
  var latitude = location.latitude;
  var openId = Storage.get("openId");
  wx.request({
    url: Config.appurl + "/sync/location",
    data: {
      'openId': openId,
      'longitude': longitude,
      'latitude': latitude
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("--同步位置完成--")
    }
  })
 
}
/**
 * 同步活动时间信息
 */
const syscWalkTime = (callback)=>{
  wx.request({
    url: Config.appurl + "/sync/time",
    success: function (res) {
      if (res.statusCode != 200) {
        return;
      }
      var data = res.data;
      var currentTime = data.currentTime;
      var beginTime = data.beginTime;
      var endTime = data.endTime;
      console.log(new Date(currentTime));
      //   'currentTime': new Date(currentTime).getSeconds(), 
      //   'beginTime': new Date(beginTime).getSeconds(),
      //   'endTime': new Date(endTime).getSeconds()
      // };
      console.log(new Date(currentTime).getSeconds());
    //  console.log(times);
      callback && callback(res.data);
    }
  })

   
}
//--------------分割线------------------
//同步步数
const syncSteps = (steps) => {
  var openId = Storage.get("openId");
  wx.request({
    url: Config.appurl + "/sync/steps",
    data: {
      'openId': openId,
      'userSteps': steps
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("--同步步数完成--")
    }
  })
}
/**
 * 模块化暴露接口
 */
module.exports = {
  syncUserSteps: syncUserSteps,
  syncLocation: syncLocation,
  syncWalkTime: syscWalkTime,
  syncInit: syncInit,
  syncSteps:syncSteps
}


