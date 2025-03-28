Page({
  data: {
    navLeftItems: [],
    navRightItems: [],
    curNav: 1,
    curIndex: 0,
    showPoP: false,
    selectedItem: null,
    serverUrl:''
  },
  onLoad: function() {
        //引入全局路由
        const app = getApp();
        const netServe = app.globalData.netServe;
        this.setData({
          serverUrl: netServe
        });
    this.getAcquiringProfessionalFields();
  },
  getAcquiringProfessionalFields: function() {
    var that = this;
    wx.request({
      url: `${that.data.serverUrl}/info/info-newslistdetail/`,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        const processedNavLeftItems = res.data.data.navLeftItems.map(item => ({
          id: item.id,
          title: item.data.title
        }));
        that.setData({
          navLeftItems: processedNavLeftItems,
          navRightItems: res.data.data.navRightItems
        });
      },
      fail: function(err) {
        console.error("请求失败", err);
      }
    });
  },
  switchRightTab: function(e) {
    let id = e.currentTarget.dataset.id; // 使用 currentTarget 更准确
    let index = parseInt(e.currentTarget.dataset.leftIndex);
    this.setData({
      curNav: id,
      curIndex: index
    });
  },
  getDetail: function(event) {
    const { rightIndex } = event.currentTarget.dataset;
    const selectedItem = this.data.navRightItems[this.data.curIndex][rightIndex];
    this.setData({
      selectedItem,
      showPoP: true,
    });
  },
});