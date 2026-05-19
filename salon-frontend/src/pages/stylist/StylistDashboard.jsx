import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../api/axios'
import { Card, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function StylistDashboard() {
  const { t } = useTranslation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])

  const fetchMySchedule = async () => {
    setLoading(true) 
    try {
      const response = await api.get('/Booking/stylist/all', {
        params: { date: selectedDate }
      })
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching stylist bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMySchedule()
  }, [selectedDate])

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await api.put(`/Booking/${id}/status`, { status: newStatus })
      await fetchMySchedule() 
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const upcomingCount = bookings.filter(b => b.status.toLowerCase() === 'pending' || b.status.toLowerCase() === 'confirmed').length

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {t('stylist.dashboard.welcome')}
          </h1>
          <p className="text-zinc-500 mt-1">{t('stylist.dashboard.todaySubtitle')}</p>
        </div>
        <div className="flex gap-4">
          <Card className="bg-primary/5 border-primary/10 px-6 py-2 shadow-none">
            <p className="text-xs text-primary font-semibold uppercase tracking-wider">{t('stylist.dashboard.remaining')}</p>
            <p className="text-2xl font-bold text-primary">{upcomingCount}</p>
          </Card>
        </div>
      </header>

      {/* Agenda List */}
      <main className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
            {t('stylist.dashboard.agenda')}
          </h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all cursor-pointer"
          />
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <span className="text-4xl">☕</span>
            <p className="text-zinc-500 mt-4 font-medium">{t('stylist.dashboard.noAppointments')}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardBody className="p-0 flex flex-col sm:flex-row items-stretch">
                  {/* Time Section */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-e border-zinc-100 dark:border-zinc-800 min-w-[120px]">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {booking.startTime.split('T')[1]?.substring(0, 5) || booking.startTime}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium uppercase mt-1">
                      {booking.duration ? `${booking.duration}m` : 'Slot'}
                    </span>
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-lg">
                          {booking.customerName}
                        </h3>
                        <Badge 
                          status={booking.status.toLowerCase()} 
                          label={t(`appointments.status.${booking.status.toLowerCase()}`)} 
                        />
                      </div>
                      <p className="text-zinc-500 font-medium">
                        ✨ {booking.serviceName}
                      </p>
                      {booking.note && (
                        <p className="text-sm text-zinc-400 mt-2 italic bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg w-fit">
                          " {booking.note} "
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    {booking.status.toLowerCase() === 'pending' && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                          size="sm" 
                          className="flex-1 sm:flex-none"
                          onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                          loading={updatingId === booking.id}
                        >
                          {t('stylist.dashboard.markDone')}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}