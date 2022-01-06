// pages/getPhone/getPhone.js
const util = require('../../utils/util.js')
const req = util.request
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getPhoneNumber (e) {
    const that = this;
    // console.log(e)
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
    if(e.detail.encryptedData && (undefined != e.detail.encryptedData) ){
      wx.login({
        success: res => {
          wx.showLoading({
            title: '请等待',
          })
          req("post","user/getPhone",{
            "encryptedData": e.detail.encryptedData,
            "iv": e.detail.iv,
            "appletCode": res.code
          }).then(res=>{
            wx.hideLoading();
            if(res.data.code && 200 == res.data.code){
              let data = res.data.data;
              if(data.phone && '' != data.phone){
                wx.setStorageSync('phone',data.phoneNumber);
                wx.setStorageSync('wxavatarUrl',data.avatarUrl);
                wx.setStorageSync('userName',res.data.data.userName);
                wx.setStorageSync('userNo',res.data.data.userNo);
                if(0 < data.appList.length){
                  wx.switchTab({
                    url: '/pages/home/home',
                  })
                }else{
                  wx.reLaunch({
                    url: '/pages/addProject/addProject'
                  })
                }
                // wx.reLaunch({
                //   url: '../index/index'
                // })
              }
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          });
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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