const { serverUrls } = require('../../config.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dialogShow:false, //最后提醒成绩的
    recordUserScore:[],//记录用户历次分数
    dialogList:[],
    AISuggestions:"",
    AIList:[],
    netServe:""
  },
  //点击后的显示效果---注意在判断显示的时候 你的sesected的类型要转化为number类型，不然依然是false
  onButtonTap: function (e)  {
    const questionIndex = Number(e.currentTarget.dataset.questionIndex); // 当前问题在列表中的索引
    const score = Number(e.currentTarget.dataset.index); // 点击的按钮值（1-5）
    const newList = this.data.dialogList.map((item, idx) => {
      if (idx === questionIndex) {
        return { ...item, score: score }; // 只更新当前问题的 score
      }
      return item; // 其他问题不变
    });
    this.setData({
      dialogList: newList
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.setData({
      netServe: serverUrls['localServerUrl']
    });
    this.getAIAnalysis();
    this.getTheAnswerList();
    //获取AI分析的列表数据
   

  },
  //获取回复的字段
  getTheAnswerList:function () {
    var that = this;
    console.log("传输来的值是:",that.netServe);
    wx.request({
      url: `${that.data.netServe}/info/info-getquestionlist/`,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          dialogList: res.data.data
        })
      }
    })
  },

  //获取AI分析的字段
  getAIAnalysis:function () {
    var that = this;
    console.log("传输来的值是:",that.netServe);
    wx.request({
      url: `${that.data.netServe}/info/info-sendalltestdata/`,
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log("获取AI分析后的数据",res.data)
        that.setData({
          AIList: res.data.data
        })
      }
    })
    
  },

  // 计算用户提交的分数
  submitAnswers: function (e)  {
    const totalScore = this.data.dialogList.reduce((sum, item) => sum + item.score, 0);
    const updatedRecord = [...this.data.recordUserScore, totalScore]; // 将新分数追加到数组
    if (totalScore < 20) {
      wx.showModal({
        title: '提示信息',
        content: '请完成所有的选项哦~',
        success: function (res) {
        }
      })
    }else{
      let index = Math.floor((totalScore) / 10); // 将得分映射到 0-8 的索引
      if (index < 2) index = 0; // 低于20分按最低处理
      if (index > 9) index = 8; // 高于100分按满分处理
      const suggestion = this.data.AIList[index];
      this.setData({
        dialogShow:true, //最后提醒成绩的
        AISuggestions:suggestion,
        recordUserScore: updatedRecord // 更新历史记录
      })
    }
  },
  //用户的分数重置，进行重新计算 排序打乱
  submitReset: function (e)  {
    const newList = this.data.dialogList.map(item => ({ ...item, score: 0 }));
    this.setData({
      dialogList: newList
    });
  },
  // 最后提交的时候用户点击了确认的按钮，执行的操作
  confirmFunction:function(){
    console.log("用户点击了确认的操作，执行啥啥啥")
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