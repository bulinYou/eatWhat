// history.ts
const calendarDays = [
  { day: '29', otherMonth: true },
  { day: '30', otherMonth: true },
  { day: '1' },
  { day: '2' },
  { day: '3' },
  { day: '4' },
  { day: '5' },
  { day: '6' },
  { day: '7' },
  { day: '8' },
  { day: '9' },
  { day: '10' },
  { day: '11' },
  { day: '12' },
  { day: '13' },
  { day: '14' },
  { day: '15' },
  { day: '16' },
  { day: '17' },
  { day: '18' },
  { day: '19' },
  { day: '20' },
  { day: '21', hasRecord: true },
  { day: '22', hasRecord: true },
  { day: '23', hasRecord: true },
  { day: '24', hasRecord: true, selected: true },
  { day: '25' },
  { day: '26' },
  { day: '27' },
  { day: '28' },
  { day: '29' },
  { day: '30' },
  { day: '31' },
  { day: '1', otherMonth: true },
  { day: '2', otherMonth: true },
]

Page({
  data: {
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv3K5YH1u1dWr6os2w5CHsjEVAUVwrWGZOR-CyqwIxmPgR7xn9ZrLsFyG0_2lTzUEgURyN3vOrGTomu0N-Q7FZKHH5H9yrwoU9b8u26W1FjoWxGjnv_OuFtZW99XA7Lhtw-pJOO59xsbKhwlhy_1twuSNSzuJp7dUcpgwdis7ITFu6JdiQ2FpzFeoAzH6gjzohswtkml5HV1rYsG9N5nEtRsLDNw1LaoZrhi1-k57oe-Rsht4OpbByn0scmOgRlDkhY-gAOUxEpuHj',
    selectedDay: '24',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: calendarDays,
  },

  selectDay(e: any) {
    const { day, otherMonth } = e.currentTarget.dataset
    if (otherMonth) return

    const newCalendarDays = this.data.calendarDays.map((item: any) => ({
      ...item,
      selected: item.day === day,
    }))

    this.setData({
      selectedDay: day,
      calendarDays: newCalendarDays,
    })
  },

  goBack() {
    wx.navigateBack()
  },
})
