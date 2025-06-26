Page({
  data: {
    // 展示当前页码
    currentData: 0,
    //获取比赛通知
    getCompetitionNotifications: "",
    //获取新闻通知
    getNews: "",
    //添加通告栏的数据
    bulletinBoard:[],
    //获取bing图片展示
    images: {},
    query: {},
    imagsult: {},
    index: -1,
    //当前天数用于改变bing的图片
    currentBingDays: 0,
    serverUrl: ''
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
    //获取通告栏信息
    this.getbulletinBoardData();
    // 获取比赛通知
    this.getGameNotices();
    //获取新闻通知
    this.getNews();
    //发送请求获取壁纸
    this.getimages();
  },

  //对图片的格式进行调整
  imageLoad: function (e) {
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 718,
      viewHeight = 718 / ratio;
    var image = this.data.images;
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight,
    }
    console.log("展示image的值",image)
    this.setData({
      images: image
    })
  },
  //发送请求获取壁纸
  getimages() {
    var currentBingDays = this.data.currentBingDays;
    var url = `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${currentBingDays}&n=3&mkt=zh-CN`;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.images) {
          console.log("传输的图片进行展示",res.data)
          this.setData({
            imagsult: res.data.images
          });
        } else {
          console.error('响应数据异常:', res);
          wx.showToast({
            title: '数据解析失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        wx.showToast({
          title: '请求失败，请检查网络',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  //点击后生成任意一张图片 先进行保留
  previousPages: function () {
    var that = this
    var currentBingDays = this.data.currentBingDays
    var randomNum = Math.floor(Math.random() * 7);
    this.setData({
      currentBingDays: randomNum
    });

    this.getimages()
  },

  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  // 展示快速测评的答题模式
  quickAssess: function () {
    wx.navigateTo({
      url: '/pages/quickAssessment/index'
    })
  },
  //展示每日推荐的页面进行跳转
  dailyRecom: function () {
    wx.navigateTo({
      url: '/pages/dailyRecom/index',
    })
  },
  //获取壹心理内容
  getGameNotices: function () {
    var that = this
    wx.request({
      url: `${that.data.serverUrl}/newentrance/art-notice/`,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          getCompetitionNotifications: res.data.data
        })
      }
    })
  },
  // 获取活动详情
  getNews: function () {
    var that = this
    wx.request({
      url: `${that.data.serverUrl}/newentrance/art-news/`,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          getNews: res.data.data
        })
      }
    })
  },
  //获取通告栏的内容
  getbulletinBoardData: function () {
    var that = this
    wx.request({
      url: `${that.data.serverUrl}/newentrance/art-about/`,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
            bulletinBoard: res.data.data.slice(-1)[0]
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