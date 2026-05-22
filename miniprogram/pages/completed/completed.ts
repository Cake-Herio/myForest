Component({
  data: {
    filters: ['全部', '手动', '计时'],
    activeFilter: '全部',
    records: [
      { tag: '英语', detail: '背完 Unit 3 单词', user: '我', time: '09:40', duration: '40 分钟', type: '计时', overdue: true },
      { tag: '阅读', detail: '读完一章', user: 'W', time: '12:20', duration: '-', type: '手动', overdue: false },
      { tag: '写代码', detail: '整理 README 页面设计', user: '我', time: '16:30', duration: '60 分钟', type: '计时', overdue: false },
    ],
  },
  methods: {
    setFilter(e: WechatMiniprogram.BaseEvent) {
      this.setData({ activeFilter: e.currentTarget.dataset.filter })
    },
  },
})
