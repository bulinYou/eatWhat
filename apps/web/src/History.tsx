import { useState } from 'react'

interface HistoryProps {
  onBack: () => void
}

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

function History({ onBack }: HistoryProps) {
  const [selectedDay, setSelectedDay] = useState('24')

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--on-surface)] font-body pb-8 text-[0.9375rem] leading-[1.4]">
      <header className="sticky top-0 z-50 bg-[var(--background)] flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--surface-container-low)] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-display text-xl font-bold text-[var(--primary)] tracking-tight">
            历史记录
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 rounded-full text-[var(--primary)] hover:bg-[var(--surface-container-low)] transition-colors">
            <span className="material-symbols-outlined">calendar_month</span>
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[var(--surface-container)]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv3K5YH1u1dWr6os2w5CHsjEVAUVwrWGZOR-CyqwIxmPgR7xn9ZrLsFyG0_2lTzUEgURyN3vOrGTomu0N-Q7FZKHH5H9yrwoU9b8u26W1FjoWxGjnv_OuFtZW99XA7Lhtw-pJOO59xsbKhwlhy_1twuSNSzuJp7dUcpgwdis7ITFu6JdiQ2FpzFeoAzH6gjzohswtkml5HV1rYsG9N5nEtRsLDNw1LaoZrhi1-k57oe-Rsht4OpbByn0scmOgRlDkhY-gAOUxEpuHj"
              alt="user profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 flex flex-col gap-5 pt-2">
        <section className="bg-[var(--surface-container-lowest)] rounded-[var(--radius-default)] p-5 shadow-[0_4px_12px_rgba(25,28,27,0.04)]">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-lg font-extrabold text-[var(--on-surface)]">
              2024年10月
            </h2>
            <div className="flex gap-2">
              <button className="p-1 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)]">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-1 rounded-lg text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)]">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <div key={d} className="text-center text-xs font-bold text-[var(--outline)] py-2">
                {d}
              </div>
            ))}
            {calendarDays.map((item, idx) => (
              <button
                key={idx}
                onClick={() => !item.otherMonth && setSelectedDay(item.day)}
                className={`aspect-square flex items-center justify-center text-sm font-medium rounded-xl transition-all relative ${
                  item.otherMonth
                    ? 'text-[var(--outline-variant)]'
                    : item.selected
                    ? 'bg-[var(--primary)] text-white font-bold'
                    : 'text-[var(--on-surface)] hover:bg-[var(--surface-container-low)]'
                }`}
              >
                {item.day}
                {item.hasRecord && !item.selected && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[var(--primary-container)]" />
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-[var(--surface-container-high)] rounded-[var(--radius-default)] px-4 h-14 flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--on-surface-variant)]">search</span>
          <input
            type="text"
            placeholder="搜索过往记录..."
            className="bg-transparent border-none outline-none flex-1 text-[var(--on-surface)] font-medium placeholder:text-[rgba(66,73,58,0.5)]"
          />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-xl font-extrabold text-[var(--on-surface)]">
              历史详情
            </h2>
            <span className="text-[var(--primary)] font-bold text-sm">
              2024年10月{selectedDay}日
            </span>
          </div>

          <div className="bg-[var(--surface-container-lowest)] rounded-[var(--radius-default)] p-6 shadow-[0_12px_32px_rgba(25,28,27,0.04)] flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[var(--on-surface-variant)] text-xs font-bold uppercase tracking-widest">
                  选定日期
                </p>
                <p className="font-display text-2xl font-extrabold mt-1">
                  10月{selectedDay}日
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-4xl font-extrabold text-[var(--primary)] tracking-tight">
                  1,840
                </p>
                <p className="text-[var(--on-surface-variant)] text-xs font-medium">
                  千卡摄入
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-[rgba(194,201,182,0.1)]">
              <div className="flex -space-x-2 ml-2">
                <div className="w-8 h-8 rounded-full border-2 border-[var(--surface-container-lowest)] bg-[var(--primary-fixed)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[var(--on-primary-fixed)]" style={{ fontSize: '14px' }}>
                    egg
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-[var(--surface-container-lowest)] bg-[var(--secondary-fixed)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[var(--on-secondary-fixed)]" style={{ fontSize: '14px' }}>
                    restaurant
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-[var(--surface-container-lowest)] bg-[var(--tertiary-fixed)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[var(--on-tertiary-fixed)]" style={{ fontSize: '14px' }}>
                    local_drink
                  </span>
                </div>
              </div>
              <p className="text-[var(--on-surface-variant)] text-sm font-medium">
                高蛋白 • 富含膳食纤维
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface-container-lowest)] rounded-[var(--radius-default)] p-6 shadow-[0_12px_32px_rgba(25,28,27,0.04)] flex items-center gap-6 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkZ7hBe6Vn8i5gzlI0o9oDrxH6k85Qrs-XdMHotjF_ASgUyj2PgcgK4U_Mw-Q3gsDuhOL-qMBJd86Q09e5KA3alOPzMqqxbYqwHso_FXqFJQLp3Kz8tXO3B7wtcYyDysT615RKpoz3olv7UJAzPPIDBDzRsQ6cSt24rfF50SItbMZ-vR7Jk1FVeiUex5Waq9sGuCIhALFDTF8gwW1D6Ylt9MHj3sAE3_YxZHRxJxWkb_QReL4e3CJJbcyNd9j4s4bOvb6C5IrD2WOC"
                alt="food photo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-[var(--on-surface-variant)] text-xs font-bold uppercase tracking-widest">
                早餐饮食
              </p>
              <h3 className="font-display text-xl font-extrabold mt-1">
                全麦面包 & 鳄梨
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-display text-xl font-extrabold text-[var(--primary)]">
                  420
                </span>
                <span className="text-[var(--on-surface-variant)] text-xs">千卡</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[var(--outline-variant)]">
              chevron_right
            </span>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-[var(--primary-container)] rounded-[var(--radius-default)] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">
              月度平均
            </p>
            <div className="flex items-end gap-2 mt-2">
              <span className="font-display text-5xl font-extrabold">1,895</span>
              <span className="text-sm font-medium mb-1">千卡 / 天</span>
            </div>
          </div>
          <div className="bg-[var(--surface-container-low)] rounded-[var(--radius-default)] p-6 flex flex-col justify-between aspect-square">
            <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--secondary)' }}>
              trending_up
            </span>
            <div>
              <p className="text-[var(--on-surface-variant)] text-xs font-bold uppercase tracking-wider">
                打卡坚持率
              </p>
              <p className="font-display text-2xl font-bold text-[var(--on-surface)] mt-1">
                88%
              </p>
            </div>
          </div>
          <div className="bg-[var(--surface-container-low)] rounded-[var(--radius-default)] p-6 flex flex-col justify-between aspect-square">
            <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--primary)' }}>
              check_circle
            </span>
            <div>
              <p className="text-[var(--on-surface-variant)] text-xs font-bold uppercase tracking-wider">
                目标达成
              </p>
              <p className="font-display text-2xl font-bold text-[var(--on-surface)] mt-1">
                22 天
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default History
