import { completePlan, deletePlan, getPlansByDate, getToday, type OwnerKey, type Plan } from '../../utils/data'

interface DayPlanView {
  id: string
  time: string
  owner: string
  title: string
  tag: string
  status: string
  color: 'green' | 'blue'
}

const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const statusTextMap = {
  pending: '待开始',
  in_progress: '进行中',
  completed: '已完成',
  overdue: '逾期',
  cancelled: '已取消',
}

const filterPlans = (plans: Plan[], filter: string) => {
  if (filter === 'me' || filter === 'partner') {
    return plans.filter((plan) => plan.ownerKey === filter as OwnerKey)
  }

  return plans
}

const formatDateTitle = (dateText: string) => {
  const date = new Date(`${dateText}T00:00:00`)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`
}

const toDayPlanView = (plan: Plan): DayPlanView => ({
  id: plan.id,
  time: plan.startTime && plan.endTime ? `${plan.startTime} - ${plan.endTime}` : plan.timeText || '今天',
  owner: plan.ownerName,
  title: plan.title,
  tag: plan.tag,
  status: statusTextMap[plan.status],
  color: plan.color,
})

Component({
  data: {
    dateTitle: '5月22日 星期五',
    selectedDate: getToday(),
    filters: [
      { key: 'all', label: '全部', avatars: ['我', 'W'] },
      { key: 'me', label: '我', avatars: ['我'] },
      { key: 'partner', label: '对方', avatars: ['W'] },
    ],
    activeFilter: 'all',
    timelinePlans: [] as DayPlanView[],
    dayItems: [] as DayPlanView[],
  },
  lifetimes: {
    attached() {
      this.refreshPlans()
    },
  },
  pageLifetimes: {
    show() {
      this.refreshPlans()
    },
  },
  methods: {
    onLoad(query: { date?: string }) {
      const selectedDate = query.date || getToday()
      this.setData({
        selectedDate,
        dateTitle: formatDateTitle(selectedDate),
      })
      this.refreshPlans()
    },
    refreshPlans() {
      const plans = filterPlans(getPlansByDate(this.data.selectedDate), this.data.activeFilter)
      const activePlans = plans.filter((plan) => plan.status !== 'completed')

      this.setData({
        dateTitle: formatDateTitle(this.data.selectedDate),
        timelinePlans: activePlans.filter((plan) => plan.startTime && plan.endTime).map(toDayPlanView),
        dayItems: activePlans.filter((plan) => !plan.startTime || !plan.endTime).map(toDayPlanView),
      })
    },
    setFilter(e: WechatMiniprogram.BaseEvent) {
      const filter = e.currentTarget.dataset.filter
      this.setData({ activeFilter: filter })
      this.refreshPlans()
    },
    goFocus() {
      wx.navigateTo({
        url: '/pages/focus/focus',
      })
    },
    completePlan(e: WechatMiniprogram.BaseEvent) {
      const id = e.currentTarget.dataset.id

      wx.showModal({
        title: '标记完成',
        content: '确认后计划会打勾，并写入已完成表。',
        confirmText: '确认',
        success: (res) => {
          if (!res.confirm) {
            return
          }

          completePlan(id)
          this.refreshPlans()
          wx.showToast({
            title: '已完成',
            icon: 'success',
          })
        },
      })
    },
    deletePlan(e: WechatMiniprogram.BaseEvent) {
      const { id } = e.currentTarget.dataset

      wx.showModal({
        title: '删除计划',
        content: '删除后这条计划会从计划表移除，不会进入已完成表。',
        confirmText: '删除',
        confirmColor: '#D96565',
        success: (res) => {
          if (!res.confirm) {
            return
          }

          deletePlan(id)
          this.refreshPlans()
          wx.showToast({
            title: '已删除',
            icon: 'none',
          })
        },
      })
    },
  },
})
