// pages/modifySeleInform/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: '',
    // 记录当前用户登录信息
    currentAccount: "",
    userInformData: {}, // 初始化为对象，用于存储修改后的数据
    // 将用户的信息进行展示
    user: "张三",
    email: "",
    Country: "",
    Address: "",
    Account: "",
    Phone: "",
    signature: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 引入全局的路由网址，避免重复输入
    const app = getApp();
    const netServe = app.globalData.netServe;
    const account = app.globalData.account;
    this.setData({
      serverUrl: netServe,
      currentAccount: account
    });
    this.updateMyInform();
  },

  // 获取个人信息
  updateMyInform: function () {
    const that = this;
    wx.request({
      url: `${that.data.serverUrl}/info/info-userinform/`,
      method: 'POST',
      data: {
        "account": that.data.currentAccount || "mock"
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        const userData = res.data.data[0] || {};
        that.setData({
          user: userData.user || '',
          email: userData.email || '',
          Country: userData.Country || '',
          Address: userData.Address || '',
          Account: userData.Account || '',
          Phone: userData.Phone || '',
          signature: userData.signature || '',
        });
      },
      fail: function (err) {
        console.log("请求失败:", err);
      }
    });
  },
  submitForm: function(e) {
    var formData = e.detail.value; // 获取表单数据
    // 发送网络请求或进行其他处理
    console.log(formData);
  },

  // 提交修改
  submitChanges: function (e) {
    const that = this;
    let user  = that.data.user;
    let email = that.data.email;
    let Country = that.data.Country;
    let Address = that.data.Address ;
    let Account = that.data.Account ;
    let Phone = that.data.Phone ;
    let signatur = that.data.signatur;

    console.log("显示手机号",Phone)


    // 发送请求到后端
    wx.request({
      // url: `${that.data.serverUrl}/info/update-userinform/`,
      method: 'POST',
      data: that.data.userInformData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log("修改成功", res.data);
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (err) {
        console.log("修改失败:", err);
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
});