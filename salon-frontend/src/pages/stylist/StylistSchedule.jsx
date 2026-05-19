import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../api/axios'
import { Card, CardBody } from '../../components/ui/Card'

export default function StylistSchedule() {
  const { t } = useTranslation()
  const [workHours, setWorkHours] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get('/StylistWorkHours/my-work-hours') 
        setWorkHours(response.data)
      } catch (error) {
        console.error('Error fetching schedule:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  const daysOrder = [0, 1, 2, 3, 4, 5, 6] 

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {t('stylist.schedule.title')}
        </h1>
        <p className="text-zinc-500 mt-2">{t('stylist.schedule.subtitle')}</p>
      </header>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {daysOrder.map(dayIndex => {
            const dayData = workHours.find(w => w.dayOfWeek === dayIndex)
            const isOff = !dayData || dayData.isOff

            return (
              <Card key={dayIndex} className={`${isOff ? 'opacity-60 bg-zinc-50 dark:bg-zinc-900/50' : 'hover:border-primary/30 transition-colors'}`}>
                <CardBody className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${isOff ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500' : 'bg-primary/10 text-primary'}`}>
                      {t(`common.daysShort.${dayIndex}`)}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100">
                        {t(`common.days.${dayIndex}`)}
                      </h3>
                      {isOff && <span className="text-xs font-medium text-red-500 uppercase tracking-wider">{t('stylist.schedule.dayOff')}</span>}
                    </div>
                  </div>

                  {!isOff && (
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">{t('stylist.schedule.from')}</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{dayData.startTime.substring(0, 5)}</p>
                      </div>
                      <div className="w-8 h-px bg-zinc-200 dark:bg-zinc-800" />
                      <div className="text-center">
                        <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">{t('stylist.schedule.to')}</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{dayData.endTime.substring(0, 5)}</p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}