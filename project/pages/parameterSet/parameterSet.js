// pages/parameterSet/parameterSet.js
const dataJson = require('../../utils/parameter/parameter.js');
console.log("参数数据:",dataJson.json);
let json = dataJson.json;
const util = require('../../utils/util.js')
const req = util.request
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId:'',
    list:[],
    // list:json.data,
  },

  //二级设置
  secondLevelSet(e){
    let index = e.currentTarget.dataset.index;
    console.log(this.data.list[index]);
    app.globalData.secondParmeterSet = this.data.list[index];
    wx.navigateTo({
      url: '../secondParmeterSet/secondParmeterSet?deviceId='+this.data.deviceId,
    })
  },

  getDeviceParameterSet(){
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    req("post","device/config/get/"+that.data.deviceId,{}).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        console.log(res.data.data.data)
        if(undefined != res.data.data.data && 0 < res.data.data.data.length){
          that.setData({
            list:res.data.data.data
          })
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

  refresh(){
    this.getDeviceParameterSet();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       deviceId:options.deviceId,
       list:app.globalData.deviceConfigInfo
     })
    //  this.getDeviceParameterSet();
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