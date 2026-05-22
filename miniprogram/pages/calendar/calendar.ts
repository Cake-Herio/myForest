import { addPlan as savePlan, formatDate, getPlans, getToday, type OwnerKey, type Plan } from '../../utils/data'

interface CalendarPlanView {
  avatar: string
  tag: string
  color: 'green' | 'blue'
}

interface CalendarDayView {
  date: string
  day: number
  muted: boolean
  selected: boolean
  plans: CalendarPlanView[]
  more: number
  overdue: boolean
}

const selectedDate = getToday()
const initialMonth = new Date(`${selectedDate}T00:00:00`)
const minYear = 1970
const maxYear = 2100
const years = Array.from({ length: maxYear - minYear + 1 }, (_value, index) => minYear + index)
const months = Array.from({ length: 12 }, (_value, index) => `${index + 1}月`)

const filterPlans = (plans: Plan[], filter: string) => {
  if (filter === 'me' || filter === 'partner') {
    return plans.filter((plan) => plan.ownerKey === filter as OwnerKey)
  }

  return plans
}

const buildMonthTitle = (year: number, month: number) => `${year} 年 ${month + 1} 月`

const buildCalendarDays = (plans: Plan[], activeFilter: string, year: number, month: number): CalendarDayView[] => {
  const firstDate = new Date(year, month, 1)
  const startOffset = (firstDate.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - startOffset)
  const filteredPlans = filterPlans(plans, activeFilter)

  return Array.from({ length: 42 }, (_value, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)

    const dateText = formatDate(date)
    const dayPlans = filteredPlans.filter((plan) => plan.date === dateText && plan.status !== 'cancelled')
    const visiblePlans = dayPlans.slice(0, 2).map((plan) => ({
      avatar: plan.ownerAvatar,
      tag: plan.tag,
      color: plan.color,
    }))

    return {
      date: dateText,
      day: date.getDate(),
      muted: date.getMonth() !== month,
      selected: dateText === selectedDate,
      plans: visiblePlans,
      more: Math.max(dayPlans.length - visiblePlans.length, 0),
      overdue: dayPlans.some((plan) => plan.status === 'overdue'),
    }
  })
}

