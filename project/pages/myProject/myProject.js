// pages/myProject/myProject.js
const util = require('../../utils/util.js')
const req = util.request
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    projectList:[],
    // projectList:[
    //   {
    //     name:'一个项目'
    //   },
    //   {
    //     name:'两个项目'
    //   },
    //   {
    //     name:'三个项目'
    //   }
    // ]
  },

  inputBind(e){
    this.setData({
      inputValue:e.detail.value
    })
  },

  addProject(){
    wx.navigateTo({
      url: '../addProject/addProject',
    })
  },

  projectSet(e){
    console.log(e.currentTarget.dataset.item);
    let appId = e.currentTarget.dataset.item.appId;
    let appName = e.currentTarget.dataset.item.appName;
    let appSecret = e.currentTarget.dataset.item.appSecret;
    let data = "项目名称:" + appName + ",项目ID:" + appId + ",项目密钥:" + appSecret
    wx.setClipboardData({
      //准备复制的数据
      data: data,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },


  //获取项目列表
  getRoomList(value){
    console.log(value);
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    req("post","user/app/query",{
      name: value,
    }).then(res=>{
      wx.hideLoading();
      if(res.data.code && 200 == res.data.code){
        if(res.data.data && 0 < res.data.data.length){
          that.setData({
            projectList:res.data.data,
            showMessage:false,
            noMessage:true,
          })
        }else{
          that.setData({
            projectList:[],
            // showMessage:true,
            // noMessage:false,
          })
        }
      }else{
        that.setData({
          // showMessage:true,
          // noMessage:false,
        })
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  query(){
    let value = this.data.inputValue;
    this.getRoomList(value)
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
   this.getRoomList("");
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