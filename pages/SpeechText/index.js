Page({
  data: {
    recording: false,
    audioPath: null,
    transcribedText: '',
    errorMsg: ''
  },

  startRecord() {
    const that = this;
    this.setData({ recording: true, errorMsg: '', audioPath: null });

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
      that.setData({
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
      that.setData({
        audioPath: res.tempFilePath
      });
      if (res.duration < 3000) {
        that.setData({
          errorMsg: '录音时间太短，请至少录音3秒'
        });
        wx.showToast({
          title: '录音太短',
          icon: 'none'
        });
      }
    });

    recorderManager.start({
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 32000, // 降低比特率，减少文件大小
      format: 'wav'
    });
  },

  stopRecord() {
    this.setData({ recording: false });
    wx.getRecorderManager().stop();
  },

  uploadAudio() {
    const that = this;
    const audioPath = this.data.audioPath;

    if (!audioPath) {
      wx.showToast({
        title: '请先录音',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '上传中...',
      mask: true
    });

    wx.uploadFile({
      url: 'http://127.0.0.1:8000/chatmessage/speech-to-text/',
      filePath: audioPath,
      name: 'audio',
      header: {
        'content-type': 'multipart/form-data'
      },
      success(res) {
        wx.hideLoading();
        let data;
        try {
          data = JSON.parse(res.data);
        } catch (e) {
          console.error('解析响应失败:', e, '原始响应:', res.data);
          that.setData({
            transcribedText: '',
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
          that.setData({
            transcribedText: data.text,
            errorMsg: ''
          });
          wx.showToast({
            title: '转换成功',
            icon: 'success'
          });
        } else {
          that.setData({
            transcribedText: '',
            errorMsg: data.error || '转换失败'
          });
          wx.showToast({
            title: '转换失败',
            icon: 'none'
          });
        }
      },
      fail(err) {
        wx.hideLoading();
        console.error('上传失败:', err);
        that.setData({
          transcribedText: '',
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