const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// 时分秒
const formatTimeN = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':')
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//随机值
const requestId =  function requestId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


//本地环境
// const dataUrl = "http://192.168.1.69:7015/"
// const updataUrl = "https://guard.qy-rgs.com:9019/wx/picture/upload/user/face"

//测试环境
// const dataUrl = "https://pre.qy-rgs.com:7015/"
// const updataUrl = "http://guard.qy-rgs.com:9019/wx/picture/upload/user/face"

//生产环境
const dataUrl = "https://qy-vds.com:7015/"

const  request=(met,url,params)=>{
  //随机值
  const requestId = function requestId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  var token = wx.getStorageSync('token') ? wx.getStorageSync('token') :'';
  return new Promise((resolve,reject)=>{
      wx.request({
        url: dataUrl+url,
        method:met,
        data:{
          ...params
        },
        header: {
          'Content-Type': 'application/json',
          'token': token,
          "requestId":requestId(),
          "timestamp":Date.parse(new Date())/1000
        },
        success:(res)=>{
          if((res.data.code && 304 == res.data.code)||(res.data.code && 303 == res.data.code)){
            wx.removeStorageSync('token')
            wx.reLaunch({
              url: '../login/login'
            })
          }
          resolve(res);
        },
        fail:(err)=>{
          // reject(err);
        }
      });
  })
}


module.exports = {
  formatTime,
  formatTimeN:formatTimeN,
  dataUrl:dataUrl,
  // updataUrl:updataUrl,
  requestId:requestId,
  request
}
