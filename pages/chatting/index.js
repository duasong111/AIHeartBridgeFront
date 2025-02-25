// pages/chatting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户所发信息
    userMessage:[],
    showPoP:true,  //用戶在底部進行輸入
    style: 'border: 2rpx solid var(--td-component-border);border-radius: 12rpx;',

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
  userMessageInputAction:function(e){
let date = e;
console.log(data);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

})