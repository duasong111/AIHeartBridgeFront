Page({
    /**
     * 页面的初始数据
     */
    data: {
        dialogShow: false, //最后提醒成绩的
        recordUserScore: [], //记录用户历次分数
        dialogList: new Array(20).fill(0),
        selectDatalist: [],
        AISuggestions: "",
        AIList: [],
        lastScore: "",
        serverUrl: '',
        selectedModel:"",
        selectedType:""
    },
    //点击后的显示效果---注意在判断显示的时候 你的sesected的类型要转化为number类型，不然依然是false
    onButtonTap: function (e) {
        const questionIndex = Number(e.currentTarget.dataset.questionIndex); // 当前问题在列表中的索引
        const score = Number(e.currentTarget.dataset.index); // 点击的按钮值（1-5）

        let scoreList = this.data.selectDatalist;
        scoreList[questionIndex] = score ? score : 0; //没有选就是 0
        const newList = this.data.dialogList.map((item, idx) => {
            if (idx === questionIndex) {
                return {
                    ...item,
                    score: score
                }; // 只更新当前问题的 score
            }
            return item; // 其他问题不变
        });
        this.setData({
            dialogList: newList,
            selectDatalist: scoreList
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const app = getApp();
        const netServe = app.globalData.netServe;
        this.setData({
            serverUrl: netServe
        });
        this.getAIAnalysis();
        // this.getTheAnswerList();
        this.getSelectTypleList();
        //获取AI分析的列表数据
    },
    //用户先进行选择类型
    getSelectTypleList: function () {
            // 定义题目类型
            const models = ['心理健康', '情感问卷', '人格测试'];

            // 让用户选择题目类型
            wx.showActionSheet({
                itemList: models,
                success: (res) => {
                    // 获取用户选择的模型类型
                    const selected = models[res.tapIndex];
                    const selectedType = res.tapIndex + 1; // type 值对应于数组的索引 + 1

                    // 设置当前选择的模型和对应的 type 值
                    this.setData({
                        selectedModel: selected,
                        selectedType: selectedType // 保存用户选择的类型
                    });

                    // 显示已选择的提示
                    wx.showToast({
                        title: `已切换到: ${selected}`,
                        icon: 'none'
                    });

                    // 发送请求，使用用户选择的 type
                    this.getTheAnswerList(selectedType);
                },
                fail: (err) => {
                    console.log('选择取消或出现错误', err);
                }
            });

    },
    //获取回复的字段
    getTheAnswerList: function (type) {
        var that = this;
        wx.request({
            url: `${that.data.serverUrl}/info/info-getquestionlist/`,
            method: 'POST',
            data: {
                type:type
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    dialogList: res.data.data
                })
            },fail: function (err) {
                console.error('请求失败', err);
            }
        })
    },

    //获取AI分析的字段
    getAIAnalysis: function () {
        var that = this;
        wx.request({
            url: `${that.data.serverUrl}/info/info-sendalltestdata/`,
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    AIList: res.data.data
                })
            }
        })

    },

    // 计算用户提交的分数
    submitAnswers: function (e) {
        const totalScore = this.data.dialogList.reduce((sum, item) => sum + item.score, 0);
        const updatedRecord = [...this.data.recordUserScore, totalScore]; // 将新分数追加到数组
        if (totalScore < 20) {
            wx.showModal({
                title: '提示信息',
                content: '请完成所有的选项哦~',
                success: function (res) {}
            })
        } else {
            let index = Math.floor((totalScore) / 10); // 将得分映射到 0-8 的索引
            if (index < 2) index = 0; // 低于20分按最低处理
            if (index > 9) index = 8; // 高于100分按满分处理
             //说明:以下注释的两个开始的时候是进行死数据，后续换成了AI接口   
            // const suggestion = this.data.AIList[index];
            this.setData({
                // dialogShow: true, //最后提醒成绩的
                // AISuggestions: suggestion,
                recordUserScore: updatedRecord, // 更新历史记录
                lastScore: totalScore //反正只是记录最后一次，也就是最高的一次即可
            })
            this.submitSelectDataAmdQuestion(); //调用函数，提交给后台去进行统计
        }
    },
    //用户的分数重置，进行重新计算 排序打乱
    submitReset: function (e) {
        const newList = this.data.dialogList.map(item => ({
            ...item,
            score: 0
        }));
        this.setData({
            dialogList: newList
        });
    },
    submitSelectDataAmdQuestion: function () {
        // 这个函数的作用是将选择的数据以及提交的数据进行统一上传
        const that = this; // 使用 that 代替 this，避免作用域问题
        const datatime = new Date().toISOString();
        // 在请求开始前显示加载提示
        wx.showLoading({
            title: 'AI分析中...',
            mask: true // 防止用户在加载时误操作
        });
        wx.request({
            url: `${that.data.serverUrl}/info/info-assessmentsummary/`, // 发送给后端的数据接口
            method: 'POST',
            data: {
                user: "1",
                randomQuestions: that.data.dialogList,
                selected: that.data.selectDatalist,
                latestScore: that.data.lastScore,
                testTime: datatime
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                let data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                // 关闭加载提示
                wx.hideLoading();
                // 设置AI分析结果并显示对话框
                that.setData({
                    AISuggestions: data.ai_analysis || '暂无分析结果', // 防止ai_analysis为空
                    dialogShow: true // 显示分析结果的对话框
                });
            },
            fail: function (err) {
                // 请求失败时关闭加载提示并提示错误
                wx.hideLoading();
                wx.showToast({
                    title: '加载失败，请重试',
                    icon: 'none',
                    duration: 2000
                });
                console.error("请求失败:", err);
            },
            complete: function () {
                // 确保无论成功或失败都关闭加载提示（可选，视需求而定）
                // wx.hideLoading();
            }
        });
    },
    // 最后提交的时候用户点击了确认的按钮，执行的操作--返回主页
    confirmFunction: function () {
        wx.navigateTo({
            url: '/pages/mainPage/index'
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