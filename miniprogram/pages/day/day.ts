Component({
  data: {
    dateTitle: '5月22日 星期五',
    filters: [
      { key: 'all', label: '全部', avatars: ['我', 'W'] },
      { key: 'me', label: '我', avatars: ['我'] },
      { key: 'partner', label: '对方', avatars: ['W'] },
    ],
    activeFilter: 'all',
    timelinePlans: [
      { id: 'timeline-1', time: '09:00 - 10:00', owner: '我', title: '背英语单词', tag: '英语', status: '逾期', color: 'green' },
      { id: 'timeline-2', time: '19:30 - 20:30', owner: 'W', title: '项目复盘', tag: '写代码', status: '待开始', color: 'blue' },
    ],
    dayItems: [
      { id: 'day-1', time: '今天', owner: '我', title: '阅读一章书', tag: '阅读', status: '待开始', color: 'green' },
      { id: 'day-2', time: '晚上', owner: 'W', title: '运动半小时', tag: '运动', status: '进行中', color: 'blue' },
    ],
  },
  methods: {
    setFilter(e: WechatMiniprogram.BaseEvent) {
      const filter = e.currentTarget.dataset.filter
      this.setData({ activeFilter: filter })
    },
    goFocus() {
      wx.navigateTo({
        url: '/pages/focus/focus',
      })
    },
    completePlan() {
      wx.showModal({
        title: '标记完成',
        content: '确认后计划会打勾，并写入已完成表。',
        confirmText: '确认',
      })
    },
    deletePlan(e: WechatMiniprogram.BaseEvent) {
      const { id, list } = e.currentTarget.dataset

      wx.showModal({
        title: '删除计划',
        content: '删除后这条计划会从计划表移除，不会进入已完成表。',
        confirmText: '删除',
        confirmColor: '#D96565',
        success: (res) => {
          if (!res.confirm) {
            return
          }

          const key = list === 'day' ? 'dayItems' : 'timelinePlans'
          const nextPlans = (this.data[key] as Array<{ id: string }>).filter((item) => item.id !== id)

          this.setData({
            [key]: nextPlans,
          })
        },
      })
    },
  },
})
