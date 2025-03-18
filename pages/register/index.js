// pages/login/login.js
Page({
  data: {
    randomNumber: 1,
    userAccound: '',
    userPassword: '',
    userInfo: "",
    // 有关登录的小标题
    showDialog:false,
    showTitile:"",
    showBody:"",
    titleColor:"#45526b;",
    //展示用户注册表
    showRegister:false,
    //注册表的字段设置
    name: '',     // 姓名对应的数据字段
    account: '',   // 账户对应的数据字段
    password:'',
    confirm_password:'',
    data: {
      GoodSentences: [
        {
          mainTitle: "每一天都是新的开始，阳光总会在云层后等着你",
          subTitle: "提醒人们无论当下多难，都有希望在前面"
        },
        {
          mainTitle: "你的内心像花园一样，浇灌一点爱和耐心，它就会开出美丽的花",
          subTitle: "鼓励自我关怀和成长"
        },
        {
          mainTitle: "即使步伐很小，也是在走向光亮的地方",
          subTitle: "肯定努力的价值，哪怕进展缓慢"
        },
        {
          mainTitle: "你不必完美，只要是你自己，就已经足够闪耀",
          subTitle: "传递接纳自我的温暖"
        },
        {
          mainTitle: "阴天会过去，阳光会洒满你的肩膀",
          subTitle: "给予坚持的信心"
        },
        {
          mainTitle: "深呼吸，感受这一刻的宁静，你比你想象的更坚强",
          subTitle: "简单而治愈，提醒人们关注当下"
        },
        {
          mainTitle: "世界很大，总有一束光是为你而亮的",
          subTitle: "让人感到被看见和珍视"
        },
        {
          mainTitle: "像向日葵一样，永远追逐属于你的太阳",
          subTitle: "用自然意象激发活力和希望"
        }
      ]
    }
  },

  onLoad(options) {
    this.randomNumber();
  },
  //生成随机数，能够去将首页面试变成随机更新的
  randomNumber:function(){
    const number = Math.floor(Math.random() * 10);
    this.setData({
     randomNumber: number
    });
 },
  //用户登录函数--能够去向后端发送请求
  login: function() {
    let that = this;
    let userName = that.data.userAccound;
    let userPassword = that.data.userPassword;

    // 在增加一个如果不输入直接登录会进行提醒的
    wx.request({
      url: 'http://127.0.0.1:8000/info/info-login/',
      method: 'POST',
      data: {
        Account: userName,
        PassWord: userPassword
      },
      header: {
        'Content-Type': 'application/json' // 修改为发送 JSON 数据
      },
      success: function(res) {
        console.log("查看返回的结果", res.data);
        if(res.data.code==200){
          wx.redirectTo({
            url: '/pages/mainPage/index'
          });
          
        }else{
          that.setData({
            showDialog:true,
            showTitile:"用户登录失败！",
            showBody:"用户名或密码错误,请重新登录"
          })
          
        }
      },
      fail: function(error) {
        console.log("请求失败:", error);
      }
    });
  },
  registerButton:function(e){
    that.setData({
      showRegister:true
    })
  },
  // 获取用户注册提交的信息
  registerForm:function(e){
    let that = this;
    let Name = that.data.name;     // 姓名对应的数据字段
    let Account = that.data.account;   // 账户对应的数据字段
    let Password = that.data.password;
    let ConfirmPassword = that.data.confirm_password;

    if (!Name || !Account || !Password || !ConfirmPassword ) {
      wx.showModal({
        title: '注册异常提醒',
        content: '请填写完整的注册信息',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }
    wx.request({
      url: 'http://127.0.0.1:8000/info/info-register/',
      method: 'POST',
      data: {
        Name:Name,
        Account:Account,
        PassWord:Password,
        confirm_password:ConfirmPassword,
      },
      header: {
        'Content-Type': 'application/json' // 修改为发送 JSON 数据
      },
      success: function(res) {
        if(res.data.code==200){
          that.setData({
            showDialog:true,
            showTitile:"注册成功",
            showBody:"可使用账号密码进行登录",
            showRegister:false
          })
        }else{
          wx.showModal({
            title: '注册异常提醒',
            content: '请检查两次密码是否一致',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: function(error) {
        console.log("请求失败:", error);
      }
    });
  },
  submitForm: function(e) {
    var formData = e.detail.value; // 获取表单数据
    // 发送网络请求或进行其他处理
    console.log(formData);
  },
 //获取注册提交的信息
 inputRegister:function(e){
  let that = this;
  let inputValue = e.detail.value;             // 获取输入的值
  let inputField = e.target.dataset.inputType; // 获取自定义属性值
  this.setData({
    [inputField]: inputValue  // 将输入的值赋给对应的数据字段
  });
 },
  //输入的账号和密码:
  inputAccount:function(e){
    var that = this;
    this.setData({
      userAccound:e.detail.value
    })
  },
  //获取输入的密码
  inputPassword:function(e){
    this.setData({
      userPassword:e.detail.value
    });
  }
});
