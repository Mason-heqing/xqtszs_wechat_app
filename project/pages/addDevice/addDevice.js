// pages/addDevice/addDevice.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const req = util.request
const requestId = util.requestId
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceNameContent:false,
    deviceSNContent:false,
    isBerth:false,
    appName:'',
    appId:'',
    deviceId:'',
    mode:'',
    deviceName:'',
    deviceSN:'',
    latitude:'',//经度
    longitude:'',//纬度
    berthJson:null,
    list:[
      // {
      //   name:'1004',
      //   status:false,
      // },
      // {
      //   name:'1005',
      //   status:false,
      // },
      // {
      //   name:'1006',
      //   status:true,
      // }
    ]
  },

  trimDeviceName(e){
    if('' != e.detail.value){
       this.setData({
        deviceNameContent:true,
       })
    }else{
      this.setData({
        deviceNameContent:false,
      })
    }
    this.setData({
      deviceName:e.detail.value
    })
  },

  trimDeviceSN(e){
    console.log(e);
    if('' != e.detail.value){
      this.setData({
        deviceSNContent:true,
      })
    }else{
      this.setData({
        deviceSNContent:false,
      })
    }
    this.setData({
      deviceSN:e.detail.value
    })
  },

  trimBerth(e){
    console.log(e)
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    this.setData({
      [`list[${index}].parkSpaceCode`]:value
    })
  },

  getLocation(){
    const that = this;
    console.log('获取经纬度:');
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
       console.log(res);
       that.setData({
        latitude:res.latitude.toFixed(6),
        longitude:res.longitude.toFixed(6)
       })
      }
    })
  },

  getBerth(){
    const that = this;
    wx.showLoading({
      title: '请等待',
    })
    req("post","device/config/get/"+that.data.deviceId,{}).then(res=>{
      wx.hideLoading();
      console.log(res.data.code)
      if(res.data.code && 200 == res.data.code){
         let data = res.data.data.data;
         if(data && data.length>0){
           that.analysisData(data);
         }else{
          wx.showToast({
            title: res.data.data.desc,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            list:[]
          })
         }
      }else{
        wx.showToast({
          title: res.data.data.desc,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  analysisData(arr){
    const that = this;
    arr.forEach((item,index)=>{
      if(index==0){
         item.groups.forEach((item1,index1)=>{
            if('region' == item1.groupKey){
              console.log("region",item1);
               that.setData({
                 list:item1.item[0].value,
                 berthJson:item1
               })
            }
         })
      }
    })
  },

  checkboxChange(e){
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value.length>0?1:0;
    if('a' == type){
      this.setData({
        [`list[${index}].isEnable`]:parseInt(value)||0
      })
    }else{
      this.setData({
        [`list[${index}].isSpecialPark`]:parseInt(value)||0
      })
    }
  },

  //删除
  delete(){
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗?',
      success (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.showLoading({
            title: '删除中',
          })
          req("post","device/delete/"+that.data.deviceId,{}).then(res=>{
            wx.hideLoading();
            if(res.data.code && 200 == res.data.code){
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1
                })
              },2000)
            }else{
              wx.showToast({
                title: res.data.data.desc,
                icon: 'none',
                duration: 2000
              })
            }
          });
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  save(){
    if(null != this.data.berthJson){
      this.setData({
        [`berthJson.item[0].value`]:this.data.list
      })
    }
    wx.showLoading({
      title: '保存中',
    })
    req("post","device/save",{
      appId:this.data.appId,
      berthJson:this.data.berthJson,
      deviceId: this.data.deviceId,
      deviceName:this.data.deviceName,
      deviceSN:this.data.deviceSN,
      latitude: this.data.latitude,
      longitude: this.data.longitude
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },2000)
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
     console.log(options)
     if(undefined == options.serial || '' == options.serial){
        this.setData({
           deviceSNContent:false,
        })
     }else{
       this.setData({
        deviceSNContent:true,
       })
     }
     if(undefined == options.deviceName || '' == options.deviceName){
        this.setData({
          deviceNameContent:true,
        })
     }else{
       this.setData({
        deviceNameContent:false,
       })
     }
     if(undefined != options.type){
        if('2' == options.type || '3' == options.type){
          this.setData({
            isBerth:true,
           })
           if(null != app.globalData.setBerth && 0 < app.globalData.setBerth.data.length){
            this.analysisData(app.globalData.setBerth.data);
           }
        }else{
          this.setData({
            isBerth:false,
           })
        }
     }else{
      this.setData({
        isBerth:false,
       })
     }
     this.setData({
       appName:options.appName,
       appId:options.appId,
       deviceId:options.deviceId||'',
       mode:options.mode,
       deviceSN:options.serial || '',
       deviceName:options.deviceName||'',
       latitude:options.latitude||'',
       longitude:options.longitude||''
     })
     if('' == options.serial && '2' == options.mode){
      this.setData({
        mode:'1'
      })
      
   }
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