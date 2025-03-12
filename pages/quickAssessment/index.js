// pages/quickAssessment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected:null,
    diaglogList:[
      { id: "sasa01", content: "复杂新颖的想法比简单轻松的想法更让你兴奋。", index: 1, score: 3 },
      { id: "sasa02", content: "你喜欢在一个安静的环境中专注于任务。", index: 2, score: 4 },
      { id: "sasa03", content: "你倾向于快速做出决定，而不是深思熟虑。", index: 3, score: 2 },
      { id: "sasa04", content: "与他人合作完成项目让你感到更有动力。", index: 4, score: 5 },
      { id: "sasa05", content: "你享受探索未知领域，即使没有明确的目标。", index: 5, score: 3 },
      { id: "sasa06", content: "按部就班的计划比即兴行动更适合你。", index: 6, score: 1 },
      { id: "sasa07", content: "你喜欢通过阅读或学习来获取新的知识。", index: 7, score: 4 },
      { id: "sasa08", content: "面对压力时，你通常能保持冷静和理智。", index: 8, score: 2 },
      { id: "sasa09", content: "你更喜欢独自完成任务，而不是依赖团队。", index: 9, score: 3 },
      { id: "sasa10", content: "尝试新事物时，你会感到兴奋而非不安。", index: 10, score: 5 }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  //点击后的显示效果---注意在判断显示的时候 你的sesected的类型要转化为number类型，不然依然是false
  onButtonTap(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.setData({
      selected: index
    });
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