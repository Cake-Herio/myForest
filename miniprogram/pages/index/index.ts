import { getCompletedRecords, getPlansByDate, getToday, type Plan } from '../../utils/data'

const toPreviewPlan = (plan: Plan) => ({
  time: plan.startTime || plan.timeText || '今天',
  title: plan.title,
  tag: plan.tag,
  owner: plan.ownerAvatar,
  color: plan.color,
})

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
    isVoiceCancelling: false,
    voiceStartY: 0,
    isTimerSetupVisible: false,
    timerType: 'countup',
    timerMode: 'deep',
    durationOptions: [15, 25, 40, 60],
    durationMinutes: 25,
  },
  lifetimes: {
    attached() {
      this.refreshHomeData()
    },
  },
  pageLifetimes: {
    show() {
      this.refreshHomeData()
    },
  },
  methods: {
    refreshHomeData() {
      const today = getToday()
      const todayPlans = getPlansByDate(today)
      const activePlans = todayPlans.filter((plan) => plan.status !== 'completed')
      const completedRecords = getCompletedRecords()
      const todayCompletedCount = completedRecords.length
      const focusMinutes = completedRecords.reduce((total, record) => total + (record.actualMinutes || 0), 0)

      this.setData({
        summary: [
          { label: '今日计划', value: `${todayPlans.length}` },
          { label: '已完成', value: `${todayCompletedCount}` },
          { label: '专注', value: `${Math.floor(focusMinutes / 60)}h ${focusMinutes % 60}m` },
          { label: '逾期', value: `${todayPlans.filter((plan) => plan.status === 'overdue').length}` },
        ],
        nextPlans: activePlans.slice(0, 2).map(toPreviewPlan),
      })
    },
    onVoiceStart(e: WechatMiniprogram.TouchEvent) {
      const touch = e.touches[0]

      this.setData({
        isRecording: true,
        isVoiceCancelling: false,
        voiceStartY: touch ? touch.clientY : 0,
      })
    },
    onVoiceEnd() {
      if (!this.data.isRecording) {
        return
      }

      if (this.data.isVoiceCancelling) {
        this.setData({
          isRecording: false,
          isVoiceCancelling: false,
        })
        wx.showToast({
          title: '已取消',
          icon: 'none',
        })
        return
      }

      this.setData({
        isRecording: false,
        isVoiceCancelling: false,
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
        isVoiceCancelling: false,
      })
    },
    onVoiceMove(e: WechatMiniprogram.TouchEvent) {
      if (!this.data.isRecording) {
        return
      }

      const touch = e.touches[0]
      if (!touch) {
        return
      }

      const movedUpDistance = this.data.voiceStartY - touch.clientY
      const shouldCancel = movedUpDistance > 80

      if (shouldCancel !== this.data.isVoiceCancelling) {
        this.setData({
          isVoiceCancelling: shouldCancel,
        })
      }
    },
    openTimerSetup() {
      this.setData({
        isTimerSetupVisible: true,
      })
    },
    closeTimerSetup() {
      this.setData({
        isTimerSetupVisible: false,
      })
    },
    chooseTimerType(e: WechatMiniprogram.BaseEvent) {
      this.setData({
        timerType: e.currentTarget.dataset.type,
      })
    },
    chooseTimerMode(e: WechatMiniprogram.BaseEvent) {
      this.setData({
        timerMode: e.currentTarget.dataset.mode,
      })
    },
    chooseDuration(e: WechatMiniprogram.BaseEvent) {
      this.setData({
        durationMinutes: Number(e.currentTarget.dataset.minutes),
      })
    },
    noop() {
      // Prevent modal content taps from closing the overlay.
    },
    goFocus() {
      const { timerType, timerMode, durationMinutes } = this.data
      this.setData({
        isTimerSetupVisible: false,
      })
      wx.navigateTo({
        url: `/pages/focus/focus?timerType=${timerType}&timerMode=${timerMode}&durationMinutes=${durationMinutes}`,
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
