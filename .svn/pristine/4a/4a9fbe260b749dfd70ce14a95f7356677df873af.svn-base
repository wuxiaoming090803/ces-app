//app.js
//解密工具类
var sync = require("./utils/sync.js");
const util = require("./utils/util.js");
const Config = require("./config.js");
const Storage = require("./storage.js");

App({
  //全局数据
  globalData: {
    loaded: false,
    userSteps: 0,  //当前步数
    initSteps: 0,//初始化步数
    location: null,//位置信息
    isLogin: false, //登录状态
    beginTime: null,
    endTime: null,
    startFlag: false,//活动开始标识
    //页面定义器启动标记
    userInfoTimer: false,
    syncTimer: false,
    //用户经纬度，仅IOS使用
    userLatitude: '0',
    userLongitude: '0',
    userTimestamp: 0,
  },
  getUserInfoPage: function(){
    let currentPages = getCurrentPages();
    for (let i = currentPages.length - 1;i>=0;i--){
      if (currentPages[i].route == "pages/ces/userInfo/userInfo") {
        return currentPages[i];
      }
    }
    return null;
  },
  /**
   * 后台解密用户步数
   */
  decryptUserSteps: function (callback) {
    var _this = this
    wx.getWeRunData({
      success(res) {
        var encrytedData = res.encryptedData
        var iv = res.iv
        wx.request({
          url: Config.appurl + '/wx/gainSteps',
          data: {
            'encrytedData': encrytedData,
            'iv': iv,
            'sessionKey': Storage.get("sessionId")
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res1) {
            if (res1.statusCode != 200) {
              return;
            }
            console.log(res1)
            callback && callback(res1.data.stepInfoList)
          },
          fail() {
            console.log('远程获取失败')
            //console.log('----获取步数失败----------');
          }
        })
      }

    })
  },

  /**
   * 获取用户步数 new 
   */
  gainUserSteps: function (callback) {
    console.log('-------获取步数开始---------')
    var _this = this
    var sessionId = Storage.get("sessionId");
    if (sessionId) {
      this.decryptUserSteps(function (result) {
        if (result) {
          callback && callback(result)
        } else {
          wx.showToast({
            title: '会话丢失！',
            duration: 3000
          })
          //前台没有sessionId
          _this.acquireUserInfo(function () {
            getApp().globalData.indexTimer = false;
            getApp().globalData.userInfoTimer = false;
            //重回index页面
            wx.redirectTo({
              url: '../../index/index'
            })
          })
        }
      })
    } else {
      wx.showToast({
        title: '会话丢失！',
        duration: 3000
      })
      //前台没有sessionId
      this.acquireUserInfo(function () {
        getApp().globalData.indexTimer = false;
        getApp().globalData.userInfoTimer = false;
        //重回index页面
        wx.redirectTo({
          url: '../../index/index'
        })
      })
    }
  },
  /**
   * 获取位置信息 
   */
  gainUserLocation: function (callback) {
    wx.getLocation({
      success: function (res) {
        callback(res);
      },
    })
  },
  /**
   * 获取初始化步数
   * 缓存获取
   *  1、存在：返回，回调函数
   *  2.不存在：请求数据库获取，然后设置缓存，回调函数
   * 
   */
  gainUserInitSteps: function (callback) {
    console.log("------------获取初始化步数--------");
    var _this = this;
    wx.request({
      url: Config.appurl + "/sync/initData/" + Storage.get("openId"),
      success: function (res) {
        if (res.statusCode != 200) {
          return;
        }
        var result = res.data;
        console.log("缓存初始化数据");
        Storage.set('initSteps', result.initialUserSteps);
        callback && callback(result.initialUserSteps)
      }
    })
  },

  /**
   * 同步位置数据
   */
  syncLocation: function () {
    var _this = this;
    this.gainUserLocation(function (res) {
      let newLongitude = res.longitude;
      let newLatitude = res.latitude;
      let cacheLocation = Storage.get("location");
      if (!cacheLocation || cacheLocation == ""
        || newLongitude !== cacheLocation.longitude || newLatitude !== cacheLocation.latitude) {
        sync.syncLocation(res);
        Storage.set("location", res);
      }
    })
  },

  /**
   * 活动开始前同步:同步初始化步数，并处理存储初始化步数
   */
  syncBeforeWalk: function (forceUpdate, callback) {
    console.log("------初始化步数同步------")
    var _this = this;
    if (Storage.get("platform") == 'ios') {
      //初始化同步
      Storage.set("initSteps", 1); 
      sync.syncInit(1).then(function (value) {
        //因为先同步初始化后，可能再提交同步当前步数
        callback && callback(value)
      });
      return;
    }

    this.gainUserSteps(function (stepInfoList) {
      console.log("获取步数回调：", stepInfoList);
      if (!stepInfoList || stepInfoList.length == 0) {
        return;
      }
      var index = stepInfoList.length - 1;
      //当前步数
      var currentStep = stepInfoList[index].step;
      //强制更新
      if (forceUpdate) {
        Storage.set("initSteps", currentStep);
        sync.syncInit(currentStep).then(function (value) {
          //因为先同步初始化后，可能再提交同步当前步数
          callback && callback(value)
        });
        return;
      }
      _this.gainUserInitSteps(function (dbInitSteps) {
        var now = new Date().getTime();
        var beginTime = _this.globalData.beginTime;
        var cacheInitSteps = Storage.get('initSteps');
        if (null == dbInitSteps) {
          //数据库不存在，同步初始化步数和设置混次
          sync.syncInit(currentStep).then(function (value) {
            //因为先同步初始化后，可能再提交同步当前步数
            callback && callback(value)
          });
          Storage.set("initSteps", currentStep);
          return
        }
        if (now <= beginTime) {
          //未开始，设置当前的步数
          Storage.set("initSteps", currentStep);
          if (currentStep !== dbInitSteps) {
            //初始化同步
            sync.syncInit(currentStep).then(function (value) {
              callback && callback(value)
            });
          }
        } else {
          //已经开始
          Storage.set("initSteps", dbInitSteps);
          callback && callback()
        }
      })
    });
  },
  //------------------邪恶的分隔符----------------------
  /**
   * 获取当前活动的状态
   */
  acquireActiveStatus: function () {
    var _this = this
    return new Promise(function (resolve, reject) {
      wx.request({
        url: Config.appurl + "/wx/runStatus",
        success: function (res) {
          if(res.statusCode != 200) {
            reject(res)
            return;
          }
          resolve(res)
        },
        fail: function (res) {
          reject(res)
          console.log("获取当前活动状态失败：" + res.statusCode)
        }
      })
    })
  },
  /**
   * 循环获取当前活动的状态
   */
  acquireActiveStatusCycle: function (callback) {
    var _this = this;
    console.log('循环获取当前活动状态:', new Date())
    _this.acquireActiveStatus().then(function (res) {
      callback && callback(res);
      //循环结束条件
      // if (res.data && res.data.start) {
      //   return;
      // }
      //活动结束作为结束循环的标识
      if (res.data && res.data.start == 3) {
        return;
      }
      setTimeout(function () {
        _this.acquireActiveStatusCycle(callback);
      }, Config.beforeWalkCycleTime);
    }).catch(function (res) {
      setTimeout(function () {
        _this.acquireActiveStatusCycle(callback);
      }, Config.beforeWalkCycleTime);
    });
  },
  syncDistanceCycle: function () {
    var _this = this;
    setTimeout(function () {
      _this.syncDistance(function (currentStep) {
        let userInfoPage = _this.getUserInfoPage();
        if (userInfoPage != null) {
          let userSteps = Storage.get("userSteps")
          let initSteps = Storage.get("initSteps")
          let mySteps = userSteps > initSteps ? userSteps - initSteps : 0;
          //console.log("syncDistanceCycle:"+userSteps, initSteps, mySteps);
          userInfoPage.setData({
            mySteps: mySteps
          });
        }
        _this.syncDistanceCycle();
      });
    }, Config.distanceCycleTime);
  },
  /**
   * 
   */
  syncDistance: function (callback) {
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let currentTime = new Date().getTime();
        console.log('纬度:' + res.latitude + '，经度:' + res.longitude)
        if (_this.globalData.userTimestamp == '0') {//第一次获取
          _this.globalData.userLatitude = res.latitude
          _this.globalData.userLongitude = res.longitude
          _this.globalData.userTimestamp = currentTime
          callback && callback();
        } else {//第N次获取
          let distance = util.getDistance(_this.globalData.userLatitude, _this.globalData.userLongitude, res.latitude, res.longitude)
          let time = currentTime - _this.globalData.userTimestamp;
          let speed = distance / time * 1000.0;//秒速
          console.log('距离：' + distance + '米，时间差：' + time);
          _this.globalData.userLatitude = res.latitude
          _this.globalData.userLongitude = res.longitude
          _this.globalData.userTimestamp = currentTime
          //筛选正常的移动速度
          if (speed > 0.4 && speed < 8) {
            var steps1 = parseInt(Math.round(distance / 0.65));
            let userSteps1 = !Storage.get("userSteps") ? 0 : parseInt(Storage.get("userSteps"));
            console.log("syncDistance:" + userSteps1, steps1);
            let currentStep1 = userSteps1 + steps1;
            Storage.set("userSteps", currentStep1);
            callback && callback(currentStep1);
            return;
          }
          callback && callback();
        }
        
      },
      fail: function(){
        callback && callback();
      }
    })
  },

  /**
   * 活动开始同步
   */
  syncWalking: function () {
    console.log('活动中同步')
    var _this = this;
    if (Storage.get("platform") == 'ios') {
      //初始化同步
      let currentStep = Storage.get("userSteps")
      let initSteps = Storage.get("initSteps")
      let stepsRange = currentStep - initSteps
      sync.syncUserSteps(initSteps, currentStep, stepsRange);
    } else {
      this.gainUserSteps(function (stepInfoList) {
        if (!stepInfoList || stepInfoList.length == 0) {
          return;
        }
        var index = stepInfoList.length - 1;
        //当前步数
        var currentStep = stepInfoList[index].step;
        //上次步数
        var latestSteps = Storage.get("userSteps");
        if (currentStep !== latestSteps) {
          Storage.set("userSteps", currentStep);
          //初始化同步
          let initSteps = wx.getStorageSync("initSteps")
          let stepsRange = currentStep - initSteps
          sync.syncUserSteps(initSteps, currentStep, stepsRange);
        }
      });
    }
  },

  syncWalkingCycle: function () {
    var _this = this
    this.syncWalking();
    this.syncLocation();
    //未到结束时间
    let endTime = Storage.get("endTime");
    if (endTime == "" || endTime == 0 || new Date().getTime() < endTime) {
      setTimeout(this.syncWalkingCycle, Config.cycleTime);
    }
  },

  /**
   * 获取用户信息
   * 1.先登录
   * 2.获取用户信息
   * 3.获取openId
   * 4.回调函数
   */
  acquireUserInfo: function (callback) {
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code;
          //清除sessionid
          Storage.remove("sessionId");
          //获取用户的信息
          wx.getUserInfo({
            withCredentials: true,
            lang: 'zh_CN ',
            success: function (res) {
              console.log("------获取UserInfo成功-------")
              //设置全局信息
              Storage.set("userInfo", res.userInfo);
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              wx.request({
                url: Config.appurl + '/wx/userInfo',
                data: {
                  code: code
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'GET',
                success: function (res1) {
                  if (res1.statusCode != 200) {
                    return;
                  }
                  let sessionId = res1.data.sessionId
                  Storage.set("sessionId", sessionId)
                  let openId = res1.data.openId
                  //用户ID不同，清除缓存
                  if (openId != Storage.get("openId")) {
                    Storage.set("openId", openId)
                    Storage.remove("isLogin");
                    Storage.remove("isGuest");
                  }
                  callback && callback(res1);
                },
                fail() {
                  console.log('----获取用户openID失败----------');
                }
              })
            },
            fail: function (res) {
              console.log("获取用户信息失败：" + res.errMsg)
              _this.gainOpenId()
            },
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);

        }
      }
    });
  },

  /**
   * 1.授权并获取用户信息及openid
   * 2.判断用户合法性
   * 2.判断活动合法性
   */
  onLaunch: function () {
    var _this = this;
    console.log("-----------app onLaunch-----------");
    console.log('------开始获取用用户的openId----------');
    let res = wx.getSystemInfoSync()
    let platform = res.platform
    //platform = 'ios';
    Storage.set('platform',platform)
    console.log('当前设备：',platform)
    //获取用户信息
    // this.getUserInfo();
  },
  /**
   * 获取用户信息并登录
   */
  getUserInfo: function () {
    var _this = this;
    wx.checkSession({
      success: function (res) {
        //session 未过期，并且在本生命周期一直有效
        console.log("session未过期");
        let openId = Storage.get("openId")
        if (!openId) {
          _this.acquireUserInfo(function () {
            _this.globalData.loaded = true;
          });
        } else {
          _this.globalData.loaded = true;
        }

      },
      fail: function () {
        //登录态过期
        console.log("已经过期");
        //重新登录
        _this.acquireUserInfo(function () {
          _this.globalData.loaded = true;
        });
      }
    })
  },

  /**
   * 获取用户的openId,包括强制授权
   */
  //暂时不用
  gainOpenId: function (userInfoReadyCallback) {
    var _this = this;
    var openId = Storage.get("openId");
    if (!openId) {
      wx.getSetting({
        success: function success(res) {
          if (!res.authSetting['scope.userInfo']) {
            wx.hideLoading();
            wx.showModal({
              title: '用户未授权',
              content: '请授权您的用户信息',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function success(res) {
                      // _this.acquireUserInfo(function (res) {
                      //   userInfoReadyCallback()
                      // });
                    }
                  });
                }
              }
            })
          }
        }
      });
    }
  },
  onShow: function () {

  },

})