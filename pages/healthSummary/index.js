// pages/healthSummary/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getPsychometricsList:"",
    serverUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
        //引入全局路由
        const app = getApp();
        const netServe = app.globalData.netServe;
        this.setData({
          serverUrl: netServe
        });
    //进入该页面就去触犯函数
    this.getPsychometricsFunction();

  },
  getPsychometricsFunction:function () {
    const that = this
    wx.request({
      url: `${that.data.serverUrl}/info/info-psychometrics/`,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log("打印请求的数据",res.data.data);
        that.setData({
          getPsychometricsList: res.data.data
        })
      }
    })
    
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
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})