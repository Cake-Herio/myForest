const formatSeconds = (seconds: number) => {
  const safeSeconds = Math.max(seconds, 0)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const remainSeconds = safeSeconds % 60
  const pad = (value: number) => `${value}`.padStart(2, '0')

  return `${pad(hours)}:${pad(minutes)}:${pad(remainSeconds)}`
}

Component({
  timer: 0 as number,
  data: {
    taskTitle: '临时专注',
    timerType: 'countup',
    timerMode: 'deep',
    durationOptions: [15, 25, 40, 60],
    durationMinutes: 25,
    timeText: '00:00:00',
    isRunning: false,
    isPaused: false,
    isFinishPanelVisible: false,
    selectedTag: '英语',
    detail: '',
    tags: ['英语', '写代码', '阅读', '运动'],
    elapsedSeconds: 0,
    remainingSeconds: 25 * 60,
  },
  lifetimes: {
    detached() {
      this.stopTick()
    },
  },
  methods: {
    onLoad(query: { timerType?: string, timerMode?: string, durationMinutes?: string }) {
      const timerType = query.timerType === 'countdown' ? 'countdown' : 'countup'
      const timerMode = query.timerMode === 'shallow' ? 'shallow' : 'deep'
      const durationMinutes = Number(query.durationMinutes || 25)

      this.setData({
        timerType,
        timerMode,
        durationMinutes,
        remainingSeconds: durationMinutes * 60,
        timeText: timerType === 'countdown' ? formatSeconds(durationMinutes * 60) : '00:00:00',
      })
      this.startTimer()
    },
    chooseTimerType(e: WechatMiniprogram.BaseEvent) {
      const timerType = e.currentTarget.dataset.type
      this.setData({
        timerType,
        elapsedSeconds: 0,
        remainingSeconds: this.data.durationMinutes * 60,
        timeText: timerType === 'countdown' ? formatSeconds(this.data.durationMinutes * 60) : '00:00:00',
      })
    },
    chooseTimerMode(e: WechatMiniprogram.BaseEvent) {
      const mode = e.currentTarget.dataset.mode
      this.setData({
        timerMode: mode,
      })
    },
    chooseDuration(e: WechatMiniprogram.BaseEvent) {
      const minutes = Number(e.currentTarget.dataset.minutes)
      this.setData({
        durationMinutes: minutes,
        remainingSeconds: minutes * 60,
        timeText: this.data.timerType === 'countdown' ? formatSeconds(minutes * 60) : this.data.timeText,
      })
    },
    startTimer() {
      this.stopTick()
      this.setData({
        isRunning: true,
        isPaused: false,
        elapsedSeconds: 0,
        remainingSeconds: this.data.durationMinutes * 60,
        timeText: this.data.timerType === 'countdown' ? formatSeconds(this.data.durationMinutes * 60) : '00:00:00',
      })
      this.startTick()
    },
    togglePause() {
      if (!this.data.isRunning) {
        return
      }

      const nextPaused = !this.data.isPaused
      this.setData({ isPaused: nextPaused })

      if (nextPaused) {
        this.stopTick()
      } else {
        this.startTick()
      }
    },
    finishFocus() {
      if (!this.data.isRunning) {
        return
      }

      wx.showModal({
        title: '结束计时',
        content: '结束后再选择标签，并填写这次具体做了什么。',
        confirmText: '停止',
        success: (res) => {
          if (res.confirm) {
            this.stopTick()
            this.setData({
              isRunning: false,
              isPaused: false,
              isFinishPanelVisible: true,
            })
          }
        },
      })
    },
    startTick() {
      this.stopTick()
      this.timer = setInterval(() => {
        if (this.data.timerType === 'countdown') {
          const remainingSeconds = this.data.remainingSeconds - 1

          if (remainingSeconds <= 0) {
            this.stopTick()
            this.setData({
              remainingSeconds: 0,
              timeText: formatSeconds(0),
              isRunning: false,
              isPaused: false,
              isFinishPanelVisible: true,
            })
            return
          }

          this.setData({
            remainingSeconds,
            elapsedSeconds: this.data.elapsedSeconds + 1,
            timeText: formatSeconds(remainingSeconds),
          })
          return
        }

        const elapsedSeconds = this.data.elapsedSeconds + 1
        this.setData({
          elapsedSeconds,
          timeText: formatSeconds(elapsedSeconds),
        })
      }, 1000) as unknown as number
    },
    stopTick() {
      if (!this.timer) {
        return
      }

      clearInterval(this.timer)
      this.timer = 0
    },
    selectTag(e: WechatMiniprogram.BaseEvent) {
      this.setData({
        selectedTag: e.currentTarget.dataset.tag,
      })
    },
    onDetailInput(e: WechatMiniprogram.Input) {
      this.setData({
        detail: e.detail.value,
      })
    },
    closeFinishPanel() {
      this.setData({
        isFinishPanelVisible: false,
      })
    },
    saveCompletion() {
      this.setData({
        isFinishPanelVisible: false,
      })
      wx.showToast({
        title: '已记录',
        icon: 'success',
      })
    },
    noop() {
      // Keep modal gestures from scrolling the page behind it.
    },
  },
})
