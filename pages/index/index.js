//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util.js");
const Config = require("../../config.js");
const Storage = require("../../storage.js");

Page({
  data: {
    loaded: false,
    isShowToast: false
  },
  onLoad: function () {
    console.log('======index onLoad=======')
    wx.showLoading({
      mask: true,
      title: '获取用户信息',
    })

    var _this = this;
    var checkLoginInterval = setInterval(function () {
      console.log("页面加载：" + getApp().globalData.loaded);
      //App加载完成，即用户信息获取成功
      if (app.globalData.loaded) {
        _this.setData({
          loaded: true
        });
        clearInterval(checkLoginInterval);
        //检查用户信息
        let isLogin = Storage.get("isLogin");
        if (isLogin) {
          //用户已经注册过
          wx.redirectTo({
           // url: '../ces/userInfo/userInfo'
          })
          wx.hideLoading();
        } else {
          //从后台获取用户信息
          wx.request({
            url: Config.appurl + '/user/checkSignIn',
            data: {
              openId: Storage.get("openId")
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if (res.statusCode != 200) {
                return;
              }
              //判断用户是否已签到
              //1：用户，0：嘉宾，-1：未签到
              if (res.data >= 0) {
                //表示该手机号已经注册过了，提示用户使用其他手机号
                console.log("该用户手机号已经注册过了，直接跳到签到页面");
                Storage.set("isLogin", true);
                Storage.set("isGuest", res.data === 0);
                wx.redirectTo({
                  url: './../ces/userInfo/userInfo'
                })
              }
              wx.hideLoading();
            }
          })
        }
      }
    }, Config.checkLoginUserCycleTime);

  },
  onShow: function () {
    //获取用户信息
    app.getUserInfo()
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  showToast: function () {
    var _this = this;
    _this.setData({
      isShowToast: true,
    });
    // 定时器关闭  
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, 2000);
  },  
  userPhoneInput: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  formSubmit(e) {
    var _this = this;
    var openId = Storage.get("openId");
    //console.log(app.globalData);
    if (openId) {
      this.doFormSubmit(e);
    }
    else {
      //再次授权
      wx.getSetting({
        success: function success(res) {
          console.log(res);
          if (!res.authSetting['scope.userInfo']) {
            wx.showModal({
              title: '用户未授权',
              content: '美女or帅哥请授权您的用户信息，让我们知道您来了~~',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(res) {
                      console.log('openSetting success', res.authSetting);
                      app.acquireUserInfo(function (res) {
                        //console.info(app.globalData);
                        _this.doFormSubmit(e);
                      });
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
  doFormSubmit: function (e) {
    var _this = this;
    //1.签到之前防止两个人同时用一个账号，目前是同一个姓名，手机号只能注册一次
    wx.request({
      url: Config.appurl + '/user/checkNameAndPhone',
      data: {
        userName: e.detail.value.name,
        phone: e.detail.value.mobile
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode != 200) {
          return;
        }
        //判断用户是否已签到
        //1：是，0：否
        if (res.data == 1) {
          //表示该手机号已经注册过了，提示用户使用其他手机号
          console.log("该用户手机号已经注册过了");
          _this.setData({
            toastText: "该用户已注册"
          })
          _this.showToast();
        } else if (res.data == 0) {
          //没有注册过
          //获取openId考虑没有获取到（可能会出现延迟加载）
          wx.request({
            url: Config.appurl + '/user/signIn',
            data: {
              userName: e.detail.value.name,
              phone: e.detail.value.mobile,
              openId: Storage.get("openId")
            },
            header: {
              'Content-Type': 'application/json; charset=UTF-8'
            },
            success: function (res) {
              if (res.statusCode != 200) {
                _this.setData({
                  toastText: "嘉宾注册失败"
                })
                _this.showToast();
                // wx.showToast({
                //   title: '嘉宾注册失败',
                //   icon: 'fail',
                //   duration: 1000
                // })
                return;
              }
              //res.data  1：成功， 2：用户名或手机不存在或不匹配
              if (res.data == 1) {
                //1.设置是否登录状态位以及是否嘉宾
                //2.跳转到首页面
                wx.setStorage({
                  key: 'isLogin',
                  data: true
                });
                app.globalData.isLogin = true;
                app.globalData.isGuest = false;
                wx.redirectTo({
                  //url: '../ces/userInfo/userInfo'
                })

              } else if (res.data == 2) {
                //  提示该用户名和手机不匹配
                console.log("用户名手机号不匹配");
                _this.setData({
                  toastText: "用户名手机号不匹配"
                })
                _this.showToast();
                // wx.showToast({
                //   title: '用户名手机号不匹配',
                //   image:'',
                //   duration: 1000
                // })
              }
            }
          })
        }
      }
    })
  },
  //检查登录并强制授权
  checkLoginAndForceLogin: function (loginCallback) {
    wx.getUserInfo({
      success: function () {
        loginCallback && loginCallback()
      },
      fail: function () {
        var _this = this;
        var openId = wx.getStorageSync("openId");
        if (!openId) {
          wx.getSetting({
            success: function success(res) {
              if (!res.authSetting['scope.userInfo']) {
                wx.hideLoading();
                wx.showModal({
                  title: '用户未授权',
                  content: '美女or帅哥请授权您的用户信息，让我们知道您来了~~',
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
      }
    })
  }
})
