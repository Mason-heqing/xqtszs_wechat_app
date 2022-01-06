// pages/firmwareUpdate/firmwareUpdate.js
const util = require('../../utils/util.js')
const req = util.request
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSingle:false,
    isShowModal:false,
    modalTitle:'设备列表',
    softId:'',
    listModal:[
      // {
      //   name:'设备1',
      //   version:'fdlsdjlsfslfjlkwjflksjflksjflsdkf',
      //   id:1,
      // },
      // {
      //   name:'设备2',
      //   version:'fdlsdjlsfslfjlkwjflksjflksjflsdkf',
      //   id:2,
      // },
      // {
      //   name:'设备3',
      //   version:'fdlsdjlsfslfjlkwjflksjflksjflsdkf',
      //   id:3,
      // },
      // {
      //   name:'设备4',
      //   version:'fdlsdjlsfslfjlkwjflksjflksjflsdkf',
      //   id:4,
      // },
      // {
      //   name:'设备5',
      //   version:'fdlsdjlsfslfjlkwjflksjflksjflsdkf',
      //   id:5,
      // },
    ],
    date:'2021-08-10',
    scrollHeight:0,
    scrollWidth:0,
    appId:'',
    deviceId:'',
    list:[
      // {
      //   name:'sdjlksfjlkle',
      //   version:'2012-25451',
      //   model:'evx001,evxoo2',
      //   uploader:'张三',
      //   times:'2021-05-02',
      //   dec:'修改bUg'
      // },
      // {
      //   name:'sdjlksfjlkle',
      //   version:'2012-25451',
      //   model:'evx001,evxoo2',
      //   uploader:'张三',
      //   times:'2021-05-02',
      //   dec:'修改bUg'
      // },
      // {
      //   name:'sdjlksfjlkle',
      //   version:'2012-25451',
      //   model:'evx001,evxoo2',
      //   uploader:'张三',
      //   times:'2021-05-02',
      //   dec:'修改bUg'
      // }
    ],
    tipsInfo:true,
    tipsHeight:0,
    tipsList:[]
  },

  hiddenMask(){
    const that = this;
    that.setData({
      tipsInfo:true,
      tipsHeight:0,
      tipsList:[],
    })
  },

  cancle(){
    console.log(1);
    this.setData({
      isShowModal:false
    })
  },

  confirm(e){
    // console.log(e.detail)
    const that = this;
    wx.showLoading({
      title: '设备升级中',
    })
    that.frimwareUpdata(e.detail);
  },

  //固件升级发送申请
  frimwareUpdata(deviceIds){
    wx.showLoading({
      title: '升级中,请等待',
    })
    req("post","device/certificate/upgrade",{
      deviceIds:deviceIds,
      softId:this.data.softId,
    }).then(res=>{
      if(res.data.code && 200 == res.data.code){
        wx.hideLoading();
        if( 0 < res.data.data.length){
          this.setData({
            tipsInfo:false,
            tipsHeight:res.data.data.length*52+32,
            tipsList:res.data.data
          })
        }
        // wx.showToast({
        //   title: '固件升级完成',
        //   icon: 'none',
        //   duration: 2000
        // })
        this.setData({
          isShowModal:false
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

  bindDateChange(e){
    console.log(e.detail.value)
    this.setData({
      date:e.detail.value
    })
  },

  addFirmware(){
    wx.navigateTo({
      url: '../addFirmware/addFirmware',
    })
  },

  //获取设备列表
  getDeviceList(model,version){
    const that = this;
    req("post","device/getDeviceList",{
      appId:that.data.appId,
      model:model,
      version:version
    }).then(res=>{
      if(res.data.code && 200 == res.data.code){
         let data = res.data.data
         if(0 < data.length){
            data.forEach(item => {
              item.status = false;
            });
            that.setData({
              listModal:data,
              isShowModal:true
            })
         }else{
          that.setData({
            listModal:[],
            isShowModal:false
          })
          wx.showToast({
            title:'当前没有可升级的设备',
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
      }
    });
  },

  getDeviceFireInfo(){
    const that = this;
    req("post","device/certificate/getDeviceFireInfo",{
      appId:that.data.appId
    }).then(res=>{
      if(res.data.code && 200 == res.data.code){
         if(0 < res.data.data.length){
          that.setData({
            list:res.data.data
          })
         }else{
            that.setData({
              list:[]
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

  isDelete(value){
    const that = this;
    wx.showLoading({
      title: '删除中',
    })
    req("post","device/certificate/delete/"+value,{}).then(res=>{
      if(res.data.code && 200 == res.data.code){
        wx.hideLoading();
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
        that.getDeviceFireInfo();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  delete(e){
    const that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success (res) {
        if (res.confirm) {
          that.isDelete(id)
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
    
  },

  //固件批量升级
  updata(e){
    let version = e.currentTarget.dataset.item.version;
    let model = e.currentTarget.dataset.item.model;
    let softId = e.currentTarget.dataset.item.id
    const that = this;
    that.setData({
      softId:softId
    })
    that.getDeviceList(model,version)
  },

  //固件单个升级
  singleUpdata(e){
    const that = this;
    let softId = e.currentTarget.dataset.item.id;
    that.setData({
      softId:softId
    })
    let arr = [that.data.deviceId]
    that.frimwareUpdata(arr);
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
          // scrollHeight: res.windowHeight - res.windowWidth / 750 * 120
          scrollHeight:res.windowHeight,
          scrollWidth:res.windowWidth
        })
      }
    });
    if(undefined != options.deviceId){
      that.setData({
        isSingle:true,
        maxHeight:that.data.scrollHeight - that.data.scrollWidth / 750 * 6
      })
    }else{
      that.setData({
        isSingle:false,
        maxHeight:that.data.scrollHeight - that.data.scrollWidth / 750 * 102
      })
    }
    console.log("参数:",options.deviceId)
    that.setData({
      appId:options.appId,
      deviceId:options.deviceId
    })
    that.getDeviceFireInfo();
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