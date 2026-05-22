Component({
  data: {
    today: '5月22日 星期五',
    nickname: '林间伙伴',
    summary: [
      { label: '今日计划', value: '5' },
      { label: '已完成', value: '2' },
      { label: '专注', value: '1h 40m' },
      { label: '逾期', value: '1' },
    ],
    nextPlans: [
      { time: '19:30', title: '背英语单词', tag: '英语', owner: '我', color: 'green' },
      { time: '今天', title: '整理项目 README', tag: '写代码', owner: 'W', color: 'blue' },
    ],
    partner: {
      name: '对方',
      status: '浅度计时中',
      focus: '运动 30 分钟',
    },
    isRecording: false,
  },
  methods: {
    onVoiceStart() {
      this.setData({
        isRecording: true,
      })
    },
    onVoiceEnd() {
      if (!this.data.isRecording) {
        return
      }

      this.setData({
        isRecording: false,
      })
      wx.showModal({
        title: 'AI 计划草稿',
        content: '这里后续会接入语音识别和 DeepSeek，生成计划草稿确认页。',
        showCancel: false,
      })
    },
    onVoiceCancel() {
      this.setData({
        isRecording: false,
      })
    },
    goFocus() {
      wx.navigateTo({
        url: '/pages/focus/focus',
      })
    },
    goCalendar() {
      wx.switchTab({
        url: '/pages/calendar/calendar',
      })
    },
    goSettings() {
      wx.navigateTo({
        url: '/pages/settings/settings',
      })
    },
    goDay() {
      wx.navigateTo({
        url: '/pages/day/day',
      })
    },
  },
})
