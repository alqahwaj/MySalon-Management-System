import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../api/axios' 

export default function AdminBookings() {
  const { t, i18n } = useTranslation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [filterStatus, setFilterStatus] = useState('') 
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  const [statusModal, setStatusModal] = useState({ isOpen: false, bookingId: null, currentStatus: '' })
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchBookings = () => {
    setLoading(true)
    let url = `/Booking/admin/all?page=${page}&pageSize=${pageSize}`
    if (filterStatus) url += `&status=${filterStatus}`

    api.get(url)
      .then(res => {
        setBookings(res.data.items || [])
        setTotalPages(Math.ceil((res.data.totalCount || 0) / pageSize))
      })
      .catch(err => console.error("Error fetching admin bookings:", err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBookings()
  }, [page, filterStatus])

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(t('dashboard.confirmCancel', 'Are you sure you want to cancel?'))) return;

    try {
      await api.put(`/Booking/${bookingId}/cancel`);
      fetchBookings(); 
    } catch (error) {
      console.error("Cancel Error:", error);
      alert(t('dashboard.cancelError', 'Failed to cancel booking.'));
    }
  };

  const openStatusModal = (booking) => {
    setStatusModal({ isOpen: true, bookingId: booking.id, currentStatus: booking.status });
  };

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      await api.put(`/Booking/${statusModal.bookingId}/status`, { status: newStatus });
      setStatusModal({ isOpen: false, bookingId: null, currentStatus: '' });
      fetchBookings(); 
    } catch (error) {
      console.error("Update Status Error:", error);
      alert(t('settings.servicesTab.operationError', 'Operation error'));
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true
    }).format(date);
  };

  const getStatusIndicator = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed') return '🟢'; 
    if (s === 'pending') return '🟡';   
    if (s === 'cancelled') return '🔴'; 
    return '🔵'; 
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          {t('adminBookings.title', 'Bookings Management')}
        </h1>
        <p className="text-zinc-500 mt-1">{t('adminBookings.subtitle', 'View and filter all salon bookings')}</p>
      </div>

      <div className="flex flex-wrap gap-2 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 w-fit shadow-sm">
        {[
          { value: '', label: t('adminBookings.filters.all', 'All') },
          { value: 'Pending', label: t('adminBookings.filters.pending', 'Pending') },
          { value: 'Completed', label: t('adminBookings.filters.completed', 'Completed') },
          { value: 'Cancelled', label: t('adminBookings.filters.cancelled', 'Cancelled') }
        ].map(f => (
          <button
            key={f.value}
            onClick={() => { setFilterStatus(f.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === f.value 
                ? 'bg-primary text-white shadow-md' 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium text-start">{t('adminBookings.table.customer', 'Customer')}</th>
                <th className="px-6 py-4 font-medium text-start">{t('adminBookings.table.service', 'Service')}</th>
                <th className="px-6 py-4 font-medium text-start">{t('adminBookings.table.stylist', 'Stylist')}</th>
                <th className="px-6 py-4 font-medium text-start">{t('adminBookings.table.date', 'Date')}</th>
                <th className="px-6 py-4 font-medium text-start">{t('adminBookings.table.status', 'Status')}</th>
                <th className="px-6 py-4 font-medium text-end">{t('adminBookings.table.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-zinc-500">
                    <span className="inline-block animate-spin me-2">⏳</span>
                    {t('booking.loading', 'Loading...')}
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-zinc-500">
                    {t('adminBookings.noData', 'No bookings match your filter.')}
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{b.customerName}</td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">{b.serviceName}</td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">{b.stylistName}</td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300" dir="ltr">
                      {formatDateTime(b.startTime)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                        {getStatusIndicator(b.status)} {t(`status.${b.status?.toLowerCase()}`, b.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      {b.status?.toLowerCase() === 'pending' ? (
                        <div className="flex justify-end gap-2 border-s border-zinc-200 dark:border-zinc-700 ps-3">
                          <button 
                            onClick={() => openStatusModal(b)}
                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 transition-colors"
                            title={t('dashboard.editBtn', 'Edit')}
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleCancelBooking(b.id)}
                            className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                            title={t('dashboard.cancelBtn', 'Cancel')}
                          >
                            ❌
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="text-sm px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              {i18n.language === 'ar' ? 'السابق' : 'Previous'}
            </button>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {i18n.language === 'ar' ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
            </span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="text-sm px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              {i18n.language === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        )}
      </div>

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
                onClick={() => setStatusModal({ isOpen: false, bookingId: null, currentStatus: '' })}
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