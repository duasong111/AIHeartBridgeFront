// pages/chatting/index.js
Page({
  data: {
    chatHistory: [],
    inputValue: '',
    selectedModel: '1.0',
    showPoP: true,
    showTime: '早上好',
    userName: 'Duasong',
    style: 'border: 2rpx solid var(--td-component-border);border-radius: 12rpx;',
    dataAnalysis: '',
    serverUrl: '',
    AIResponce: '',
    currentAccount: '',
    recording: false,
    audioPath: null,
    errorMsg: ''
  },

  /**
   * 生命周期函数
   */
  onLoad(options) {
    const app = getApp();
    const netServe = app.globalData.netServe;
    const account = app.globalData.account;
    this.setData({
      serverUrl: netServe,
      currentAccount: account
    });
    this.updateGreeting();
  },

  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},

  // 更新问候语
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

  // 获取输入框内容
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 选择模型
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

  // 发送消息
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
      inputValue: '' // 清空输入框
    });
    this.callAIModel(content);

    // 每 5 条消息存储一次
    if (updatedChatHistory.length % 5 === 0) {
      wx.request({
        url: 'http://127.0.0.1:8000/chatmessage/ai-messagedel/',
        method: 'POST',
        data: {
          messageList: updatedChatHistory
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          this.setData({
            dataAnalysis: res.data.response
          });
        },
        fail: (err) => {
          this.setData({
            dataAnalysis: '网络繁忙~ 请稍后重试'
          });
        }
      });
    }
  },

  // 调用 AI 大模型
  callAIModel(userInput) {
    wx.showLoading({
      title: 'AI思考中...'
    });
    wx.request({
      url: 'http://127.0.0.1:8000/chatmessage/ai-chat/',
      method: 'POST',
      data: {
        input_text: userInput,
        user_id: 'user789',
        topic_name: '随便聊聊'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        const aiResponse = res.data.response || 'AI回复出错，请重试';
        const aiMessage = {
          sender: 'AI',
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString()
        };
        this.setData({
          chatHistory: [...this.data.chatHistory, aiMessage],
          AIResponce: aiResponse
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

  // 语音播放
  vedioPlay(e) {
    const text = e.currentTarget.dataset.name;
    wx.request({
      url: 'http://127.0.0.1:8000/chatmessage/audio-play/',
      method: 'POST',
      data: {
        text: text
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.status === 'success') {
          const base64Data = res.data.audio_data;
          const cleanBase64 = base64Data.replace(/^data:audio\/mpeg;base64,/, '');
          const fileManager = wx.getFileSystemManager();
          const tempFilePath = `${wx.env.USER_DATA_PATH}/temp_audio.mp3`;

          fileManager.writeFile({
            filePath: tempFilePath,
            data: cleanBase64,
            encoding: 'base64',
            success() {
              const audio = wx.createInnerAudioContext();
              audio.src = tempFilePath;
              audio.play();
              audio.onError((err) => {
                console.error('音频播放错误:', err);
                wx.showToast({
                  title: '语音播放失败',
                  icon: 'none'
                });
              });
            },
            fail(err) {
              console.error('文件写入失败:', err);
              wx.showToast({
                title: '音频保存失败',
                icon: 'none'
              });
            }
          });
        } else {
          wx.showToast({
            title: '语音转换失败',
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

  // 语音输入
  startRecord() {
    this.setData({
      recording: true,
      errorMsg: '',
      audioPath: null
    });

    const recorderManager = wx.getRecorderManager();

    recorderManager.onStart(() => {
      console.log('录音开始');
      wx.showToast({
        title: '录音中，请说5秒以上',
        icon: 'none',
        duration: 10000
      });
    });

    recorderManager.onError((res) => {
      console.error('录音错误:', res);
      this.setData({
        recording: false,
        errorMsg: '录音失败，请重试'
      });
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      });
    });

    recorderManager.onStop((res) => {
      console.log('录音停止，文件路径:', res.tempFilePath, '时长:', res.duration);
      this.setData({
        audioPath: res.tempFilePath,
        recording: false
      });
      if (res.duration < 3000) {
        this.setData({
          errorMsg: '录音时间太短，请至少录音3秒'
        });
        wx.showToast({
          title: '录音太短',
          icon: 'none'
        });
      } else {
        // 录音成功，自动上传
        this.uploadAudio();
      }
    });

    recorderManager.start({
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 32000,
      format: 'wav'
    });
  },

  stopRecord() {
    wx.getRecorderManager().stop();
  },

  uploadAudio() {
    const audioPath = this.data.audioPath;
    if (!audioPath) {
      wx.showToast({
        title: '请先录音',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '识别中...',
      mask: true
    });

    wx.uploadFile({
      url: 'http://127.0.0.1:8000/chatmessage/speech-to-text/',
      filePath: audioPath,
      name: 'audio',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: (res) => {
        wx.hideLoading();
        let data;
        try {
          data = JSON.parse(res.data);
        } catch (e) {
          console.error('解析响应失败:', e, '原始响应:', res.data);
          this.setData({
            errorMsg: '服务器响应格式错误'
          });
          wx.showToast({
            title: '响应错误',
            icon: 'none'
          });
          return;
        }

        console.log('后端返回:', data);

        if (res.statusCode === 200 && data.text) {
          // 将识别结果填入输入框
          this.setData({
            inputValue: data.text,
            errorMsg: ''
          });
          wx.showToast({
            title: '识别成功',
            icon: 'success'
          });
        } else {
          this.setData({
            errorMsg: data.error || '语音识别失败'
          });
          wx.showToast({
            title: '识别失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('上传失败:', err);
        this.setData({
          errorMsg: '上传失败，请检查网络'
        });
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      }
    });
  }
});