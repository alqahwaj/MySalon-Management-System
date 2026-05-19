import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const MOCK_BOOKINGS = [
  { id: '1', serviceId: 'Balayage',          stylistId: 'Sophie Laurent', appointmentDate: '2026-04-05', startTime: '10:00', endTime: '13:00', status: 'confirmed' },
  { id: '2', serviceId: 'Cut & Style',       stylistId: 'Emma Chen',      appointmentDate: '2026-04-10', startTime: '14:00', endTime: '15:00', status: 'pending'   },
  { id: '3', serviceId: 'Keratin Treatment', stylistId: 'Layla Hassan',   appointmentDate: '2026-03-15', startTime: '09:00', endTime: '11:00', status: 'completed' },
  { id: '4', serviceId: 'Deep Conditioning', stylistId: 'Mia Russo',      appointmentDate: '2026-03-01', startTime: '11:00', endTime: '11:45', status: 'cancelled' },
]

function today() {
  return new Date().toISOString().split('T')[0]
}

function BookingCard({ booking, onCancel, onReschedule, t }) {
  const isUpcoming = booking.appointmentDate >= today()
    && booking.status !== 'cancelled'
    && booking.status !== 'completed'

  const statusLabel = t(`appointments.status.${booking.status}`) || booking.status

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Date block */}
      <div className="shrink-0 w-16 h-16 rounded-xl bg-primary/8 dark:bg-primary/15 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-bold text-primary leading-none">
          {new Date(booking.appointmentDate).getDate()}
        </span>
        <span className="text-xs text-primary/70 font-medium uppercase mt-0.5">
          {new Date(booking.appointmentDate).toLocaleString('default', { month: 'short' })}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {/* 🌟 التعديل: عرضنا serviceName بدل الـ ID */}
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 text-base">{booking.serviceName || booking.serviceId}</h3>
          <Badge status={booking.status} label={statusLabel} />
        </div>
        <p className="text-sm text-zinc-500">
          {/* 🌟 التعديل: عرضنا stylistName بدل الـ ID */}
          👩‍🎨 {booking.stylistName || booking.stylistId} &nbsp;·&nbsp; 🕐 {booking.startTime}
          {booking.endTime && ` – ${booking.endTime}`}
        </p>
      </div>

      {/* Actions */}
      {isUpcoming && (
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => onReschedule(booking)}>
            📅 {t('appointments.reschedule')}
          </Button>
          <Button size="sm" variant="danger" onClick={() => onCancel(booking)}>
            {t('appointments.cancel')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default function AppointmentsCalendar() {
  const { t } = useTranslation()
  const [tab, setTab]           = useState('upcoming')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)

  const [cancelTarget, setCancelTarget]       = useState(null)
  const [cancelling, setCancelling]           = useState(false)
  const [reschedTarget, setReschedTarget]     = useState(null)
  const [reschedDate, setReschedDate]         = useState('')
  const [reschedTime, setReschedTime]         = useState('')
  const [saving, setSaving]                   = useState(false)

  useEffect(() => {
    // 🌟 تنبيه: تأكد إنك باعت الـ customerId بالمسار إذا الباك إند بيحتاجه (مثلاً: `/Booking/customer/${customerId}`)
    // حالياً خليتها حسب كودك الأصلي
    api.get('/Booking/customer/all')
      .then(r => {
        // 🌟 التعديل السحري: مصفاة بترتب الداتا عشان الرياكت يفهمها صح
        const formattedBookings = r.data.map(b => {
          // فصل التاريخ عن الوقت
          const datePart = b.startTime ? b.startTime.split('T')[0] : b.appointmentDate;
          const timePart = b.startTime && b.startTime.includes('T') ? b.startTime.split('T')[1].substring(0, 5) : b.startTime;
          const endTimePart = b.endTime && b.endTime.includes('T') ? b.endTime.split('T')[1].substring(0, 5) : b.endTime;

          return {
            ...b,
            appointmentDate: datePart, // حطينا التاريخ لحال
            startTime: timePart,       // حطينا الوقت لحال
            endTime: endTimePart,
            status: b.status ? b.status.toLowerCase() : 'pending' // وحدنا حالة الأحرف
          };
        });
        
        setBookings(formattedBookings);
      })
      .catch(() => setBookings(MOCK_BOOKINGS))
      .finally(() => setLoading(false))
  }, [])

  const displayed = bookings.filter(b => {
    if (tab === 'upcoming') return b.appointmentDate >= today() && b.status !== 'cancelled' && b.status !== 'completed'
    if (tab === 'past')     return b.appointmentDate < today()  || b.status === 'completed' || b.status === 'cancelled'
    return true
  })

  /* Cancel */
  const confirmCancel = async () => {
    setCancelling(true)
    try {
      await api.put(`/Booking/${cancelTarget.id}/cancel`)
      setBookings(prev => prev.map(b => b.id === cancelTarget.id ? { ...b, status: 'cancelled' } : b))
    } catch {
      setBookings(prev => prev.map(b => b.id === cancelTarget.id ? { ...b, status: 'cancelled' } : b))
    } finally {
      setCancelling(false)
      setCancelTarget(null)
    }
  }

  /* Reschedule */
  const confirmReschedule = async () => {
    if (!reschedDate || !reschedTime) return
    setSaving(true)
    try {
      const combinedDateTime = `${reschedDate}T${reschedTime}:00`;
      // 🌟 التعديل هون: دمجنا الوقت والتاريخ عشان يقبلهم الـ .NET بدالة التعديل
      await api.put(`/Booking/${reschedTarget.id}/reschedule`, {
        newTime: combinedDateTime
      })
      setBookings(prev => prev.map(b =>
        b.id === reschedTarget.id ? { ...b, appointmentDate: reschedDate, startTime: reschedTime } : b
      ))
    } catch {
      setBookings(prev => prev.map(b =>
        b.id === reschedTarget.id ? { ...b, appointmentDate: reschedDate, startTime: reschedTime } : b
      ))
    } finally {
      setSaving(false)
      setReschedTarget(null)
      setReschedDate('')
      setReschedTime('')
    }
  }

  const tabs = [
    { key: 'upcoming', label: t('appointments.upcoming') },
    { key: 'past',     label: t('appointments.past')     },
    { key: 'all',      label: t('appointments.all')      },
  ]

  const emptyMsg = {
    upcoming: t('appointments.noUpcoming'),
    past:     t('appointments.noPast'),
    all:      t('appointments.noAll'),
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl font-semibold text-zinc-900 dark:text-zinc-100">{t('appointments.title')}</h1>
        </div>
        <Link to="/book">
          <Button>✂️ &nbsp;{t('nav.book')}</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl p-1 mb-6 w-fit">
        {tabs.map(tab_ => (
          <button
            key={tab_.key}
            onClick={() => setTab(tab_.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
              ${tab === tab_.key
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
          >
            {tab_.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-zinc-500 mb-4">{emptyMsg[tab]}</p>
          {tab === 'upcoming' && (
            <Link to="/book">
              <Button variant="outline">{t('appointments.bookFirst')}</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(b => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancel={setCancelTarget}
              onReschedule={(b) => { setReschedTarget(b); setReschedDate(b.appointmentDate); setReschedTime(b.startTime) }}
              t={t}
            />
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title={t('appointments.cancelTitle')}
      >
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">{t('appointments.cancelMessage')}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setCancelTarget(null)}>{t('appointments.keepIt')}</Button>
          <Button variant="danger" loading={cancelling} onClick={confirmCancel}>
            {cancelling ? t('appointments.cancelling') : t('appointments.yesCancel')}
          </Button>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        open={!!reschedTarget}
        onClose={() => { setReschedTarget(null); setReschedDate(''); setReschedTime('') }}
        title={t('appointments.rescheduleTitle')}
      >
        <p className="text-sm text-zinc-500 mb-4">{t('appointments.rescheduleNew')}</p>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t('appointments.date')}</label>
            <input
              type="date"
              value={reschedDate}
              min={today()}
              onChange={e => setReschedDate(e.target.value)}
              className="h-11 px-4 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">{t('appointments.time')}</label>
            <input
              type="time"
              value={reschedTime}
              onChange={e => setReschedTime(e.target.value)}
              className="h-11 px-4 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setReschedTarget(null)}>Cancel</Button>
          <Button loading={saving} disabled={!reschedDate || !reschedTime} onClick={confirmReschedule}>
            {saving ? t('appointments.saving') : t('appointments.saveChanges')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}