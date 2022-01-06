// pages/home/home.js
const util = require('../../utils/util.js')
const req = util.request
const app = getApp()
let pageIndex = 1
const pageSize = 10000
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isProject:true,
    currentProject:'',
    appId:'',
    isAdd:true,
    inputValue:'',
    maxHeight:0,
    deviceList:[
      // {
      //   name:123,
      //   sn:'sdjskdsdld222',
      //   status:1,
      //   type:'LB02',
      //   version:'1.0.1',
      //   newVersion:false,
      // },
      // {
      //   name:151,
      //   sn:'sdjskdsdl4222',
      //   status:2,
      //   type:'LB02',
      //   version:'1.0.1',
      //   newVersion:true,
      // },
      // {
      //   name:321,
      //   sn:'sdjekdsdld222',
      //   status:0,
      //   type:'LB02',
      //   version:'1.0.1',
      //   newVersion:false,
      // }
    ]
  },

  


  inputBind(e){
      console.log(e)
      this.setData({
        inputValue:e.detail.value
      })
  },

  query(){
    this.getdeviceList();
  },

  //参数设置
  parameterSet(e){
    let deviceId = e.currentTarget.dataset.deviceid;
    let online = e.currentTarget.dataset.online;
    this.getConfigDevice(deviceId)
    // wx.navigateTo({
    //   url: '../parameterSet/parameterSet?deviceId='+deviceId,
    // })  
    // if(online){
    //   wx.navigateTo({
    //     url: '../parameterSet/parameterSet?deviceId='+deviceId,
    //   })   
    // }else{
    //   wx.showToast({
    //     title:'设备离线',
    //     icon:'none',
    //     duration:2000
    //   })
    // }
    
  },

  getConfigDevice(deviceId){
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    req("post","device/getConfig/"+deviceId,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        // console.log(res.data.data.data)
        if(undefined != res.data.data.data && 0 < res.data.data.data.length){
          app.globalData.deviceConfigInfo = res.data.data.data;
          wx.navigateTo({
            url: '../parameterSet/parameterSet?deviceId='+deviceId,
          }) 
          // that.setData({
          //   list:res.data.data.data
          // })
        }else{
          wx.showToast({
            title: res.data.data.desc,
            icon: 'none',
            duration: 2000
          })
        }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.reLaunch({
            url: '../login/login'
          })
        },2000)
      }
    });
  },

  //切换项目
  projectChange(){
    wx.navigateTo({
      url: '../deviceList/deviceList',
    })
  },

  addDevice(){
    let status = this.data.isAdd;
    if(status){
      this.setData({
        isAdd:false
      })
    }else{
      this.setData({
        isAdd:true
      })
    }
  },

  about(){
    this.setData({
      isAdd:true
    })
  },

  //手动添加
  addManually(e){
    wx.navigateTo({
      url: `../addDevice/addDevice?mode=${e.currentTarget.dataset.mode}&appName=${this.data.currentProject}&appId=${this.data.appId}`,
    })
  },

  //扫码添加
  scan(e){
    const that = this;
    wx.scanCode({
      scanType:['barCode', 'qrCode'],
      success (res) {
        if(res.result){
          if(-1 != res.result.indexOf("https://qy-vds.com:7015")){
            let url = res.result;
            let sn = that.getUrlParams(url,'sn');
            if(sn && '' != sn){
              if('33cf3e714305c156' == sn){
                sn = '';
              }
               wx.navigateTo({
                url: `../addDevice/addDevice?mode=${e.currentTarget.dataset.mode}&appName=${that.data.currentProject}&appId=${that.data.appId}&serial=${sn}`,
              })
            }else{
              wx.showToast({
                title: '二维码无效(未检测出SN号)',
                icon: 'none',
                duration: 2000
              })
            }   
          }else{
            if(16 == res.result.length){
              wx.navigateTo({
                url: `../addDevice/addDevice?mode=${e.currentTarget.dataset.mode}&appName=${that.data.currentProject}&appId=${that.data.appId}&serial=${res.result}`,
              })
            }else{
              wx.showToast({
                title: '未获取到正确的条形码数据,请重新扫码',
                icon: 'none',
                duration: 2000
              })
            }
          }
        }
        if(res.result){
                 
        }
      },
      fail(err){
        wx.showToast({
          title: '未检测到二维码',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //二维码参数
  getUrlParams(url,paras) {
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    let i,j;
    for ( i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("="))] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
  },

  //设备升级
  upgrade(e){
    let deviceId = e.currentTarget.dataset.deviceid;
    let online = e.currentTarget.dataset.online;
    if(online){
      wx.navigateTo({
        url: '../firmwareUpdate/firmwareUpdate?appId='+this.data.appId + "&deviceId=" + deviceId,
      })
    }else{
      wx.showToast({
        title:"设备离线",
        icon:'none',
        duration:2000
      })
    }
    
  },

  //设备编辑
  edit(e){
    console.log(e);
    if(null != e.currentTarget.dataset.config && '' != e.currentTarget.dataset.config){
      app.globalData.setBerth = JSON.parse(e.currentTarget.dataset.config);
    }else{
      app.globalData.setBerth = null;
    }
    wx.navigateTo({
      url: `../addDevice/addDevice?mode=${e.currentTarget.dataset.mode}&appName=${this.data.currentProject}&appId=${this.data.appId}&serial=${e.currentTarget.dataset.serial}&deviceId=${e.currentTarget.dataset.deviceid}&deviceName=${e.currentTarget.dataset.devicename}&type=${e.currentTarget.dataset.type}&latitude=${e.currentTarget.dataset.latitude}&longitude=${e.currentTarget.dataset.longitude}`,
    })
  },

  //获取项目列表
  getProjectList(){
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    req("post","user/app/query",{
      name:'',
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
         if(0 < res.data.data.length){
          res.data.data.forEach(e => {
              if(e.isChoice){
                 that.setData({
                  isProject:true,
                  currentProject:e.appName,
                  appId:e.appId,
                  appSecret:e.appSecret
                 })
                 wx.setStorageSync('appId',e.appId);
                 wx.setStorageSync('appSecret',e.appSecret);
                 that.getdeviceList();
              }
          });
         }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  //识别区域
  discriminate(e){
    let appId = wx.getStorageSync('appId');
    let appSecret = wx.getStorageSync('appSecret');
    let deviceSn = e.currentTarget.dataset.info.serial;
    let online = e.currentTarget.dataset.info.online;
    if(online){
      wx.navigateTo({
        url: '../discriminate/discriminate?appId='+appId + "&appSecret=" + appSecret + "&deviceSn=" + deviceSn,
      })
    }else{
      wx.showToast({
        title: '设备离线',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //实时视频
  video(e){
    let appId = wx.getStorageSync('appId');
    let appSecret = wx.getStorageSync('appSecret');
    let deviceSn = e.currentTarget.dataset.info.serial;
    let online = e.currentTarget.dataset.info.online;
    if(online){
      wx.navigateTo({
        url: '../video/video?appId='+appId + "&appSecret=" + appSecret + "&deviceSn=" + deviceSn,
      })   
    }else{
      wx.showToast({
        title:'设备离线',
        icon:'none',
        duration: 2000
      })
    }
  },

  //获取项目对应的设备
  getdeviceList(){
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    req("post","device/pageDevice",{
      appId:that.data.appId,
      name:that.data.inputValue,
      pageIndex: pageIndex,
      pageSize: pageSize
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
          if(0 < res.data.data.records.length){
            that.setData({
              deviceList:res.data.data.records
            })
          }else{
            that.setData({
              deviceList:[]
            })
          }
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // cameraHeight部分高度 = 利用窗口可使用高度 - 固定高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          maxHeight: res.windowHeight - res.windowWidth / 750 * 170
        })
      }
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3C6DF6',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getProjectList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isAdd:true
    })
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