import { useState } from 'react';
import Button from '../components/ui/Button';
import ServicesTab from './salon-tabs/ServicesTab';
import StaffTab from './salon-tabs/StaffTab';
import WorkHoursTab from './salon-tabs/WorkHoursTab';
import { useTranslation } from 'react-i18next';

export default function SalonSettings() {
  const { t, i18n } = useTranslation(); 
  
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {t('settings.title')}
        </h1>
        <p className="text-zinc-500 mt-2">
          {t('settings.subtitle')}
        </p>
      </header>

      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8 overflow-x-auto whitespace-nowrap">
        <Button variant={activeTab === 'services' ? 'primary' : 'outline'} onClick={() => setActiveTab('services')}>
          {t('settings.tabs.services')}
        </Button>
        <Button variant={activeTab === 'staff' ? 'primary' : 'outline'} onClick={() => setActiveTab('staff')}>
          {t('settings.tabs.staff')}
        </Button>
        <Button variant={activeTab === 'hours' ? 'primary' : 'outline'} onClick={() => setActiveTab('hours')}>
          {t('settings.tabs.workHours')}
        </Button>
      </div>

      <main>
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'staff' && <StaffTab />}
        {activeTab === 'hours' && <WorkHoursTab />}
      </main>
    </div>
  );
}