// pages/chatting/index.js
Page({
  data: {
    chatHistory: [],
    inputValue: '',
    selectedModel: '1.0',   //选择默认模型名称
    showPoP: true,  //
    showTime:"早上好",//动态的显示时间selectedModel
    userName:"Duasong",
    style: 'border: 2rpx solid var(--td-component-border);border-radius: 12rpx;',
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  selectModel() {
    const models = ['Version1.0', 'Version2.0', 'Version3.0'];
    wx.showActionSheet({
      itemList: models,
      success: (res) => {
        const selected = models[res.tapIndex];
        this.setData({ selectedModel: selected });
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
      wx.showToast({ title: '请输入对话内容', icon: 'none' });
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
    console.log('用户消息已添加:', updatedChatHistory);
  },

  callAIModel(userInput) {
    wx.showLoading({ title: 'AI思考中...' });
    // 模拟回复（可替换为真实接口）
    setTimeout(() => {
      const aiResponse = `你说了: "${userInput}"，我正在学习如何更好地回复你！`;
      const aiMessage = { 
        sender: 'AI', 
        content: aiResponse, 
        timestamp: new Date().toLocaleTimeString()
      };
      this.setData({
        chatHistory: [...this.data.chatHistory, aiMessage]
      });
      wx.pageScrollTo({ scrollTop: 99999, duration: 300 });
      wx.hideLoading();
    }, 1000);

    // 真实接口示例（取消注释使用）
    /*
    wx.request({
      url: 'https://your-api-endpoint.com/grok',
      method: 'POST',
      data: { message: userInput, model: this.data.selectedModel },
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        const aiMessage = { 
          sender: 'AI', 
          content: res.data.reply || 'AI回复出错，请重试', 
          timestamp: new Date().toLocaleTimeString()
        };
        this.setData({
          chatHistory: [...this.data.chatHistory, aiMessage]
        });
        wx.pageScrollTo({ scrollTop: 99999, duration: 300 });
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
    */
  },
//切换到这个页面就能触发的函数
  onLoad(options) {
    this.updateGreeting();
  },
  // 更新问候语的函数
  updateGreeting() {
    const hour = new Date().getHours(); // 获取当前小时（0-23）
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
      greeting = '深夜好'; // 深夜时段
    }
    this.setData({
      showTime: greeting
    });
  },




  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
});