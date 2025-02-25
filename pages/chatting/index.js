// pages/chatting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户所发信息
    userMessage: '',
    inputValue: '', //用户输入值
    selectedModel: 'Grok3', // 默认模型
    showPoP: true, //用戶在底部進行輸入
    style: 'border: 2rpx solid var(--td-component-border);border-radius: 12rpx;',

  },
    //对用户输入的进行控制
    onInput(e) {
      this.setData({
        inputValue: e.detail.value
       
      });
      console.log("此处输入的值是"+e.detail.value)
    },
  // 选择模型事件
  selectModel() {
    // 这里可以扩展为模型选择逻辑，比如弹窗选择其他模型
    wx.showToast({
      title: '当前模型: Grok3',
      icon: 'none'
    });
    // 示例：假设未来有多个模型，可以用 setData 更新 selectedModel
    this.setData({
      selectedModel: 'Grok3'
    });
  },

  // 发送消息事件---还可以展示在上边中
  sendMessage() {
    const content = this.data.inputValue;
    this.setData({
      userMessage: content
    });
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  userMessageInputAction: function (e) {
    let date = e;
    console.log(data);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

})