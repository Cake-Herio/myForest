export type OwnerKey = 'me' | 'partner'
export type PlanStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled'
export type CompletionMode = 'manual' | 'timed'

export interface Plan {
  id: string
  ownerKey: OwnerKey
  ownerName: string
  ownerAvatar: string
  color: 'green' | 'blue'
  title: string
  tag: string
  date: string | null
  startTime: string | null
  endTime: string | null
  timeText: string | null
  estimatedMinutes: number | null
  completionMode: CompletionMode
  status: PlanStatus
  createdAt: number
  updatedAt: number
}

export interface CompletedRecord {
  id: string
  planId: string
  ownerKey: OwnerKey
  title: string
  tag: string
  detail: string
  completedAt: number
  completionMode: CompletionMode
  actualMinutes: number | null
  wasOverdue: boolean
}

interface AppData {
  plans: Plan[]
  completedRecords: CompletedRecord[]
}

const STORAGE_KEY = 'myforest_local_data_v1'
const TODAY = '2026-05-22'

const now = Date.now()

const seedData: AppData = {
  plans: [
    {
      id: 'plan-english-morning',
      ownerKey: 'me',
      ownerName: '我',
      ownerAvatar: '我',
      color: 'green',
      title: '背英语单词',
      tag: '英语',
      date: TODAY,
      startTime: '09:00',
      endTime: '10:00',
      timeText: null,
      estimatedMinutes: 60,
      completionMode: 'manual',
      status: 'overdue',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'plan-code-evening',
      ownerKey: 'partner',
      ownerName: 'W',
      ownerAvatar: 'W',
      color: 'blue',
      title: '项目复盘',
      tag: '写代码',
      date: TODAY,
      startTime: '19:30',
      endTime: '20:30',
      timeText: null,
      estimatedMinutes: 60,
      completionMode: 'manual',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'plan-read-today',
      ownerKey: 'me',
      ownerName: '我',
      ownerAvatar: '我',
      color: 'green',
      title: '阅读一章书',
      tag: '阅读',
      date: TODAY,
      startTime: null,
      endTime: null,
      timeText: '今天',
      estimatedMinutes: 30,
      completionMode: 'manual',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'plan-sport-night',
      ownerKey: 'partner',
      ownerName: 'W',
      ownerAvatar: 'W',
      color: 'blue',
      title: '运动半小时',
      tag: '运动',
      date: TODAY,
      startTime: null,
      endTime: null,
      timeText: '晚上',
      estimatedMinutes: 30,
      completionMode: 'manual',
      status: 'in_progress',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'plan-english-23',
      ownerKey: 'me',
      ownerName: '我',
      ownerAvatar: '我',
      color: 'green',
      title: '英语阅读',
      tag: '英语',
      date: '2026-05-23',
      startTime: null,
      endTime: null,
      timeText: '今天',
      estimatedMinutes: 40,
      completionMode: 'manual',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'plan-code-30',
      ownerKey: 'partner',
      ownerName: 'W',
      ownerAvatar: 'W',
      color: 'blue',
      title: '代码整理',
      tag: '写代码',
      date: '2026-05-30',
      startTime: '10:00',
      endTime: '11:00',
      timeText: null,
      estimatedMinutes: 60,
      completionMode: 'manual',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
  ],
  completedRecords: [
    {
      id: 'record-english',
      planId: 'plan-old-english',
      ownerKey: 'me',
      title: '背英语单词',
      tag: '英语',
      detail: '背完 Unit 3 单词',
      completedAt: now,
      completionMode: 'timed',
      actualMinutes: 40,
      wasOverdue: true,
    },
    {
      id: 'record-read',
      planId: 'plan-old-read',
      ownerKey: 'partner',
      title: '阅读',
      tag: '阅读',
      detail: '读完一章',
      completedAt: now,
      completionMode: 'manual',
      actualMinutes: null,
      wasOverdue: false,
    },
  ],
}

export const getToday = () => TODAY

export const ensureLocalData = () => {
  const data = wx.getStorageSync(STORAGE_KEY) as AppData | ''

  if (!data) {
    wx.setStorageSync(STORAGE_KEY, seedData)
  }
}

export const getLocalData = (): AppData => {
  ensureLocalData()
  return wx.getStorageSync(STORAGE_KEY) as AppData
}

export const saveLocalData = (data: AppData) => {
  wx.setStorageSync(STORAGE_KEY, data)
}

export const getPlans = () => getLocalData().plans

export const getCompletedRecords = () => getLocalData().completedRecords

export const getPlansByDate = (date: string) => getPlans().filter((plan) => plan.date === date && plan.status !== 'cancelled')

export const addPlan = (input: {
  ownerKey: OwnerKey
  title: string
  tag: string
  date: string
  startTime?: string
  endTime?: string
  timeText?: string
  estimatedMinutes?: number | null
}) => {
  const data = getLocalData()
  const createdAt = Date.now()
  const isMe = input.ownerKey === 'me'
  const plan: Plan = {
    id: `plan-${createdAt}`,
    ownerKey: input.ownerKey,
    ownerName: isMe ? '我' : 'W',
    ownerAvatar: isMe ? '我' : 'W',
    color: isMe ? 'green' : 'blue',
    title: input.title,
    tag: input.tag,
    date: input.date,
    startTime: input.startTime || null,
    endTime: input.endTime || null,
    timeText: input.startTime && input.endTime ? null : input.timeText || '今天',
    estimatedMinutes: input.estimatedMinutes || null,
    completionMode: 'manual',
    status: 'pending',
    createdAt,
    updatedAt: createdAt,
  }

  saveLocalData({
    ...data,
    plans: [plan, ...data.plans],
  })

  return plan
}

export const deletePlan = (planId: string) => {
  const data = getLocalData()
  saveLocalData({
    ...data,
    plans: data.plans.filter((plan) => plan.id !== planId),
  })
}

export const completePlan = (planId: string) => {
  const data = getLocalData()
  const target = data.plans.find((plan) => plan.id === planId)

  if (!target) {
    return
  }

  const completedAt = Date.now()
  const record: CompletedRecord = {
    id: `record-${completedAt}`,
    planId,
    ownerKey: target.ownerKey,
    title: target.title,
    tag: target.tag,
    detail: target.title,
    completedAt,
    completionMode: target.completionMode,
    actualMinutes: null,
    wasOverdue: target.status === 'overdue',
  }

  saveLocalData({
    plans: data.plans.map((plan) => plan.id === planId ? { ...plan, status: 'completed', updatedAt: completedAt } : plan),
    completedRecords: [record, ...data.completedRecords],
  })
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}
