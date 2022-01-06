// pages/discriminate/discriminate.js
const util = require('../../utils/util.js')
const req = util.request
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appId:'',
    appSecret:'',
    deviceSn:'' ,
    url:'',
    ios:true
  },

  getInfo(){
    const that = this;
    req("post","api/thrid/device/identification",{
      appId:that.data.appId,
      appSecret:that.data.appSecret,
      deviceSn:that.data.deviceSn,
      ios:that.data.ios
    }).then(res=>{
      if(res.data.code && 200 == res.data.code){
        wx.hideLoading();
        // console.log('识别区域:',res.data.data);
        that.setData({
          src:res.data.data
        })
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
      success(res) {
        console.log(res.system);
        if(res.system && -1 != res.system.indexOf('iOS')){
          that.setData({
            ios:true
          })
        }else{
          that.setData({
            ios:false
          })
        }
      }
    })
     that.setData({
      appId:options.appId,
      appSecret:options.appSecret,
      deviceSn:options.deviceSn,
     })
     that.getInfo()
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