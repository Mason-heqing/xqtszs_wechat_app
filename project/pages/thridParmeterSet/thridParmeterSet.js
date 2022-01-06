// pages/thridParmeterSet/thridParmeterSet.js
const util = require('../../utils/util.js')
const req = util.request
const dateTimePicker = require('../../utils/dateTimePicker.js');
const timePicker = require('../../utils/timePicker.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   preventDuplication:true,
   deviceId:'',
   list:[],
   isShowBtn:false,
   dateTimeArray: null,
   flag:true,
  },
 
  //修改枚举类型参数
  bindPickerChange(e){
    let index = e.currentTarget.dataset.index;
    let changeIndex = parseInt(e.detail.value);
    console.log(this.data.list)
    this.setData({
      [`list[${index}].indx`]:changeIndex,
      [`list[${index}].value`]:this.data.list[index].optionValue[changeIndex]
    })
  },

  
  //修改时间参数
  changeDateTime(e){
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTimeColumn(e){
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },

  //修改boolean类型参数
  switch1Change(e){
    let index = e.currentTarget.dataset.index;
    console.log(index,e.detail.value,)
    this.setData({
      [`list[${index}].value`]:e.detail.value?1:0
    })
  },
 
  //修改Integer类型参数
  isTypeInteger(e){
     let index = e.currentTarget.dataset.index;
     let value = parseInt(e.detail.value);
    //  if(parseInt(e.detail.value)<this.data.list[index].minValue){
    //     value = this.data.list[index].minValue
    //  }else if(parseInt(e.detail.value)>this.data.list[index].maxValue){
    //    value = this.data.list[index].maxValue
    //  }else if('' == e.detail.value){
    //    value = this.data.list[index].minValue
    //  }else{
    //   value = parseInt(e.detail.value)
    //  }
     this.setData({
      [`list[${index}].value`]:value
     })
  },

   // 选择十分秒时间的时候触发
   startTimeColumn(e) {
    var startTimeArr = this.data.startTime;
    startTimeArr[e.detail.column] = e.detail.value
    this.setData({
      startTime: startTimeArr
    });
  },
  // 确定十分秒的时候触发
  startTimeChange: function (e) {
    var startTimeArr = this.data.startTime;
    startTimeArr[e.detail.column] = e.detail.value;
    this.setData({
      startTime: startTimeArr
    });
  },

  //提交表单
  formSubmit(e){
    console.log(e.detail.value);
    const that = this;
    let formData = e.detail.value;
    let groupKey = app.globalData.thridParmeterSet.groupKey;
    let sendJson = {};
    let json = {};
    let groupItem = app.globalData.thridParmeterSet.item;
    console.log('list:',that.data.list);
    // if('Video_pile_cfg' == groupKey){
    //   let data1 = groupItem[0].optionName[groupItem[0].optionValue.indexOf(parseInt(groupItem[0].value))];
    //   let data2 = groupItem[1].optionName[groupItem[1].optionValue.indexOf(parseInt(groupItem[1].value))];
    //   if(('灭' != data1 && '灭' != data2) && data1 == data2){
    //     wx.showToast({
    //         title:app.globalData.thridParmeterSet.item[0].name + "状态与" + app.globalData.thridParmeterSet.item[1].name + '不能重复',
    //         icon: 'none',
    //         duration: 2000
    //     })
    //     return false;
    //   }
      
    // }
    that.setData({
      flag:true,
    })
    groupItem.forEach((info,index)=>{
      if("integer" == info.type){
        if(info.minValue > info.value){
          console.log("integer:",info.minValue,info.value)
          that.setData({
            flag:false
          })
          wx.showToast({
            title: info.name + '设置的值不能小于最小值' + info.minValue,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            flag:false
          })
          return false;
        }else if(info.maxValue < info.value){
          wx.showToast({
            title: info.name + '设置的值不能大于最大值' + info.maxValue,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            flag:false
          })
          return false;
        }
      }
    })
    if(that.data.flag){
      for(let k in formData){
        // let n = Number(formData[k]);
        console.log('index:',that.contains(app.globalData.thridParmeterSet.item,k));
        let indx = that.contains(app.globalData.thridParmeterSet.item,k)
          if('string' == app.globalData.thridParmeterSet.item[indx].type){
            json[k] = formData[k];
          }else{
            json[k] = parseInt(formData[k]);
          }
        
        // if('' != formData[k]){
        //   if(!isNaN(n)){
        //     json[k] = parseInt(formData[k]);
        //   }else{
        //     json[k] = formData[k];
        //   }
        // }else{
        //   json[k] = '';
        //   // if(that.contains(app.globalData.thridParmeterSet.item,k)){
        //   //   let indx = that.contains(app.globalData.thridParmeterSet.item,k)
        //   //   wx.showToast({
        //   //     title:app.globalData.thridParmeterSet.item[indx].name+"不能位空",
        //   //     icon: 'none',
        //   //     duration: 2000
        //   //   })
        //   // }
        //   // return false
        // }
      }
      sendJson[groupKey] = json;
      if(that.data.preventDuplication){
        wx.showLoading({
          title: '提交中',
        })
        req("post","device/config/set/"+that.data.deviceId,{
          dataJo:sendJson,
        }).then(res=>{
          wx.hideLoading();
          setTimeout(()=>{
            that.setData({
              preventDuplication:true,
            })
          },2300)
          if(res.data.code && 200 == res.data.code){
            wx.showToast({
              title: "提交成功",
              icon: 'none',
              duration: 2000
            })
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/home/home',
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
      }
      that.setData({
        preventDuplication:false,
      })
    }
  },

  //获取某个元素在数组中的下标
  contains(arrays, obj) {
    var i = arrays.length;
    while (i--) {
        if (arrays[i].key === obj) {
            return i;
        }
    }
    return false;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currentTime = null;
    let dataParmeterSet = app.globalData.thridParmeterSet.item;
    let thridParmeterName = app.globalData.thridParmeterSet.groupName;
    let newTime = new Date();
    let data = newTime.getFullYear() + "/" + (newTime.getMonth() + 1) + "/" + newTime.getDate();
    let time = null;
    let obj = null;
    let timeObj = null;
    let arrs = [];
    dataParmeterSet.forEach((item,index)=>{
      if(1 == item.readonly){
        arrs.push(index)
      }
      if('time' == item.key){
        if('' != item.value){
          time = item.value
        }
      }
      if('system_time' == item.key){
        if("" != item.value){
          currentTime = item.value
        }
      }
      if('enum' == item.type){
        item.indx = item.optionValue.indexOf(item.value);
      }
    })
    if(null != currentTime){
      obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear,currentTime);
    }else{
      obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    }
    if(null != time){
      let dateTime = data + ' ' + time;
      timeObj = timePicker.timePicker(util.formatTimeN(new Date(dateTime)));
    }else{
      timeObj = timePicker.timePicker(util.formatTimeN(newTime));
    }
    wx.setNavigationBarTitle({
      title: thridParmeterName
    })
    this.setData({
      deviceId:options.deviceId,
      list:dataParmeterSet,
      dateTimeArray:obj.dateTimeArray,
      dateTime:obj.dateTime,
      startTimeArray: timeObj.timeArray,
      startTime: timeObj.time,
      isShowBtn:arrs.length == dataParmeterSet.length?false:true,
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