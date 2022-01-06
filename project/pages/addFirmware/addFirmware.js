// pages/addFirmware/addFirmware.js
const util = require('../../utils/util.js')
const dataUrl = util.dataUrl
const req = util.request
const requestId = util.requestId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveFirmware:false,
    inputColor:"#999",
    textareaPadding:60,
    textareaDec:false,
    siziNum:0,
    showPicker:false,
    frimwareName:'',
    form: {
      remark: "",
      model:'',
      fileSize:0,
      name:'',
      sign:'',
      url:'',
      version:''
    },
    chooseList: [],
		multiple: true
  },

  versionChange(e){
    this.setData({
      ['form.version']:e.detail.value
    })
  },

  choose(e) {
    console.log("固件:",e);
    if(5 < e.detail.chooseArray.length){
      this.setData({
        showPicker:true,
      })
      wx.showToast({
        title: '适配机型最多只能选择5个',
        icon: 'none',
        duration: 2000
      })
    }else{
      this.setData({
        showPicker:false,
        ['form.model']: e.detail.chooseArray.toString()
      })
    }
		
  },
  
  selectDeviceMode(){
    this.setData({
      showPicker:true
    })
  },

  trimDec(e) {
    var num = e.detail.value.replace(/\s+/g, '').length;
    this.setData({
      ["form.remark"]: e.detail.value.replace(/\s+/g, ''),
      siziNum:num
    })
    if (0 < this.data.form.remark.length) {
      this.setData({
        decContent: true,
        inputColor:"#333",
        textareaPadding:30,
        textareaDec:true,
      });
    } else {
      this.setData({
        decContent: false,
        inputColor: "#999",
        textareaPadding:60,
        textareaDec:false,
      });
    }
  },

    //文本聚焦
    textareaFocus(e){
      const that = this;
      if ("focus" == e.type) {
        that.setData({
          textareaPadding: 30,
          textareaDec: true,
        })
      }
    },
  
    //文本失焦
    textareaBlur(e){
      const that = this;
      if ("blur" == e.type) {
        if (0 < that.data.form.remark.length) {
          that.setData({
            textareaPadding: 30,
            textareaDec: true,
          })
        } else {
          that.setData({
            textareaPadding: 60,
            textareaDec:false,
          })
        }
      }
    },

    getDeviceType(){
      const that = this;
      req("post","device/certificate/getDeviceType",{}).then(res=>{
        if(res.data.code && 200 == res.data.code){
           if(0 < res.data.data.length){
            res.data.data.forEach((item)=>{
               item.value = item.name
            })
            that.setData({
              chooseList:res.data.data
            })
           }else{
            that.setData({
              chooseList:[]
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

  //固件上传
  updataFile(e){
    const that = this;
    let token = wx.getStorageSync('token');
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles[0].path;
        let fileExtension = tempFilePaths.split('.').pop().toLowerCase();
        console.log("后缀名:",fileExtension);
        if('bin' == fileExtension){
          let fullName = res.tempFiles[0].name;
          console.log("fullname:",fullName);
          let name = fullName.split('_')[0];
          let version = fullName.split('_')[1];
          let model = fullName.split('_')[3];
          console.log("name:",name);
          console.log("version:",version)
          console.log("model:",model)
          that.setData({
            frimwareName:fullName,
            ['form.url']:'',
            ['form.name']:fullName,
            ['form.version']:version,
            ['form.model']:model,
            // ['form.fileSize']:fileSize
          })
          wx.showLoading({
            title: '上传中',
          })
          
          wx.uploadFile({
            url: dataUrl + 'device/certificate/upload',
            filePath: tempFilePaths,
            name: 'file',
            timeout:600000,
            header: {
              'Content-Type': 'application/json',
              'token': token,
              "requestId":requestId(),
              "timestamp":Date.parse(new Date())/1000
            },
            formData: {
              name:fullName
            },
            success (res){
              wx.hideLoading();
              let data = JSON.parse(res.data)
              console.log("data:vvvvvvv:",data)
              //do something
              that.setData({
                haveFirmware:true,
                ['form.fileSize']:data.data.fileSize,
                ['form.name']:data.data.name,
                ['form.sign']:data.data.sign,
                ['form.url']:data.data.url,
                ['form.model']:data.data.model,
                ['form.version']:data.data.version,
              })
            },
            fail(err){
              wx.showToast({
                title: '文件上传失败',
                icon: 'none',
                duration: 2000
              }) 
            },
            complete(e){
              wx.hideLoading();
            }
          })
          setTimeout(()=>{
            if('' == that.data.form.url){
              wx.showToast({
                title: '文件上传失败,请重新上传文件',
                icon: 'none',
                duration: 2000
              })
            }
            wx.hideLoading();
          },600000)
        }else{
          wx.showToast({
            title: '文件类型错误',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  deleteFirmware(){
    this.setData({
      haveFirmware:false,
      ['form.fileSize']:'',
      ['form.version']:'',
      ['form.model']:'',
      ['form.name']:'',
      ['form.sign']:'',
      ['form.url']:''
    })
  },
  
  submit(){
   const that = this;
   let formData = that.data.form;
   console.log("formData:",formData);
   req("post","device/certificate/save",{
    appId:wx.getStorageSync('appId'),
    name:formData.name,
    model: formData.model,
    sign: formData.sign,
    version:formData.version,
    fileSize:formData.fileSize,
    remark:formData.remark,
    url:formData.url
  }).then(res=>{
    if(res.data.code && 200 == res.data.code){
      wx.showToast({
        title: '文件上传成功',
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
     this.getDeviceType();
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