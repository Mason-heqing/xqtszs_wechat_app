const App = getApp();
Component({
	options: {
		addGlobalClass: true,
		multipleSlots: true
	},
	properties: {
		 isShowModal: { //是否显示整个modal框
			type: Boolean,
			value: false
		},
		isShowTitle: { // 是否显示标题
			type: Boolean,
			value: true
		},
		modalTitle: { // 标题内容
			type: String,
			value: "标题"
    },
    listModal:{
      type: Array
    },
		placeholder: { // input框提示文字
			type: String,
			value: "请输入提示文字"
		},
		showDesc: { // 备注文字
			type: String,
			value: ""
		},
		inputType: { // input框类型
			type: String,
			value: 'text'
		},
		isShowInput: { // 是否显示 input框
			type: Boolean,
			value: true
		},
		inputVal: {
			type: [String,Number],
			value: ''
		}
	},
	data: {
		isfous: false,
		selectall:false,
		deviceIds:[],
	},
	methods: {
		bindFous() {
			this.setData({
				isfous:true
			})
		},
		bindBlur() { 
			this.setData({
				isfous: false
			})
		},
		checkboxChange(e) {
      // console.log(e.detail.value);
      this.setData({
        deviceIds:e.detail.value,
      })
			// this.triggerEvent('bindcheckboxChange', e.detail.value)
		},
		cancle() { 
			this.triggerEvent('cancle')
		},
		_confirm(e) {
			// console.log(this.data.deviceIds)
			console.log("hahahhahaha:",this.data.deviceIds.length);
			if(0 < this.data.deviceIds.length){
				this.triggerEvent("confirm",this.data.deviceIds);
			}else{
				wx.showToast({
					title:'请选择需要升级的设备',
					icon: 'none',
					duration: 2000
				})
			}
			this.setData({
				selectall:false,
			}) 
    },
    allSelect(){
      //  console.log(this.data.listModal);
       const that = this;
       let arr = [];
			 let listData = that.data.listModal;
			 if(that.data.selectall){
					that.setData({
						selectall:false
					})
			 }else{
					that.setData({
						selectall:true
					})
			 }
			 console.log(that.data.selectall);
       listData.forEach((item)=>{
          item.status = that.data.selectall;
          arr.push(item.deviceId);
			 })
			 if(that.data.selectall){
					that.setData({
							listModal:listData,
							deviceIds:arr
					})
			 }else{
				that.setData({
					listModal:listData,
					deviceIds:[]
		   	})
			 }
       
    },
	}
})
