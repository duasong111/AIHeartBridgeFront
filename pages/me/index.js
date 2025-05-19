// pages/me/me.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '/Image/cool.png',
    username: 'John Doe',
    serverUrl: '',
    currentAccount: "",
    userInformData:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //引入全局的路由网址，避免重复输入
    const app = getApp();
    const netServe = app.globalData.netServe;
    const account = app.globalData.account;
    this.setData({
      serverUrl: netServe,
      currentAccount: account
    });
    this.updateMyInform();
  },
  //更新个人信息
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
        that.setData({
          userInformData:res.data.data
        })
      },fail: function (err) {
        console.log("请求失败:", err);
      }
    })
  },
  //跳转个人信息页面
  // PersonalInform: function () {
  //   wx.navigateTo({
  //     url: '/pages/myMessage/index',
  //   })
  // },
  // 修改个人信息
  modifySelfInfom:function(){
    wx.navigateTo({
      url: '/pages/myMessage/index',
    })
  },
  //答题版测试记录
  TestHistory: function () {
    wx.navigateTo({
      url: '/pages/testRecord/index',
    })
  },
  //心理健康总结
  summaryOfMentalHealth: function (params) {
    wx.navigateTo({
      url: '/pages/healthSummary/index'
    })
  },
  //通知中心
  noticeCenter: function () {
    wx.navigateTo({
      url: '/pages/noticeCenter/index'
    })
  },
  //开发历程
  projectDevelop: function () {
    wx.navigateTo({
      url: '/pages/projectDevelopment/index'
    })
  },
  //退出登录
  exitLogin:function () {
    const app = getApp();
    app.globalData.account = '';
    wx.navigateTo({
      url: '/pages/register/index'
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