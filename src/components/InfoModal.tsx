import React from 'react';
import { CloseIcon, GitHubIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    theme: 'dark' | 'light';
    accentColor: string;
  };
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, settings }) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  const isDark = settings.theme === 'dark';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgb(226, 232, 240)';
  const linkClass = "font-semibold hover:underline";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
      <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-slate-50 text-slate-900'} rounded-2xl shadow-2xl w-full md:w-2/3 max-w-2xl transform transition-all duration-300 scale-100 flex flex-col`}>
        <header className="flex items-center justify-between p-4 border-b" style={{ borderColor }}>
            <h2 className="text-2xl font-bold" style={{ color: settings.accentColor }}>
                {t('infoModal.title')}
            </h2>
            <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-slate-200'}`}>
              <CloseIcon className="w-6 h-6" />
            </button>
        </header>

        <main className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)'}}>
            <div className="text-center">
                <h3 className="text-3xl font-bold mb-1" style={{ color: settings.accentColor }}>
                    {t('infoModal.appName')}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>{t('infoModal.appVersion')}</p>
            </div>

            <div className="space-y-4 text-start">
                <div>
                    <h4 className="text-lg font-semibold mb-2">{t('infoModal.welcomeTitle')}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        {t('infoModal.welcomeText')}
                    </p>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-2">{t('infoModal.guideTitle')}</h4>
                    <ul className={`list-disc list-inside space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <li dangerouslySetInnerHTML={{ __html: t('infoModal.guideInitialSetup') }} />
                        <li dangerouslySetInnerHTML={{ __html: t('infoModal.guideOfflineMode') }} />
                        <li dangerouslySetInnerHTML={{ __html: t('infoModal.guideScheduleUpdate') }} />
                        <li dangerouslySetInnerHTML={{ __html: t('infoModal.guideCustomization') }} />
                    </ul>
                </div>
                 <div className={`text-sm pt-4 border-t ${isDark ? 'text-gray-300' : 'text-slate-700'}`} style={{ borderColor }}>
                     <p>
                      <strong>{t('infoModal.developer')}</strong> <a href="https://aiprojek01.my.id" target="_blank" rel="noopener noreferrer" className={linkClass} style={{ color: settings.accentColor }}>AI Projek</a>
                    </p>
                    <p>
                      <strong>{t('infoModal.license')}</strong> <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer" className={linkClass} style={{ color: settings.accentColor }}>GNU GPLv3</a>
                    </p>
                </div>
            </div>
        </main>
        
        <footer className="p-6 mt-auto border-t" style={{ borderColor }}>
            <p className="text-center text-sm mb-4">
                {t('infoModal.supportUs')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://lynk.id/aiprojek/s/bvBJvdA" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg text-white transition-transform transform hover:scale-105" style={{ backgroundColor: settings.accentColor }}>
                    ☕ {t('infoModal.donate')}
                </a>
                <a href="https://t.me/aiprojek_community" target="_blank" rel="noopener noreferrer" className={`w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-200 hover:bg-slate-300'}`}>
                    💬 {t('infoModal.contribute')}
                </a>
                 <a href="https://github.com/aiprojek/yuk-sholat" target="_blank" rel="noopener noreferrer" className={`w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-200 hover:bg-slate-300'}`}>
                    <GitHubIcon className="w-5 h-5" /> {t('infoModal.github')}
                </a>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default InfoModal;