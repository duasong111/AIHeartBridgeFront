// pages/modifySeleInform/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    serverUrl: '',
    // 记录当前用户登录信息
    currentAccount: "",
    userInformData: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //引入全局的路由网址，避免重复输入
    const app = getApp();
    const netServe = app.globalData.netServe;
    const account = app.globalData.account;
    console.log("展示账户信息", account)
    this.setData({
      serverUrl: netServe,
      currentAccount: account
    });
    this.updateMyInform();
  },


  //获取个人信息
  updateMyInform: function () {
    const that = this
    wx.request({
      url: `${that.data.serverUrl}/info/info-userinform/`, //用来去发送给后端的数据接口
      method: 'POST',
      data: {
        "account": that.data.currentAccount || "mock"
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log("展示获取的个人信息",res.data)
        that.setData({
          userInformData:res.data.data
        })
      },fail: function (err) {
        console.log("请求失败:", err);
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