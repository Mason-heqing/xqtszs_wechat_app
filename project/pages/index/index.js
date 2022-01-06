// index.js
// 获取应用实例
const util = require('../../utils/util.js')
const req = util.request
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  isToken(){
    let token = wx.getStorageSync('token');
    if(token && '' != token){
      req("post","user/expiredToken",{}).then(res=>{
        if(res.data.code && 200 == res.data.code){
          wx.switchTab({
            url: '/pages/home/home',
          })
          // setTimeout(()=>{
          //   if(0 < res.data.data.appList.length){
          //     wx.switchTab({
          //       url: '/pages/home/home',
          //     })
          //   }else{
          //     wx.reLaunch({
          //       url: '/pages/addProject/addProject'
          //     })
          //   }
          // },1000)
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
    }else{
      wx.reLaunch({
        url: '../login/login'
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isToken();
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

