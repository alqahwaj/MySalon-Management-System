import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import Button from '../components/ui/Button'
import { Card, CardBody } from '../components/ui/Card'

/* ── Helpers ───────────────────────────────────────────── */
function today() {
  return new Date().toISOString().split('T')[0]
}

// 🌟 دالة جديدة عشان تعالج مسار الصور سواء كانت من كلاوديناري أو محلية
function getValidImageUrl(rawImageUrl, serverUrl) {
  if (!rawImageUrl) return null;
  if (rawImageUrl.startsWith('http')) return rawImageUrl;
  return rawImageUrl.startsWith('/') ? `${serverUrl}${rawImageUrl}` : `${serverUrl}/${rawImageUrl}`;
}

function StepIndicator({ current, total, label }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
              ${i + 1 < current ? 'bg-primary text-white' : i + 1 === current ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}
          >
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && <div className={`w-10 h-0.5 ${i + 1 < current ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700'}`} />}
        </div>
      ))}
      <span className="ms-2 text-sm text-zinc-500">{label}</span>
    </div>
  )
}

/* ── Step 1: Services (Fetching from SalonServices) ────── */
function Step1({ onSelect, selected }) {
  const { t } = useTranslation()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const salonId = import.meta.env.VITE_DEFAULT_SALON_ID;
  const API_URL = import.meta.env.VITE_API_BASE_URL; 
  const SERVER_URL = API_URL.replace('/api', '');

  useEffect(() => {
    api.get(`/SalonServices/salon/${salonId}`)
      .then(r => {
        const availableServices = r.data.filter(s => s.isAvailable === true || s.IsAvailable === true);
        setServices(availableServices);
      })
      .catch(err => {
        console.error("Error fetching salon services:", err);
        setServices([]);
      })
      .finally(() => setLoading(false))
  }, [salonId])

  if (loading) return <p className="text-zinc-400 py-12 text-center">{t('booking.loadingServices')}</p>
  if (!services.length) return <p className="text-zinc-400 py-12 text-center">{t('booking.noServices')}</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map(s => {
        const id = s.id || s.Id; 
        const name = s.serviceName || s.ServiceName || s.service?.name || s.Service?.Name || 'Service';
        const description = s.description || s.Description || s.service?.description || s.Service?.Description;
        const duration = s.durationMinutes || s.DurationMinutes || s.duration || s.Duration;
        const price = s.price || s.Price;
        
        // 🌟 التعديل الحاسم للصور باستخدام الدالة
        const rawImageUrl = s.imageUrl || s.ImageUrl || s.serviceImageUrl || s.ServiceImageUrl || s.service?.imageUrl || s.service?.ImageUrl || s.Service?.imageUrl || s.Service?.ImageUrl;
        const finalImageUrl = getValidImageUrl(rawImageUrl, SERVER_URL);

        return (
          <Card
            key={id}
            onClick={() => onSelect({ ...s, id, name, duration, price })}
            className={`transition-all cursor-pointer h-full flex flex-col ${selected?.id === id ? 'ring-2 ring-primary border-primary/30 shadow-lg' : ''}`}
          >
            <CardBody className="flex flex-col h-full p-4">
              
              {finalImageUrl ? (
                <div className="w-full h-36 mb-4 rounded-xl overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <img 
                    src={finalImageUrl} 
                    alt={name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              ) : (
                <div className="w-full h-36 mb-4 rounded-xl overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-medium">
                  لا توجد صورة
                </div>
              )}

              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">{name}</h3>
                {selected?.id === id && <span className="text-primary text-lg font-bold">✓</span>}
              </div>
              
              {description && <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{description}</p>}
              
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-50 dark:border-zinc-800/50">
                <span className="text-xs text-zinc-400 font-medium">⏱ {duration} min</span>
                <span className="text-sm font-bold text-primary">
                  {price > 0 ? `$${price}` : 'Free'}
                </span>
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}

/* ── Step 2: Stylists ──────────────────────────────────── */
function Step2({ onSelect, selected }) {
  const { t } = useTranslation()
  const [stylists, setStylists] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_BASE_URL; 
  const SERVER_URL = API_URL.replace('/api', '');

  useEffect(() => {
    api.get('/Stylist')
      .then(r => setStylists(r.data))
      .catch(() => setStylists([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-zinc-400 py-12 text-center">{t('booking.loadingStylists')}</p>
  if (!stylists.length) return <p className="text-zinc-400 py-12 text-center">{t('booking.noStylists')}</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stylists.map(s => {
        const id = s.id || s.Id;
        const fName = s.firstName || s.FirstName || '';
        const lName = s.lastName || s.LastName || '';
        const spec = s.specialization || s.Specialization;
        const initials = `${fName[0] || ''}${lName[0] || ''}`.toUpperCase();
        
        // 🌟 التعديل الحاسم للصور باستخدام الدالة
        const rawImageUrl = s.imageUrl || s.ImageUrl;
        const finalImageUrl = getValidImageUrl(rawImageUrl, SERVER_URL);

        return (
          <Card
            key={id}
            onClick={() => onSelect({ ...s, id, firstName: fName, lastName: lName })}
            className={`transition-all cursor-pointer ${selected?.id === id ? 'ring-2 ring-primary border-primary/30 shadow-lg' : ''}`}
          >
            <CardBody className="flex items-center gap-4">
              {finalImageUrl ? (
                <img src={finalImageUrl} alt={fName} className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-primary/20" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-800 dark:text-zinc-100">{fName} {lName}</p>
                {spec && <p className="text-sm text-zinc-400 truncate">{spec}</p>}
              </div>
              {selected?.id === id && <span className="text-primary text-xl font-bold">✓</span>}
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}

/* ── Step 3: Date & Time ───────────────────────────────── */
function Step3({ stylistId, serviceId, onSelect, selected }) {
  const { t } = useTranslation()
  const [date, setDate] = useState(today())
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date || !stylistId || !serviceId) return
    setLoading(true)
    
    api.get('/Booking/available-slots', { params: { stylistId, serviceId, date } })
      .then(r => setSlots(r.data))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }, [date, stylistId, serviceId])

  const now = new Date();
  const validSlots = slots.filter((slot) => {
    const time = slot.startTime || slot.StartTime || slot;
    const displayTime = typeof time === 'string' && time.includes('T') 
      ? time.split('T')[1].substring(0, 5) 
      : time;
    
    const slotDateTime = new Date(`${date}T${displayTime}:00`);
    
    return slotDateTime > now;
  });

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('booking.selectDate')}</label>
        <input
          type="date"
          value={date}
          min={today()}
          onChange={e => { setDate(e.target.value); onSelect(null) }}
          className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">{t('booking.availableSlots')}</p>
        {loading ? (
          <p className="text-zinc-400 text-sm">{t('booking.loadingSlots')}</p>
        ) : validSlots.length === 0 ? ( 
          <p className="text-zinc-400 text-sm">{t('booking.noSlots')}</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {validSlots.map((slot) => { 
              const time = slot.startTime || slot.StartTime || slot;
              const displayTime = typeof time === 'string' && time.includes('T') ? time.split('T')[1].substring(0, 5) : time;
              
              return (
                <button
                  key={time}
                  onClick={() => onSelect({ ...slot, date, startTime: displayTime })}
                  className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all
                    ${selected?.startTime === displayTime && selected?.date === date
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-primary hover:text-primary'
                    }`}
                >
                  {displayTime}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Step 4: Confirm ───────────────────────────────────── */
function Step4({ service, stylist, slot, notes, onNotesChange }) {
  const { t } = useTranslation()
  const rows = [
    { label: t('booking.service'), value: service?.name },
    { label: t('booking.stylist'), value: `${stylist?.firstName} ${stylist?.lastName}` },
    { label: t('booking.date'),    value: slot?.date },
    { label: t('booking.time'),    value: slot?.startTime },
    { label: t('booking.duration'), value: service?.duration ? `${service.duration} min` : '—' },
    { label: t('booking.price'),   value: service?.price ? `$${service.price}` : t('booking.free') },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-200 dark:divide-zinc-700 overflow-hidden">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm text-zinc-500">{row.label}</span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{row.value || '—'}</span>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{t('booking.notes')}</label>
        <textarea
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder={t('booking.notesPlaceholder')}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none resize-none"
        />
      </div>
    </div>
  )
}

/* ── Main Booking Page ─────────────────────────────────── */
export default function BookingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [step, setStep]         = useState(1)
  const [service, setService]   = useState(null)
  const [stylist, setStylist]   = useState(null)
  const [slot, setSlot]         = useState(null)
  const [notes, setNotes]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const salonId = import.meta.env.VITE_DEFAULT_SALON_ID; 

  const canNext = {
    1: !!service,
    2: !!stylist,
    3: !!slot,
    4: true,
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const salonId = import.meta.env.VITE_DEFAULT_SALON_ID;      
      const combinedDateTime = `${slot.date}T${slot.startTime}:00`;

      await api.post('/Booking', {
        salonServiceId: service.id,
        salonId: salonId,
        stylistId: stylist.id,
        startTime: combinedDateTime, 
        note: notes,
      })
      setSuccess(true)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.title || 'Booking failed. Please check your data.';
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-6">
        <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 text-5xl flex items-center justify-center mx-auto shadow-sm">
          ✓
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{t('booking.successTitle')}</h2>
        <p className="text-zinc-500 leading-relaxed">{t('booking.successMessage')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button onClick={() => { setSuccess(false); setStep(1); setService(null); setStylist(null); setSlot(null); setNotes('') }}>
            {t('booking.bookAnother')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/appointments')}>
            {t('booking.viewAppointments')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t('booking.title')}</h1>
        <p className="text-zinc-500">{t(`booking.step${step}Title`)}</p>
      </header>

      <StepIndicator current={step} total={4} label={t('booking.step', { n: step })} />

      <main className="min-h-[400px]">
        {step === 1 && <Step1 onSelect={setService} selected={service} />}
        {step === 2 && <Step2 onSelect={setStylist} selected={stylist} />}
        {step === 3 && <Step3 stylistId={stylist?.id} serviceId={service?.id} onSelect={setSlot} selected={slot} />}
        {step === 4 && <Step4 service={service} stylist={stylist} slot={slot} notes={notes} onNotesChange={setNotes} />}
      </main>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <footer className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1}>
          ← {t('booking.back')}
        </Button>
        {step < 4 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}>
            {t('booking.next')} →
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading} disabled={!canNext[4]}>
            {t('booking.confirmBook')}
          </Button>
        )}
      </footer>
    </div>
  )
}