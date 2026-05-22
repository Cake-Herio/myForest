Component({
  data: {
    taskTitle: '背英语单词',
    tag: '英语',
    mode: 'deep',
    modeText: '深度计时',
    timeText: '00:25:00',
    isPaused: false,
  },
  methods: {
    chooseMode(e: WechatMiniprogram.BaseEvent) {
      const mode = e.currentTarget.dataset.mode
      this.setData({
        mode,
        modeText: mode === 'deep' ? '深度计时' : '浅度计时',
      })
    },
    togglePause() {
      this.setData({ isPaused: !this.data.isPaused })
    },
    finishFocus() {
      wx.showModal({
        title: '完成确认',
        content: '停止后会进入完成确认页：选择标签、填写详情，再写入已完成表。',
        confirmText: '停止',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '后续接入完成确认页',
              icon: 'none',
            })
          }
        },
      })
    },
  },
})
