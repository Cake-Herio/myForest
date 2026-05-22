Component({
  data: {
    monthTitle: '2026 年 5 月',
    filters: [
      { key: 'all', label: '全部', avatars: ['我', 'W'] },
      { key: 'me', label: '我', avatars: ['我'] },
      { key: 'partner', label: '对方', avatars: ['W'] },
    ],
    activeFilter: 'all',
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    days: [
      { day: 27, muted: true, plans: [], overdue: false },
      { day: 28, muted: true, plans: [], overdue: false },
      { day: 29, muted: true, plans: [], overdue: false },
      { day: 30, muted: true, plans: [], overdue: false },
      { day: 1, plans: [], overdue: false },
      { day: 2, plans: [{ avatar: '我', tag: '阅读', color: 'green' }], overdue: false },
      { day: 3, plans: [], overdue: false },
      { day: 4, plans: [], overdue: false },
      { day: 5, plans: [{ avatar: 'W', tag: '运动', color: 'blue' }], overdue: false },
      { day: 6, plans: [], overdue: false },
      { day: 7, plans: [{ avatar: '我', tag: '英语', color: 'green' }], overdue: false },
      { day: 8, plans: [], overdue: false },
      { day: 9, plans: [], overdue: false },
      { day: 10, plans: [{ avatar: 'W', tag: '代码', color: 'blue' }], overdue: false },
      { day: 11, plans: [], overdue: false },
      { day: 12, plans: [], overdue: false },
      { day: 13, plans: [{ avatar: '我', tag: '英语', color: 'green' }], overdue: false },
      { day: 14, plans: [], overdue: false },
      { day: 15, plans: [], overdue: false },
      { day: 16, plans: [{ avatar: 'W', tag: '复盘', color: 'blue' }], overdue: false },
      { day: 17, plans: [], overdue: false },
      { day: 18, plans: [], overdue: false },
      { day: 19, plans: [{ avatar: '我', tag: '英语', color: 'green' }], overdue: false },
      { day: 20, plans: [{ avatar: 'W', tag: '代码', color: 'blue' }], overdue: false },
      { day: 21, plans: [], overdue: false },
      { day: 22, selected: true, plans: [{ avatar: '我', tag: '英语', color: 'green' }, { avatar: 'W', tag: '运动', color: 'blue' }], more: 1, overdue: true },
      { day: 23, plans: [{ avatar: '我', tag: '阅读', color: 'green' }], overdue: false },
      { day: 24, plans: [], overdue: false },
      { day: 25, plans: [], overdue: false },
      { day: 26, plans: [{ avatar: 'W', tag: '运动', color: 'blue' }], overdue: false },
      { day: 27, plans: [], overdue: false },
      { day: 28, plans: [{ avatar: '我', tag: '写作', color: 'green' }], overdue: false },
      { day: 29, plans: [], overdue: false },
      { day: 30, plans: [{ avatar: '我', tag: '英语', color: 'green' }, { avatar: 'W', tag: '代码', color: 'blue' }], overdue: false },
      { day: 31, plans: [], overdue: false },
      { day: 1, muted: true, plans: [], overdue: false },
      { day: 2, muted: true, plans: [], overdue: false },
      { day: 3, muted: true, plans: [], overdue: false },
      { day: 4, muted: true, plans: [], overdue: false },
      { day: 5, muted: true, plans: [], overdue: false },
      { day: 6, muted: true, plans: [], overdue: false },
      { day: 7, muted: true, plans: [], overdue: false },
    ],
  },
  methods: {
    setFilter(e: WechatMiniprogram.BaseEvent) {
      const filter = e.currentTarget.dataset.filter
      this.setData({ activeFilter: filter })
    },
    goDay() {
      wx.navigateTo({
        url: '/pages/day/day',
      })
    },
    addPlan() {
      wx.showToast({
        title: '后续接入新增计划',
        icon: 'none',
      })
    },
  },
})
