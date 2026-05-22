Component({
  data: {
    range: '本周',
    cards: [
      { label: '总专注', value: '8h 20m' },
      { label: '计时完成', value: '12' },
      { label: '手动完成', value: '7' },
    ],
    tagStats: [
      { tag: '英语', time: '3h 20m', percent: 78, color: '#6FB67B' },
      { tag: '写代码', time: '2h 40m', percent: 62, color: '#7DA7D9' },
      { tag: '运动', time: '1h 30m', percent: 36, color: '#F1B86A' },
    ],
    tagPieStyle: 'background: conic-gradient(#6FB67B 0 44%, #7DA7D9 44% 80%, #F1B86A 80% 100%);',
    tagPieLegend: [
      { tag: '英语', time: '3h 20m', share: '44%', color: '#6FB67B' },
      { tag: '写代码', time: '2h 40m', share: '36%', color: '#7DA7D9' },
      { tag: '运动', time: '1h 30m', share: '20%', color: '#F1B86A' },
    ],
  },
})
