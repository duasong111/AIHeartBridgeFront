// pages/chatting/index.js
Page({
    data: {
        chatHistory: [],
        inputValue: '',
        selectedModel: '1.0', //选择默认模型名称
        showPoP: true,
        showTime: "早上好", //动态的显示时间
        userName: "Duasong",
        style: 'border: 2rpx solid var(--td-component-border);border-radius: 12rpx;',
        dataAnalysis:'' , //存储用户聊天后所给的建议
        serverUrl: '',
        currentAccount: ""
      },
      /**
       * 生命周期函数--监听页面加载
       */

    onInput(e) {
        this.setData({
            inputValue: e.detail.value
        });
    },
    selectModel() {
        const models = ['Spark Lite', 'Spark4.0 Ultra'];
        wx.showActionSheet({
            itemList: models,
            success: (res) => {
                const selected = models[res.tapIndex];
                this.setData({
                    selectedModel: selected
                });
                wx.showToast({
                    title: `已切换到: ${selected}`,
                    icon: 'none'
                });
            }
        });
    },

    // 用户发送信息的函数
    sendMessage() {
        const content = this.data.inputValue.trim();
        if (!content) {
            wx.showToast({
                title: '请输入对话内容',
                icon: 'none'
            });
            return;
        }
        const userMessage = {
            sender: 'user',
            content: content,
            timestamp: new Date().toLocaleTimeString()
        };
        const updatedChatHistory = [...this.data.chatHistory, userMessage];
        this.setData({
            chatHistory: updatedChatHistory,
            inputValue: ''
        });
        this.callAIModel(content);
        //每经过十五条信息就进行存储一次，并将返回数据存储在数据库中
        if (updatedChatHistory.length % 5 === 0) {
            // 聊天信息超过10条后进行列表形式进行数据处理
            wx.request({
                url: 'http://127.0.0.1:8000/chatmessage/ai-messagedel/', // 注意：实际可能需要后端代理 
                method: 'POST',
                data: {
                    messageList:updatedChatHistory
                },
                header: {
                    'Content-Type': 'application/json'
                },
                success: (res) => {
                    this.setData({
                        dataAnalysis:res.data.response
                    })
                },
                fail: (err) => {
                    this.setData({
                        dataAnalysis:"网络繁忙~ 请稍后重试"
                    })
                },
            })
        }
    },
    //去与AI大模型进行沟通对话
    callAIModel(userInput) {
        wx.showLoading({
            title: 'AI思考中...'
        });
        // 真实接口示例（取消注释使用）
        wx.request({
            url:'http://127.0.0.1:8000/chatmessage/ai-chat/', // 注意：实际可能需要后端代理
            method: 'POST',
            data: {
                "input_text": userInput,
                "user_id": "user789",
                "topic_name": "随便聊聊"
            },
            header: {
                'Content-Type': 'application/json'
            },
            success: (res) => {
                const aiMessage = {
                    sender: 'AI',
                    content: res.data.response || 'AI回复出错，请重试',
                    timestamp: new Date().toLocaleTimeString()
                };
                this.setData({
                    chatHistory: [...this.data.chatHistory, aiMessage]
                });
                wx.pageScrollTo({
                    scrollTop: 99999,
                    duration: 300
                });
            },
            fail: (err) => {
                console.error('AI调用失败', err);
                const aiMessage = {
                    sender: 'AI',
                    content: '抱歉，回复失败，请稍后再试',
                    timestamp: new Date().toLocaleTimeString()
                };
                this.setData({
                    chatHistory: [...this.data.chatHistory, aiMessage]
                });
            },
            complete: () => {
                wx.hideLoading();
            }
        });
    },


    //切换到这个页面就能触发的函数
    onLoad(options) {
        //引入全局路由
    const app = getApp();
    const netServe = app.globalData.netServe;
    const account = app.globalData.account;
    this.setData({
      serverUrl: netServe,
      currentAccount: account
    });
    this.updateGreeting();
    },

    // 更新问候语的函数
    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = '';
        if (hour >= 5 && hour < 9) {
            greeting = '早上好';
        } else if (hour >= 9 && hour < 12) {
            greeting = '上午好';
        } else if (hour >= 12 && hour < 18) {
            greeting = '下午好';
        } else if (hour >= 18 && hour < 22) {
            greeting = '晚上好';
        } else {
            greeting = '深夜好';
        }
        this.setData({
            showTime: greeting
        });
    },

    //进行语音播放功能
    vedioPlay(){

        const text = e.currentTarget.dataset.text;

        console.log("进入了视频播放页面")
        wx.request({
            url: 'http://127.0.0.1:8000/chatmessage/audio-play/',  // 你的 Django 接口地址
            
            method: 'POST',
            data: {
                text: text  // 传递当前消息的文本
            },
            success(res) {
                if (res.statusCode === 200) {
                    const audio = wx.createInnerAudioContext();
                    audio.src = res.tempFilePath;  // 假设返回的是音频流路径
                    audio.play();
                } else {
                    wx.showToast({
                        title: '语音播放失败',
                        icon: 'none'
                    });
                }
            },
            fail() {
                wx.showToast({
                    title: '请求失败，请稍后再试',
                    icon: 'none'
                });
            }
        });
    },

    onReady() {},
    onShow() {},
    onHide() {},
    onUnload() {},
});