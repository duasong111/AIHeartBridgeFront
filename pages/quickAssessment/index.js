// pages/quickAssessment/index.js
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
    // console.log('Updated dialogList:', this.data.dialogList); // 调试用
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTheAnswerList();

  },
  getTheAnswerList:function () {
    var that = this
    wx.request({
      url: 'http://127.0.0.1:8000/info/info-getquestionlist/',
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

  // 计算用户提交的分数
  submitAnswers: function (e)  {
    const totalScore = this.data.dialogList.reduce((sum, item) => sum + item.score, 0);
    const updatedRecord = [...this.data.recordUserScore, totalScore]; // 将新分数追加到数组
    if (totalScore < 20) {
      wx.showModal({
        title: '提示信息',
        content: '请完成所有的选项哦~',
        success: function (res) {
          // if (res.confirm) { //这里是点击了确定以后
          //   console.log('用户点击确定')
          // } else { //这里是点击了取消以后
          //   console.log('用户点击取消')
          // }
        }
      })
    }else{
      let index = Math.floor((totalScore - 20) / 10); // 将得分映射到 0-8 的索引
      if (index < 0) index = 0; // 低于20分按最低处理
      if (index > 8) index = 8; // 高于100分按满分处理
      // 获取对应建议
      const suggestion = this.AIList[index];
      console.log("展示数据",this.AIList[index])
      this.setData({
        dialogShow:true, //最后提醒成绩的
        AISuggestions:suggestion,
        recordUserScore: updatedRecord // 更新历史记录
      })
    }


    // console.log('Total Score:', totalScore,"列表为:",recordUserScore);

    // 可以跳转到结果页面或显示结果
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