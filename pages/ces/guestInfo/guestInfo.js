//index.js
//获取应用实例
const app = getApp()
const Config = require("../../../config.js");
const Storage = require("../../../storage.js");

Page({
  data: {
    index: 0,
    inputVal: '',
    isShowToast: false,
    color: '#989898',
    inputNum: '',
    condition: false,
    selectClass: '',
    items: [
      { value: '0', name: '第一队' },
      { value: '1', name: '第二队' },
      { value: '2', name: '第三队' }
    ],
    items1: [
      { value: '3', name: '第四队' },
      { value: '4', name: '第五队' },
      { value: '5', name: '第六队' },
    ]
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    app.globalData.guestRank = e.detail.value;
    var items = this.data.items;
    var items1 = this.data.items1;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }
    for (var i = 0, len = items1.length; i < len; ++i) {
      items1[i].checked = false
    }
    this.setData({
      items1: items1,
      items: items,
      selectClass: e.detail.value
    });
  },
  radioChange1: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var items1 = this.data.items1;
    var items = this.data.items;
    for (var i = 0, len = items1.length; i < len; ++i) {
      items1[i].checked = items1[i].value == e.detail.value;
    }

    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = false;
    }
    this.setData({
      items1: items1,
      items: items,
      selectClass: e.detail.value
    });
  },
  showToast: function (boolen) {
    var _this = this;
    _this.setData({
      isShowToast: boolen,
    });
    // 定时器关闭  
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, 2000);
  },
  onLoad: function (e) {
    this.setData({
      toastText: "我司员工请走员工入口"
    })
    this.showToast(!Storage.get("isGuest"));
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var team;
    var teamId = e.detail.value.radio;
    var teamId1 = e.detail.value.radio1;
    if (teamId != "") {
      team = teamId;
    } else if (teamId1 != "") {
      team = e.detail.value.radio1;
    } else {
      //没有选队伍直接返回，不提交给后台
      this.setData({
        toastText: "请选择您想参加的队伍"
      })
      this.showToast(true);
      // wx.showToast({
      //   title: '请选择您想参加的队伍',
      //   icon: 'fail',
      //   duration: 1000
      // })
      return;
    }
    //判断
    wx.request({
      url: Config.appurl + '/user/guestSignIn',
      data: {
        userName: "嘉宾",
        phone: "嘉宾",
        openId: Storage.get("openId"),
        teamId: team
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode != 200) {
          return;
        }
        console.log("嘉宾签到", res.data)
        //res.data  true: 成功 false:失败
        if (res.data == true) {
          //1.设置是否登录状态位以及是否嘉宾
          //2.跳转到首页面
          Storage.set("isLogin", true);
          Storage.set("isGuest", true);
          wx.reLaunch({
            url: '../userInfo/userInfo'
          })
        }
      }
    })
  }
})
