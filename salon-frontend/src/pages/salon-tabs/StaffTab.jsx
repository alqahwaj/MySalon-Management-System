import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Card, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useTranslation } from 'react-i18next';

export default function StaffTab() {
  const { t } = useTranslation(); 
  
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState(null);

  const [newStaff, setNewStaff] = useState({ 
    firstName: '', lastName: '', email: '', password: '', phone: '', bio: '' 
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_BASE_URL; 
  const SERVER_URL = API_URL.replace('/api', '');
  
  const fetchStaff = () => {
    setLoading(true);
    api.get('/Stylist')
      .then(res => setStaffList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleEditClick = (staff) => {
    setEditingId(staff.id || staff.Id);
    setNewStaff({
      firstName: staff.firstName || staff.FirstName || '',
      lastName: staff.lastName || staff.LastName || '',
      email: staff.email || staff.Email || '',
      phone: staff.phone || staff.Phone || '',
      bio: staff.bio || staff.Bio || '',
      password: '' 
    });
    setErrorMessage('');
    setSelectedFile(null);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('settings.staff.deleteConfirm'))) {
      try {
        await api.delete(`/Stylist/${id}`);
        fetchStaff();
      } catch (err) {
        alert('Error deleting staff');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(''); 

    try {
      let uploadedImageUrl = "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch(`${API_URL}/Files/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(t('booking.errors.registerFailed'));

        const uploadData = await response.json();
        uploadedImageUrl = uploadData.url; 
      }

      const salonId = import.meta.env.VITE_DEFAULT_SALON_ID;

      if (editingId) {
        const existingStaff = staffList.find(s => (s.id || s.Id) === editingId);
        const payload = {
          firstName: newStaff.firstName,
          lastName: newStaff.lastName,
          email: newStaff.email,
          phone: newStaff.phone,
          bio: newStaff.bio,
          salonId: salonId,
          imageUrl: uploadedImageUrl || existingStaff.imageUrl || existingStaff.ImageUrl || "",
          isActive: existingStaff.isActive !== undefined ? existingStaff.isActive : true
        };
        await api.put(`/Stylist/${editingId}`, payload);
      } else {
        const payload = {
          firstName: newStaff.firstName,
          lastName: newStaff.lastName,
          email: newStaff.email,
          phone: newStaff.phone,
          bio: newStaff.bio,
          imageUrl: uploadedImageUrl,
          salonId: salonId,
          password: newStaff.password, 
          role: 'Stylist' 
        };
        await api.post('/Stylist', payload);
      }
      
      handleCancelForm();
      fetchStaff();

    } catch (err) {
      const errorData = err.response?.data || err.message;
      let msg = t('auth.errors.registerFailed');
      if (errorData?.errors) msg = Object.values(errorData.errors).flat().join(' | ');
      else if (errorData?.message) msg = errorData.message;
      setErrorMessage(msg);
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setNewStaff({ firstName: '', lastName: '', email: '', password: '', phone: '', bio: '' });
    setSelectedFile(null);
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t('settings.staff.title')}</h2>
        <Button 
          onClick={showAddForm ? handleCancelForm : () => setShowAddForm(true)} 
          variant={showAddForm ? 'outline' : 'primary'}
        >
          {showAddForm ? t('settings.staff.cancelBtn') : t('settings.staff.addBtn')}
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-primary/30 shadow-sm transition-all duration-300">
          <CardBody>
            <h3 className="font-bold mb-4 text-primary text-lg">
              {editingId ? t('settings.staff.editTitle') : t('settings.staff.addTitle')}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {errorMessage && (
                <div className="md:col-span-2 p-4 rounded-xl text-sm font-medium border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 flex items-center gap-2">
                  <span>⚠️ {errorMessage}</span>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  {t('booking.service')} {editingId && `(${t('appointments.rescheduleTitle')})`}
                </label>
                <input 
                  type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files[0])}
                  className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              {/* 🌟 الحقول مترجمة بالكامل */}
              <Input label={t('settings.staff.firstName')} required value={newStaff.firstName} onChange={e => setNewStaff({...newStaff, firstName: e.target.value})} />
              <Input label={t('settings.staff.lastName')} required value={newStaff.lastName} onChange={e => setNewStaff({...newStaff, lastName: e.target.value})} />
              <Input label={t('settings.staff.email')} type="email" required value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
              
              {!editingId && (
                <Input label={t('settings.staff.password')} type="password" required minLength="6" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} />
              )}
              
              <Input label={t('settings.staff.phone')} required value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} />
              <Input label={t('settings.staff.bio')} required value={newStaff.bio} onChange={e => setNewStaff({...newStaff, bio: e.target.value})} />
              
              <Button type="submit" loading={isSubmitting} className="md:col-span-2 mt-2">
                {editingId ? t('settings.staff.saveEdit') : t('settings.staff.saveNew')}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map(s => {
          const id = s.id || s.Id;
          return (
            <Card key={id} className="hover:border-primary/30 transition-colors relative group">
              <CardBody className="flex items-center gap-4 p-4">
                
                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => handleEditClick(s)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </button>
                  <button onClick={() => handleDelete(id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>

                {(s.imageUrl || s.ImageUrl) ? (
                  <img 
                    src={`${SERVER_URL}${s.imageUrl || s.ImageUrl}`} 
                    alt="Staff" 
                    className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-full object-cover border-2 border-primary/20 shadow-sm shrink-0" 
                  />
                ) : (
                  <div className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border-2 border-primary/20 shrink-0">
                    {(s.firstName?.[0] || s.FirstName?.[0] || '') + (s.lastName?.[0] || s.LastName?.[0] || '')}
                  </div>
                )}
                
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100 truncate">
                    {s.firstName || s.FirstName} {s.lastName || s.LastName}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
                    {s.bio || s.Bio}
                  </p>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </div>
  );
}