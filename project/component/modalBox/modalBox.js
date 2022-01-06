Component({

  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    showModal: {
      type: Boolean,
      value: false
    },
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputValue: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // clickMask(e) {
    //   this.setData({show: false})
    // },
    // subClickMask(){
    //  this.setData({show:true})
    // },
    // cancel() {
    //   this.setData({ show: false })
    //   this.triggerEvent('cancel')
    // },
    // confirm() {
    //   this.setData({ show: false })
    //   this.triggerEvent('confirm')
    // },
    // change() {
    //   this.setData({ show: false })
    //   this.triggerEvent('change')
    // }
    showDialogBtn: function() {
      this.setData({
          showModal: true
      })
      // this.triggerEvent('change')
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function() {
        return
    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function() {
        this.setData({
            showModal: false
        });

    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function() {
        this.hideModal();
  
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function() {
        // this.hideModal();
        this.triggerEvent('confirm')
    },

    /**
     * 获取输入框中输入的值
     */
    inputChange:function(option){
        /* 把文本框输入的内容方到 data 里面 */
        let value = option.detail.value;
        this.setData({
            inputValue: value
        })
        this.triggerEvent('inputChange',{value})
    }
  }
})