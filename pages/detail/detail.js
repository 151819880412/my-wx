
let datas = require('../../list-data.js');
// 获取全局App的实例对象
let appDatas = getApp();
console.log(appDatas);
appDatas.globalData.msg = '修改之后的数据'

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {},
    isCollected: false, // 标识当前文章是否被收藏
    isMusicPlay: false // 标识音乐是否播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //获取路由跳转的query参数
    let index = options.index;
    this.setData({
      detailObj:datas.list_data[index],
      index
    })

    // 读取缓存数据，
    let storageObj = wx.getStorageSync('isCollected');
    // 确认当前页面是否被收藏
    if (storageObj[index]) {
      // 页面被收藏
      this.setData({
        isCollected: true
      })
    }

    // 判断当前页面的音乐是否在播放
    if (appDatas.globalData.isPlay && appDatas.globalData.pageIndex === index) {
      this.setData({
        isMusicPlay: true
      })
    }

    //监视后台音乐的状态
    wx.onBackgroundAudioStop(() => {
      console.log('监听音乐的停止');
      this.setData({
        isMusicPlay: false
      })
      // 修改全局的appData中的状态数据
      appDatas.globalData.isPlay = false;
    })

  },

  //定义处理收藏的方法
  handleCollection(){
    //切换图片显示
    let isCollected = !this.data.isCollected;
    this.setData({
      isCollected
    })
    let title = isCollected ? '收藏成功' : '取消收藏';
    // 显示消息提示框
    wx.showToast({
      title
    })

    // 缓存收藏的状态
    // 思路： 缓存数据格式： {0: true, 1: false, 2: true}
    let obj = wx.getStorageSync('isCollected') || {}; // index, isCollected;
    let index = this.data.index;
    obj[index] = isCollected;
    wx.setStorage({
      key: 'isCollected',
      data: obj,
    })
  },

//定义处理音乐的方法
  handleMusicPlay(){
    // 取反状态
    let isMusicPlay = !this.data.isMusicPlay;
    this.setData({
      isMusicPlay
    })
    // 控制音乐播放
    let { dataUrl, title, coverImgUrl } = this.data.detailObj.music;
    if (isMusicPlay){
        wx.playBackgroundAudio({
          dataUrl,
          title,
          coverImgUrl
        })
      //将状态存在全局app.js中，storage中只能存10M
      // 说明有音乐在播放
      appDatas.globalData.isPlay = true;
      // 说明那个页面的音乐在播放
      appDatas.globalData.pageIndex = this.data.index;
      }else{
        wx.stopBackgroundAudio()
      }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})