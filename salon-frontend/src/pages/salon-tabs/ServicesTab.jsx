import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Card, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useTranslation } from 'react-i18next';

export default function ServicesTab() {
  const { t, i18n } = useTranslation();
  const [salonServices, setSalonServices] = useState([]);
  const [baseServices, setBaseServices] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [editingSalonServiceId, setEditingSalonServiceId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newService, setNewService] = useState({ serviceId: '', price: '', durationMinutes: '' });

  const [showBaseForm, setShowBaseForm] = useState(false);
  const [baseFormMode, setBaseFormMode] = useState('create'); 
  const [selectedBaseId, setSelectedBaseId] = useState("");
  const [newBaseService, setNewBaseService] = useState({ name: '', description: '', category: 1 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCreatingBase, setIsCreatingBase] = useState(false);

  const salonId = import.meta.env.VITE_DEFAULT_SALON_ID;
  const API_URL = import.meta.env.VITE_API_BASE_URL; 
  const SERVER_URL = API_URL.replace('/api', '');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get(`/SalonServices/salon/${salonId}`),
      api.get('/Services')
    ]).then(([salonRes, baseRes]) => {
      setSalonServices(salonRes.data);
      setBaseServices(baseRes.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCancelSalonForm = () => {
    setShowAddForm(false);
    setEditingSalonServiceId(null);
    setNewService({ serviceId: '', price: '', durationMinutes: '' });
  };

  const handleCancelBaseForm = () => {
    setShowBaseForm(false);
    setSelectedBaseId("");
    setNewBaseService({ name: '', description: '', category: 1 });
    setSelectedFile(null);
  };

  const openAddSalonForm = () => {
    setShowAddForm(true);
    handleCancelBaseForm();
  };

  const openBaseForm = (mode) => {
    setShowBaseForm(true);
    setBaseFormMode(mode);
    setSelectedBaseId("");
    setNewBaseService({ name: '', description: '', category: 1 });
    setSelectedFile(null);
    handleCancelSalonForm();
  };

  const handleEditSalonServiceClick = (salonService) => {
    setEditingSalonServiceId(salonService.id || salonService.Id);
    setNewService({
      serviceId: salonService.serviceId || salonService.ServiceId,
      price: salonService.price || salonService.Price,
      durationMinutes: salonService.durationMinutes || salonService.DurationMinutes
    });
    setShowAddForm(true);
    handleCancelBaseForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSalonService = async (id) => {
    if (window.confirm(t('settings.servicesTab.confirmDelete'))) {
      try {
        await api.delete(`/SalonServices/${id}`);
        fetchData();
      } catch (err) {
        alert(t('settings.servicesTab.deleteError'));
      }
    }
  };

  const handleSubmitSalonService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingSalonServiceId) {
        const existingService = salonServices.find(s => (s.id || s.Id) === editingSalonServiceId);
        const payload = {
          salonId,
          serviceId: newService.serviceId,
          price: parseFloat(newService.price),
          durationMinutes: parseInt(newService.durationMinutes),
          isAvailable: existingService.isAvailable !== undefined ? existingService.isAvailable : existingService.IsAvailable
        };
        await api.put(`/SalonServices/${editingSalonServiceId}`, payload);
      } else {
        await api.post('/SalonServices', {
          salonId,
          ...newService,
          price: parseFloat(newService.price),
          durationMinutes: parseInt(newService.durationMinutes),
          isAvailable: true
        });
      }
      handleCancelSalonForm();
      fetchData();
    } catch (err) { alert(t('settings.servicesTab.operationError')); }
    finally { setIsSubmitting(false); }
  };

  const handleSaveBaseService = async (e) => {
    e.preventDefault();
    setIsCreatingBase(true);
    try {
      const formData = new FormData();
      formData.append("Name", newBaseService.name);
      formData.append("Description", newBaseService.description);
      formData.append("Category", parseInt(newBaseService.category));

      if (selectedFile) {
        formData.append("ImageFile", selectedFile);
      }

      if (baseFormMode === 'edit') {
        await api.put(`/Services/${selectedBaseId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert(t('settings.servicesTab.editSuccess'));
      } else {
        await api.post('/Services', formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert(t('settings.servicesTab.createSuccess'));
      }

      handleCancelBaseForm();
      fetchData(); 
    } catch (err) { 
      alert(t('settings.servicesTab.createError')); 
      console.error(err);
    } 
    finally { setIsCreatingBase(false); }
  };

  const toggleAvailability = async (serviceObj) => {
    const sId = serviceObj.id || serviceObj.Id;
    const currentStatus = serviceObj.isAvailable !== undefined ? serviceObj.isAvailable : serviceObj.IsAvailable;
    try {
      const payload = {
        salonId: serviceObj.salonId || serviceObj.SalonId,
        serviceId: serviceObj.serviceId || serviceObj.ServiceId,
        price: serviceObj.price || serviceObj.Price,
        durationMinutes: serviceObj.durationMinutes || serviceObj.DurationMinutes,
        isAvailable: !currentStatus
      };
      await api.put(`/SalonServices/${sId}`, payload);
      setSalonServices(prev => prev.map(s => (s.id || s.Id) === sId ? { ...s, isAvailable: !currentStatus, IsAvailable: !currentStatus } : s));
    } catch (err) { alert(t('settings.servicesTab.toggleError')); }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t('settings.servicesTab.title')}</h2>
        <div className="flex flex-wrap gap-2">
          {/* 🌟 زر إنشاء في الكتالوج */}
          <Button 
            onClick={() => showBaseForm && baseFormMode === 'create' ? handleCancelBaseForm() : openBaseForm('create')} 
            variant={showBaseForm && baseFormMode === 'create' ? 'outline' : 'secondary'} className="bg-zinc-100 dark:bg-zinc-800"
          >
            {showBaseForm && baseFormMode === 'create' ? t('settings.staff.cancelBtn') : t('settings.servicesTab.createBase')}
          </Button>

          <Button 
            onClick={() => showBaseForm && baseFormMode === 'edit' ? handleCancelBaseForm() : openBaseForm('edit')} 
            variant={showBaseForm && baseFormMode === 'edit' ? 'outline' : 'secondary'} className="bg-zinc-100 dark:bg-zinc-800"
          >
            {showBaseForm && baseFormMode === 'edit' ? t('settings.staff.cancelBtn') : t('settings.servicesTab.editBaseBtn')}
          </Button>

          <Button 
            onClick={() => showAddForm ? handleCancelSalonForm() : openAddSalonForm()} 
            variant={showAddForm ? 'outline' : 'primary'}
          >
            {showAddForm ? t('settings.staff.cancelBtn') : t('settings.servicesTab.addSalonService')}
          </Button>
        </div>
      </div>

      {showBaseForm && (
         <Card className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
            <CardBody>
             <h3 className="font-bold mb-4 text-zinc-900 dark:text-zinc-100">
               {baseFormMode === 'edit' ? t('settings.servicesTab.editBaseTitle') : t('settings.servicesTab.createBaseTitle')}
             </h3>
            <form onSubmit={handleSaveBaseService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {baseFormMode === 'edit' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">{t('settings.servicesTab.selectBaseService')}</label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" 
                    value={selectedBaseId} 
                    onChange={e => {
                      const val = e.target.value;
                      setSelectedBaseId(val);
                      if(val) {
                        const existing = baseServices.find(b => (b.id||b.Id) === val);
                        if(existing) {
                          setNewBaseService({
                            name: existing.name || existing.Name || '',
                            description: existing.description || existing.Description || '',
                            category: existing.category || existing.Category || 1
                          });
                        }
                      } else {
                        setNewBaseService({ name: '', description: '', category: 1 });
                      }
                    }}
                    required
                  >
                    <option value="">{t('settings.servicesTab.select')}</option>
                    {baseServices.map(bs => <option key={bs.id || bs.Id} value={bs.id || bs.Id}>{bs.name || bs.Name}</option>)}
                  </select>
                </div>
              )}

              {(baseFormMode === 'create' || (baseFormMode === 'edit' && selectedBaseId)) && (
                <>
                  <Input label={t('settings.servicesTab.serviceName')} required value={newBaseService.name} onChange={e => setNewBaseService({...newBaseService, name: e.target.value})} />
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">{t('settings.servicesTab.category')}</label>
                    <select className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" value={newBaseService.category} onChange={e => setNewBaseService({...newBaseService, category: e.target.value})}>
                      <option value={1}>{t('settings.servicesTab.categories.hair')}</option>
                      <option value={2}>{t('settings.servicesTab.categories.skin')}</option>
                      <option value={3}>{t('settings.servicesTab.categories.nails')}</option>
                      <option value={4}>{t('settings.servicesTab.categories.other')}</option>
                    </select>
                  </div>
                  <div className="md:col-span-2"><Input label={t('settings.servicesTab.description')} required value={newBaseService.description} onChange={e => setNewBaseService({...newBaseService, description: e.target.value})} /></div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                      {t('settings.servicesTab.serviceImage')}
                    </label>
                    <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files[0])} className="block w-full text-sm text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-zinc-200 dark:file:bg-zinc-700 file:text-zinc-700 dark:file:text-zinc-300" />
                  </div>
                  <Button type="submit" loading={isCreatingBase} className="md:col-span-2 mt-2">
                    {baseFormMode === 'edit' ? t('settings.staff.saveEdit') : t('settings.servicesTab.saveBase')}
                  </Button>
                </>
              )}
            </form>
         </CardBody></Card>
      )}

      {showAddForm && (
        <Card className="border-primary/30 shadow-sm transition-all duration-300">
          <CardBody>
            <h3 className="font-bold mb-4 text-primary text-lg">{editingSalonServiceId ? t('settings.servicesTab.editService') : t('settings.servicesTab.addService')}</h3>
            <form onSubmit={handleSubmitSalonService} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">{t('booking.service')}</label>
                <select disabled={!!editingSalonServiceId} required className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 disabled:opacity-50" value={newService.serviceId} onChange={e => setNewService({...newService, serviceId: e.target.value})}>
                  <option value="">{t('settings.servicesTab.select')}</option>
                  {baseServices.map(bs => <option key={bs.id || bs.Id} value={bs.id || bs.Id}>{bs.name || bs.Name}</option>)}
                </select>
              </div>
              <Input label={t('settings.servicesTab.priceUsd')} type="number" min="0" required value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
              <Input label={t('settings.servicesTab.durationMin')} type="number" min="1" required value={newService.durationMinutes} onChange={e => setNewService({...newService, durationMinutes: e.target.value})} />
              <Button type="submit" loading={isSubmitting}>{editingSalonServiceId ? t('settings.staff.saveEdit') : t('settings.servicesTab.addToSalon')}</Button>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody className="p-0 overflow-hidden">
          {loading ? <p className="text-center py-12 text-zinc-500 dark:text-zinc-400">{t('booking.loading')}</p> : (
            <table className="w-full text-right text-sm" dir={i18n?.language === 'ar' ? 'rtl' : 'ltr'}>
              <thead className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                <tr>
                  <th className="px-6 py-4 font-semibold text-start">{t('booking.service')}</th>
                  <th className="px-6 py-4 font-semibold text-start">{t('booking.price')}</th>
                  <th className="px-6 py-4 font-semibold text-start">{t('booking.duration')}</th>
                  <th className="px-6 py-4 text-center font-semibold">{t('settings.servicesTab.available')}</th>
                  <th className="px-6 py-4 text-center font-semibold">{t('settings.servicesTab.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {salonServices.map(s => {
                  const sId = s.id || s.Id;
                  const isAvail = s.isAvailable !== undefined ? s.isAvailable : s.IsAvailable;
                  
                  return (
                    <tr key={sId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-zinc-800 dark:text-zinc-200">
                      <td className="px-6 py-4 font-semibold flex items-center gap-3 text-start">
                        {s.service?.imageUrl && <img src={s.service.imageUrl} alt="" className="w-8 h-8 rounded-md object-cover border dark:border-zinc-700" />}
                        {s.serviceName || s.ServiceName || s.service?.name}
                      </td>
                      <td className="px-6 py-4 text-primary font-bold text-start">${s.price || s.Price}</td>
                      <td className="px-6 py-4 text-start">{s.durationMinutes || s.DurationMinutes} {t('booking.min')}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => toggleAvailability(s)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAvail ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAvail ? 'translate-x-1' : '-translate-x-6'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEditSalonServiceClick(s)} className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                          </button>
                          <button onClick={() => handleDeleteSalonService(sId)} className="p-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
} 