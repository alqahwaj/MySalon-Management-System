import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Card, CardBody } from '../components/ui/Card'
import Button from '../components/ui/Button'

/* Helpers */
function timeAgo(dateString, t) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / 60000);

  if (diffInMinutes < 1) return t('time.justNow', 'Just now');
  if (diffInMinutes < 60) return t('time.minsAgo', { count: diffInMinutes, defaultValue: `${diffInMinutes} mins ago` });
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return t('time.hoursAgo', { count: diffInHours, defaultValue: `${diffInHours} hours ago` });
  return t('time.daysAgo', { count: Math.floor(diffInHours / 24), defaultValue: `${Math.floor(diffInHours / 24)} days ago` });
}

function getStatusIndicator(status) {
  const s = status?.toLowerCase();
  if (s === 'completed') return '🟢'; 
  if (s === 'pending') return '🟡';   
  if (s === 'cancelled') return '🔴'; 
  return '🔵'; 
}

function StatCard({ icon, label, value, sub, color = 'text-primary' }) {
  return (
    <Card>
      <CardBody className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
          <p className={`text-3xl font-bold font-display ${color}`}>{value}</p>
          {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </CardBody>
    </Card>
  )
}

function CustomerDashboard({ user, t }) {
  const [stats, setStats] = useState({ upcoming: 0, past: 0, points: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/Booking/customer')
      .then(res => {
        const bookings = res.data || [];
        const today = new Date().toISOString().split('T')[0];
        
        let upcomingCount = 0;
        let pastCount = 0;

        bookings.forEach(b => {
          const apptDate = b.appointmentDate?.split('T')[0] || b.AppointmentDate?.split('T')[0];
          if (apptDate >= today) upcomingCount++;
          else pastCount++;
        });

        setStats({
          upcoming: upcomingCount,
          past: pastCount,
          points: pastCount * 50 
        });
      })
      .catch(err => console.error("Error fetching customer bookings:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-700 text-white p-8">
        <div className="absolute top-0 end-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
        <p className="text-sm font-medium opacity-80 mb-2">✨ {t('dashboard.welcomeBadge', 'Welcome')}</p>
        <h1 className="font-display text-4xl font-semibold mb-3">
          {t('dashboard.welcomeCustomer', { name: user?.firstName || user?.FirstName || '' })}
        </h1>
        <p className="opacity-80 text-sm mb-6">{t('dashboard.subtitle')}</p>
        <Link to="/book">
          <Button variant="secondary" size="lg">
            ✂️ &nbsp;{t('dashboard.bookNow')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          icon="📅" 
          label={t('dashboard.upcomingAppts')} 
          value={loading ? '-' : stats.upcoming} 
          color="text-blue-500" 
        />
        <StatCard 
          icon="✂️" 
          label={t('dashboard.pastServices')} 
          value={loading ? '-' : stats.past} 
          color="text-primary" 
        />
        <StatCard 
          icon="⭐" 
          label={t('dashboard.loyaltyPoints')} 
          value={loading ? '-' : stats.points} 
          color="text-amber-500" 
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-3">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/book">
            <Card className="hover:border-primary/30 transition-colors">
              <CardBody className="flex items-center gap-3">
                <span className="text-2xl">✂️</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{t('nav.book')}</span>
              </CardBody>
            </Card>
          </Link>
          <Link to="/appointments">
            <Card className="hover:border-primary/30 transition-colors">
              <CardBody className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{t('nav.appointments')}</span>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StylistDashboard({ user, t }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-semibold text-zinc-900 dark:text-zinc-100">
          {t('dashboard.welcomeStylist', { name: user?.firstName || user?.FirstName || '' })}
        </h1>
        <p className="text-zinc-500 mt-1">{t('dashboard.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label={t('dashboard.todayAppts')} value="8" color="text-blue-500" />
        <StatCard icon="👥" label={t('dashboard.totalClients')} value="142" color="text-emerald-500" />
        <StatCard icon="💰" label={t('dashboard.weeklyRevenue')} value="$1,240" color="text-primary" />
        <StatCard icon="⭐" label={t('dashboard.rating')} value="4.9 / 5" color="text-amber-500" />
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
        <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-4">{t('dashboard.todaysSchedule', "Today's Schedule")}</h2>
        {['9:00 AM — Balayage — Sarah M.', '11:00 AM — Cut & Style — Emma T.', '2:00 PM — Color Treatment — Lina K.'].map((s, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <span className="text-lg">💇</span>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminDashboard({ user, t }) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    bookingsPercentage: 0,
    totalRevenue: 0,
    revenuePercentage: 0,
    activeStylists: 0,
    newCustomers: 0,
    customersPercentage: 0,
    recentBookings: []
  });
  
  const [loading, setLoading] = useState(true);

  const [statusModal, setStatusModal] = useState({ isOpen: false, bookingId: null, currentStatus: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    api.get('/Dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching admin stats:", err))
      .finally(() => setLoading(false));
  }, []); 

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(t('dashboard.confirmCancel', 'Are you sure you want to cancel this booking?'))) {
      return;
    }

    try {
      await api.put(`/Booking/${bookingId}/cancel`); 
      setStats(prev => ({
        ...prev,
        recentBookings: prev.recentBookings.map(b => 
          b.id === bookingId ? { ...b, status: 'Cancelled' } : b
        )
      }));
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert(t('dashboard.cancelError', 'Failed to cancel booking.'));
    }
  };

  const openStatusModal = (booking) => {
    setStatusModal({ isOpen: true, bookingId: booking.id, currentStatus: booking.status });
  };

  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, bookingId: null, currentStatus: '' });
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      await api.put(`/Booking/${statusModal.bookingId}/status`, { status: newStatus });
      
      setStats(prev => ({
        ...prev,
        recentBookings: prev.recentBookings.map(b => 
          b.id === statusModal.bookingId ? { ...b, status: newStatus } : b
        )
      }));
      closeStatusModal();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(t('settings.servicesTab.operationError', 'Operation error'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="font-display text-4xl font-semibold text-zinc-900 dark:text-zinc-100">
          {t('dashboard.welcomeAdmin', { name: user?.firstName || user?.FirstName || 'Admin' })}
        </h1>
        <p className="text-zinc-500 mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon="📋" 
          label={t('dashboard.thisMonthBookings', "This Month's Bookings")} 
          value={loading ? '...' : stats.totalBookings.toLocaleString()} 
          sub={`${stats.bookingsPercentage >= 0 ? '+' : ''}${stats.bookingsPercentage}% ${t('dashboard.thisMonth', 'this month')}`} 
          color="text-primary" 
        />
        
        <StatCard 
          icon="💰" 
          label={t('dashboard.totalRevenue')} 
          value={loading ? '...' : `$${stats.totalRevenue.toLocaleString()}`} 
          sub={`${stats.revenuePercentage >= 0 ? '+' : ''}${stats.revenuePercentage}% ${t('dashboard.thisMonth', 'this month')}`} 
          color="text-emerald-500" 
        />
        
        <StatCard 
          icon="✂️" 
          label={t('dashboard.activeStylists')} 
          value={loading ? '...' : stats.activeStylists} 
          color="text-blue-500" 
        />
        
        <StatCard 
          icon="👥" 
          label={t('dashboard.newCustomers')} 
          value={loading ? '...' : stats.newCustomers} 
          sub={`${stats.customersPercentage >= 0 ? '+' : ''}${stats.customersPercentage}% ${t('dashboard.thisMonth', 'this month')}`} 
          color="text-amber-500" 
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-4">{t('dashboard.recentBookings', 'Recent Bookings')}</h2>
        
        {(!stats.recentBookings || stats.recentBookings.length === 0) && !loading && (
          <p className="text-sm text-zinc-500 py-4 text-center">{t('dashboard.noBookings', 'No recent bookings found.')}</p>
        )}

        {stats.recentBookings?.map((b, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors px-2 rounded-lg">
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{b.customerName}</p>
              <p className="text-xs text-zinc-400">{b.serviceName}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-end">
                <span className="text-xs text-zinc-400 block" dir="auto">{timeAgo(b.createdAt, t)}</span>
                <span className="text-xs font-semibold" title={b.status}>
                  {getStatusIndicator(b.status)} {t(`status.${b.status?.toLowerCase()}`, b.status)}
                </span>
              </div>
              
              {b.status?.toLowerCase() !== 'cancelled' && b.status?.toLowerCase() !== 'completed' && (
                <div className="flex gap-2 border-s border-zinc-200 dark:border-zinc-700 ps-3">
                  <button 
                    onClick={() => openStatusModal(b)}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1.5 rounded hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 transition-colors"
                    title={t('dashboard.editBtn', 'Change Status')}
                  >
                    ✏️
                  </button>

                  <button 
                    onClick={() => handleCancelBooking(b.id)}
                    className="text-xs bg-red-50 text-red-600 px-2 py-1.5 rounded hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                    title={t('dashboard.cancelBtn', 'Cancel')}
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🌟 شاشة الـ Modal المنبثقة 🌟 */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-sm p-6 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              {t('dashboard.editBtn', 'Change Status')}
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleUpdateStatus('Completed')}
                disabled={isUpdating}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 transition-colors disabled:opacity-50"
              >
                <span>{t('status.completed', 'Completed')}</span>
                <span>🟢</span>
              </button>

              <button 
                onClick={() => handleUpdateStatus('Pending')}
                disabled={isUpdating}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 transition-colors disabled:opacity-50"
              >
                <span>{t('status.pending', 'Pending')}</span>
                <span>🟡</span>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={closeStatusModal}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {t('settings.staff.cancelBtn', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* Main Dashboard Component */
export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const role = user?.role?.toLowerCase() || user?.Role?.toLowerCase()

  if (role === 'stylist') return <StylistDashboard user={user} t={t} />
  if (role === 'admin' || role === 'owner') return <AdminDashboard user={user} t={t} />
  
  return <CustomerDashboard user={user} t={t} />
}