Component({
  data: {
    currentYear: initialMonth.getFullYear(),
    currentMonth: initialMonth.getMonth(),
    monthTitle: buildMonthTitle(initialMonth.getFullYear(), initialMonth.getMonth()),
    isMonthPickerVisible: false,
    isAddPlanVisible: false,
    isTagCreatorVisible: false,
    pickerYear: initialMonth.getFullYear(),
    pickerMonth: initialMonth.getMonth(),
    pickerValue: [initialMonth.getFullYear() - minYear, initialMonth.getMonth()],
    years,
    months,
    filters: [
      { key: 'all', label: '全部', avatars: ['我', 'W'] },
      { key: 'me', label: '我', avatars: ['我'] },
      { key: 'partner', label: '对方', avatars: ['W'] },
    ],
    activeFilter: 'all',
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    days: [] as CalendarDayView[],
    newPlan: {
      ownerKey: 'me',
      title: '',
      tag: '英语',
      date: selectedDate,
      startTime: '',
      endTime: '',
      timeText: '今天',
      estimatedMinutes: '',
    },
    quickTags: [
      { name: '英语', color: '#6FB67B' },
      { name: '写代码', color: '#7DA7D9' },
      { name: '阅读', color: '#9BCB8C' },
      { name: '运动', color: '#F1B86A' },
    ],
    tagColors: ['#6FB67B', '#7DA7D9', '#F1B86A', '#E57373', '#A58BD8'],
    newTag: {
      name: '',
      color: '#6FB67B',
    },
  },
  lifetimes: {
    attached() {
      this.refreshCalendar()
    },
  },
  pageLifetimes: {
    show() {
      this.refreshCalendar()
    },
  },
  methods: {
    refreshCalendar() {
      const { currentYear, currentMonth } = this.data

      this.setData({
        monthTitle: buildMonthTitle(currentYear, currentMonth),
        days: buildCalendarDays(getPlans(), this.data.activeFilter, currentYear, currentMonth),
      })
    },
    setFilter(e: WechatMiniprogram.BaseEvent) {
      const filter = e.currentTarget.dataset.filter
      this.setData({
        activeFilter: filter,
      })
      this.refreshCalendar()
    },
    changeMonth(e: WechatMiniprogram.BaseEvent) {
      const offset = Number(e.currentTarget.dataset.offset)
      const nextMonth = new Date(this.data.currentYear, this.data.currentMonth + offset, 1)

      this.setData({
        currentYear: nextMonth.getFullYear(),
        currentMonth: nextMonth.getMonth(),
      })
      this.refreshCalendar()
    },
    openMonthPicker() {
      this.setData({
        isMonthPickerVisible: true,
        pickerYear: this.data.currentYear,
        pickerMonth: this.data.currentMonth,
        pickerValue: [this.data.currentYear - minYear, this.data.currentMonth],
      })
    },
    closeMonthPicker() {
      this.setData({
        isMonthPickerVisible: false,
      })
    },
    onPickerChange(e: WechatMiniprogram.PickerViewChange) {
      const [yearIndex, monthIndex] = e.detail.value
      this.setData({
        pickerValue: e.detail.value,
        pickerYear: years[yearIndex],
        pickerMonth: monthIndex,
      })
    },
    confirmMonthPicker() {
      this.setData({
        currentYear: this.data.pickerYear,
        currentMonth: this.data.pickerMonth,
        isMonthPickerVisible: false,
      })
      this.refreshCalendar()
    },
    noop() {
      // Prevent picker panel taps from closing the overlay.
    },
    goDay(e: WechatMiniprogram.BaseEvent) {
      const date = e.currentTarget.dataset.date
      wx.navigateTo({
        url: `/pages/day/day?date=${date}`,
      })
    },
    addPlan() {
      this.setData({
        isAddPlanVisible: true,
        newPlan: {
          ownerKey: 'me',
          title: '',
          tag: '英语',
          date: selectedDate,
          startTime: '',
          endTime: '',
          timeText: '今天',
          estimatedMinutes: '',
        },
      })
    },
    closeAddPlan() {
      this.setData({
        isAddPlanVisible: false,
      })
    },
    choosePlanOwner(e: WechatMiniprogram.BaseEvent) {
      this.setData({
        'newPlan.ownerKey': e.currentTarget.dataset.owner,
      })
    },
    choosePlanTag(e: WechatMiniprogram.BaseEvent) {
      this.setData({
        'newPlan.tag': e.currentTarget.dataset.tag,
      })
    },
    openTagCreator() {
      this.setData({
        isTagCreatorVisible: true,
        newTag: {
          name: '',
          color: '#6FB67B',
        },
      })
    },
    closeTagCreator() {
      this.setData({
        isTagCreatorVisible: false,
      })
    },
    onTagNameInput(e: WechatMiniprogram.Input) {
      this.setData({
        'newTag.name': e.detail.value,
      })
    },
    chooseTagColor(e: WechatMiniprogram.BaseEvent) {
      this.setData({
        'newTag.color': e.currentTarget.dataset.color,
      })
    },
    saveNewTag() {
      const name = this.data.newTag.name.trim()

      if (!name) {
        wx.showToast({
          title: '请输入标签名',
          icon: 'none',
        })
        return
      }

      const exists = this.data.quickTags.some((tag) => tag.name === name)
      const quickTags = exists ? this.data.quickTags : [...this.data.quickTags, { name, color: this.data.newTag.color }]

      this.setData({
        quickTags,
        isTagCreatorVisible: false,
        'newPlan.tag': name,
      })
    },
    onPlanInput(e: WechatMiniprogram.Input) {
      const field = e.currentTarget.dataset.field
      this.setData({
        [`newPlan.${field}`]: e.detail.value,
      })
    },
    saveNewPlan() {
      const plan = this.data.newPlan

      if (!plan.title.trim()) {
        wx.showToast({
          title: '请输入计划标题',
          icon: 'none',
        })
        return
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(plan.date)) {
        wx.showToast({
          title: '日期格式为 YYYY-MM-DD',
          icon: 'none',
        })
        return
      }

      savePlan({
        ownerKey: plan.ownerKey as OwnerKey,
        title: plan.title.trim(),
        tag: plan.tag,
        date: plan.date,
        startTime: plan.startTime.trim(),
        endTime: plan.endTime.trim(),
        timeText: plan.timeText.trim() || '今天',
        estimatedMinutes: plan.estimatedMinutes ? Number(plan.estimatedMinutes) : null,
      })

      const nextDate = new Date(`${plan.date}T00:00:00`)
      this.setData({
        isAddPlanVisible: false,
        currentYear: nextDate.getFullYear(),
        currentMonth: nextDate.getMonth(),
      })
      this.refreshCalendar()
      wx.showToast({
        title: '已新增',
        icon: 'success',
      })
    },
  },
})
