// pages/user/user.js
const util = require('../../utils/util.js')
const req = util.request
const dataUrl = util.dataUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    userNo:'',
    password:'',
    showModal:false,
    wxavatarUrl:'',
  },

  myProject(){
    wx.navigateTo({
      url: '../myProject/myProject',
    })
  }, 

  myUpdate(){
    let appId = wx.getStorageSync('appId');
    wx.navigateTo({
      url: '../firmwareUpdate/firmwareUpdate?appId='+appId,
    })
  },

  logout(){
    req("post","user/logout",{}).then(res=>{
      if(res.data.code && 200 == res.data.code){
        wx.showToast({
          title: '退出成功',
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.reLaunch({
            url: '../login/login'
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

  //修改密码
  changePassword(){
     this.setData({
      showModal:true
     })
  },

  inputChange(e){
    this.setData({
      password:e.detail.value
    })
  },

  confirm(){
    if('' == this.data.password){
      this.setData({
        showModal:true
      })
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
    }else{
      this.updatePwd();
    }
  },

  updatePwd(){
    const that = this;
    wx.showLoading({
      title: '修改中',
    })
    req("post","user/updatePwd",{
      pwd:that.data.password
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        this.setData({
          showModal:false
        })
        wx.showToast({
          title: '密码修改成功',
          icon: 'none',
          duration: 2000
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
    let pic = wx.getStorageSync('wxavatarUrl');
    if('' != pic){
      if(-1 == pic.indexOf('https')){
        pic = dataUrl + pic;
      }
    }else{
      pic = '../../images/head_portrait.png';
    }
    this.setData({
      userName:wx.getStorageSync('userName'),
      userNo:wx.getStorageSync('userNo'),
      wxavatarUrl:pic
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