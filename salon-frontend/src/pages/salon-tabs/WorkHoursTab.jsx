import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; 
import api from '../../api/axios';
import { Card, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const DAYS = [0, 1, 2, 3, 4, 5, 6];

export default function WorkHoursTab() {
  const { t } = useTranslation(); 
  const [staff, setStaff] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState('');
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newHour, setNewHour] = useState({ dayOfWeek: '0', startTime: '09:00', endTime: '17:00' });

  useEffect(() => {
    api.get('/Stylist').then(res => setStaff(res.data));
  }, []);

  const fetchHours = (id) => {
    setLoading(true);
    api.get(`/StylistWorkHours/stylist/${id}`).then(res => setHours(res.data)).finally(() => setLoading(false));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/StylistWorkHours', {
        stylistId: selectedStylist,
        dayOfWeek: parseInt(newHour.dayOfWeek),
        startTime: newHour.startTime + ':00',
        endTime: newHour.endTime + ':00',
        isWorking: true
      });
      fetchHours(selectedStylist);
    } catch (err) { 
      alert(t('settings.servicesTab.operationError')); 
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('settings.tabs.workHours')}</h2> 
      
      <select 
        className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none" 
        value={selectedStylist} 
        onChange={e => { setSelectedStylist(e.target.value); fetchHours(e.target.value); }}
      >
        <option value="">{t('common.selectStaff')}</option> 
        {staff.map(s => <option key={s.id || s.Id} value={s.id || s.Id}>{s.firstName || s.FirstName} {s.lastName || s.LastName}</option>)}
      </select>

      {selectedStylist && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardBody>
              <form onSubmit={handleAdd} className="space-y-4">
                <select 
                  className="w-full h-10 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 p-2 outline-none" 
                  value={newHour.dayOfWeek} 
                  onChange={e => setNewHour({...newHour, dayOfWeek: e.target.value})}
                >
                  {DAYS.map(d => <option key={d} value={d}>{t(`common.days.${d}`)}</option>)}
                </select>

                <input 
                  type="time" 
                  className="w-full h-10 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 p-2 outline-none" 
                  value={newHour.startTime} 
                  onChange={e => setNewHour({...newHour, startTime: e.target.value})} 
                />

                <input 
                  type="time" 
                  className="w-full h-10 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 p-2 outline-none" 
                  value={newHour.endTime} 
                  onChange={e => setNewHour({...newHour, endTime: e.target.value})} 
                />

                <Button type="submit" className="w-full">{t('common.save')}</Button>
              </form>
            </CardBody>
          </Card>
          <Card className="lg:col-span-2">
            <CardBody className="p-0">
              <table className="w-full text-right text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-4">{t('common.day')}</th>
                    <th className="px-6 py-4">{t('stylist.schedule.from')}</th>
                    <th className="px-6 py-4">{t('stylist.schedule.to')}</th>
                  </tr>
                </thead>
                <tbody>
                  {hours.map((h, i) => (
                    <tr key={i} className="border-t dark:border-zinc-800">
                      <td className="px-6 py-4">{t(`common.days.${h.dayOfWeek ?? h.DayOfWeek}`)}</td>
                      <td className="px-6 py-4">{h.startTime || h.StartTime}</td>
                      <td className="px-6 py-4">{h.endTime || h.EndTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}