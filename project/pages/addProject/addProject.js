// pages/addProject/addProject.js
const util = require('../../utils/util.js')
const req = util.request
Page({

  /**
   * 页面的初始数据
   */
  data: {
     name:'',
     nameContent:false
  },

  trim(e){
    console.log(e);
    if("" != e.detail.value){
      this.setData({
        name:e.detail.value,
        nameContent:true
      })
    }else{
      this.setData({
        name:e.detail.value,
        nameContent:false
      })
    }
  },

  submit(){
    const that = this;
    req("post","user/app/insert",{
      name:that.data.name
    }).then(res=>{
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: '项目创建成功',
          icon: 'none',
          duration: 2000
        })
         setTimeout(()=>{
          wx.switchTab({
            url: '/pages/home/home',
          })
          // wx.navigateBack({
          //   delta: 1
          // })
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