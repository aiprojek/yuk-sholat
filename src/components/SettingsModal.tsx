
import React, { useState, useEffect, useRef } from 'react';
import type { Settings, PrayerTimes, IqamahSettings, TimeCorrections, RunningTextContent, InfoSlide } from '../types';
import { CloseIcon, CheckIcon, SearchIcon } from './icons';
import { CALCULATION_METHODS, ACCENT_COLORS, IQAMAH_PRAYER_NAMES, LATITUDE_ADJUSTMENT_METHODS, MIDNIGHT_MODES, SHAFAQ_OPTIONS, HADITH_THEMES, RUNNING_TEXT_ROTATION_SPEEDS, QURAN_THEMES, DEFAULT_SETTINGS } from '../constants';
import { fetchPrayerTimesByCity, fetchPrayerTimesByAddress } from '../services/prayerTimeService';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, updateSettings }) => {
  const { language, setLanguage, t } = useLanguage();
  const [localSettings, setLocalSettings] = useState(settings);
  const [locationSearchStatus, setLocationSearchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [locationSearchResult, setLocationSearchResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSettings(settings);
    setLocationSearchStatus('idle');
    setLocationSearchResult('');
  }, [settings, isOpen]);

  if (!isOpen) return null;
  
  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };
  
  const handleInputChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
    if (['city', 'country', 'address', 'locationSource', 'calculationMethod', 'school', 'latitudeAdjustmentMethod', 'midnightMode', 'shafaq'].includes(key as string)) {
        setLocationSearchStatus('idle');
        setLocationSearchResult('');
    }
    setLocalSettings(prev => ({...prev, [key]: value}));
  };

  const handleRunningTextContentChange = (contentType: RunningTextContent) => {
    const currentContent = localSettings.runningTextContent || [];
    const newContent = currentContent.includes(contentType)
        ? currentContent.filter(item => item !== contentType)
        : [...currentContent, contentType];
    handleInputChange('runningTextContent', newContent);
  };


  const handleNumericInputChange = <K extends keyof Settings,>(key: K, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
        setLocalSettings(prev => ({...prev, [key]: numValue as Settings[K]}));
    } else if (value === '') {
        setLocalSettings(prev => ({...prev, [key]: 0 as Settings[K]}));
    }
  };


  const handleManualTimeChange = (prayer: keyof PrayerTimes, value: string) => {
    setLocalSettings(prev => ({
        ...prev,
        manualPrayerTimes: {
            ...prev.manualPrayerTimes,
            [prayer]: value
        }
    }));
  };
  
  const handleIqamahChange = (prayer: keyof IqamahSettings, value: string) => {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        setLocalSettings(prev => ({
            ...prev,
            iqamah: {
                ...prev.iqamah,
                [prayer]: numValue
            }
        }));
      }
  };

  const handleTimeCorrectionChange = (prayer: keyof TimeCorrections, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setLocalSettings(prev => ({
          ...prev,
          timeCorrections: {
              ...prev.timeCorrections,
              [prayer]: numValue
          }
      }));
    }
  };

  const handleWallpaperUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const MAX_SIZE_MB = 3;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Image file is too large. Please select an image smaller than ${MAX_SIZE_MB}MB.`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          handleInputChange('wallpaperUrl', e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlarmUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const MAX_SIZE_MB = 5;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Audio file is too large. Please select a file smaller than ${MAX_SIZE_MB}MB.`);
        if (audioFileInputRef.current) {
          audioFileInputRef.current.value = '';
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          handleInputChange('alarmSoundUrl', e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleVerifyLocation = async () => {
    setLocationSearchStatus('loading');
    setLocationSearchResult(t('settings.verifying'));
    try {
      const response = localSettings.locationSource === 'city'
        ? await fetchPrayerTimesByCity(
            new Date(),
            localSettings.city,
            localSettings.country,
            localSettings.calculationMethod,
            localSettings.school,
            localSettings.midnightMode,
            localSettings.shafaq,
          )
        : await fetchPrayerTimesByAddress(
            new Date(),
            localSettings.address,
            localSettings.calculationMethod,
            localSettings.school,
            localSettings.midnightMode,
            localSettings.shafaq,
          );
      
      if (response && response.data) {
        setLocationSearchStatus('success');
        const locationName = localSettings.locationSource === 'city' ? `${localSettings.city}, ${localSettings.country}` : `"${localSettings.address}"`;
        setLocationSearchResult(`${t('settings.locationSuccess')} ${locationName}.`);
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Location verification failed:', error);
      setLocationSearchStatus('error');
      setLocationSearchResult(t('settings.locationError'));
    }
  };

    const handleInfoSlideChange = <K extends keyof InfoSlide,>(id: string, key: K, value: InfoSlide[K]) => {
        setLocalSettings(prev => ({
            ...prev,
            infoSlides: prev.infoSlides.map(slide => 
                slide.id === id ? { ...slide, [key]: value } : slide
            )
        }));
    };

    const handleAddInfoSlide = () => {
        const newSlide: InfoSlide = {
            id: new Date().getTime().toString(),
            content: '',
            duration: 15,
        };
        setLocalSettings(prev => ({
            ...prev,
            infoSlides: [...(prev.infoSlides || []), newSlide]
        }));
    };

    const handleRemoveInfoSlide = (id: string) => {
        setLocalSettings(prev => ({
            ...prev,
            infoSlides: prev.infoSlides.filter(slide => slide.id !== id)
        }));
    };

  const isDark = localSettings.theme === 'dark';

  const labelClass = `block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`;
  const inputClass = `w-full p-2.5 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70`;
  const sectionClass = `p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`;
  const buttonClass = `py-2 px-4 rounded-lg transition ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-slate-200 hover:bg-slate-300'} disabled:opacity-50 disabled:cursor-not-allowed`;

  const PRAYER_NAMES_MANUAL = [
    { key: 'Fajr', label: t('prayers.fajr') }, { key: 'Shuruq', label: t('prayers.shuruq') },
    { key: 'Dhuhr', label: t('prayers.dhuhr') }, { key: 'Asr', label: t('prayers.asr') },
    { key: 'Maghrib', label: t('prayers.maghrib') }, { key: 'Isha', label: t('prayers.isha') },
  ];

  const IQAMAH_NAMES = IQAMAH_PRAYER_NAMES.map(p => ({ ...p, label: t(`prayers.${p.key.toLowerCase()}`)}));


  const isContentSelected = (type: RunningTextContent) => localSettings.runningTextContent?.includes(type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className={`w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl h-5/6 rounded-2xl shadow-2xl flex flex-col ${isDark ? 'bg-gray-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
        <header className="flex items-center justify-between p-4 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgb(226, 232, 240)' }}>
          <h2 className="text-2xl font-bold">{t('settings.title')}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <main className="flex-grow p-6 overflow-y-auto space-y-8">
          {/* General Section */}
          <section className={sectionClass}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: localSettings.accentColor }}>{t('settings.general')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="masjidName" className={labelClass}>{t('settings.masjidName')}</label>
                <input type="text" id="masjidName" value={localSettings.masjidName} onChange={(e) => handleInputChange('masjidName', e.target.value)} className={inputClass} />
              </div>
               <div>
                <label htmlFor="orientation" className={labelClass}>{t('settings.orientation')}</label>
                <select id="orientation" value={localSettings.orientation} onChange={(e) => handleInputChange('orientation', e.target.value as 'landscape' | 'portrait')} className={inputClass}>
                  <option value="landscape">{t('settings.orientationLandscape')}</option>
                  <option value="portrait">{t('settings.orientationPortrait')}</option>
                </select>
              </div>
               <div>
                 <label htmlFor="language" className={labelClass}>{t('settings.language')}</label>
                 <select id="language" value={language} onChange={(e) => setLanguage(e.target.value as 'id' | 'en' | 'ar')} className={inputClass}>
                   <option value="id">Bahasa Indonesia</option>
                   <option value="en">English</option>
                   <option value="ar">العربية</option>
                 </select>
               </div>
            </div>
             <div className="mt-6 space-y-4">
                <div>
                  <label className={labelClass}>{t('settings.runningTextContent')}</label>
                  <div className="flex flex-wrap gap-4 items-center">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={isContentSelected('static')} onChange={() => handleRunningTextContentChange('static')} /> {t('settings.runningTextManual')}
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={isContentSelected('quran')} onChange={() => handleRunningTextContentChange('quran')} /> {t('settings.runningTextQuran')}
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={isContentSelected('hadith')} onChange={() => handleRunningTextContentChange('hadith')} /> {t('settings.runningTextHadith')}
                      </label>
                  </div>
                   <p className="text-xs mt-2 text-gray-500">{t('settings.runningTextMultipleContentHint')}</p>
                </div>

                <div className={`transition-opacity duration-300 ${!isContentSelected('static') ? 'opacity-50 pointer-events-none' : ''}`}>
                  <label htmlFor="runningText" className={labelClass}>{t('settings.runningTextManualLabel')}</label>
                  <textarea id="runningText" rows={2} value={localSettings.runningText} onChange={(e) => handleInputChange('runningText', e.target.value)} className={inputClass} disabled={!isContentSelected('static')}></textarea>
                  <p className="text-xs mt-2 text-gray-500">{t('settings.runningTextHtmlHint')}</p>
                </div>
                
                 <div className={`transition-opacity duration-300 ${!isContentSelected('quran') ? 'opacity-50 pointer-events-none' : ''}`}>
                   <label htmlFor="quranTheme" className={labelClass}>{t('settings.quranTheme')}</label>
                    <select id="quranTheme" value={localSettings.quranTheme} onChange={(e) => handleInputChange('quranTheme', e.target.value)} className={inputClass} disabled={!isContentSelected('quran')}>
                      {QURAN_THEMES.map(theme => <option key={theme.id} value={theme.id}>{t(`constants.quranThemes.${theme.id}`)}</option>)}
                    </select>
                </div>

                <div className={`transition-opacity duration-300 ${!isContentSelected('hadith') ? 'opacity-50 pointer-events-none' : ''}`}>
                   <label htmlFor="hadithTheme" className={labelClass}>{t('settings.hadithTheme')}</label>
                    <select id="hadithTheme" value={localSettings.hadithTheme} onChange={(e) => handleInputChange('hadithTheme', e.target.value)} className={inputClass} disabled={!isContentSelected('hadith')}>
                      {HADITH_THEMES.map(theme => <option key={theme.id} value={theme.id}>{t(`constants.hadithThemes.${theme.id}`)}</option>)}
                    </select>
                </div>
                
                <div className={`transition-opacity duration-300 ${localSettings.runningTextContent?.length <= 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label htmlFor="runningTextRotationSpeed" className={labelClass}>{t('settings.textRotationSpeed')}</label>
                    <select 
                        id="runningTextRotationSpeed" 
                        value={localSettings.runningTextRotationSpeed} 
                        onChange={(e) => handleInputChange('runningTextRotationSpeed', parseInt(e.target.value, 10))} 
                        className={inputClass} 
                        disabled={localSettings.runningTextContent?.length <= 1}
                    >
                        {RUNNING_TEXT_ROTATION_SPEEDS.map(speed => <option key={speed.value} value={speed.value}>{t(`constants.runningTextSpeeds.${speed.value}`)}</option>)}
                    </select>
                </div>

            </div>
          </section>

          {/* Prayer Times Section */}
          <section className={sectionClass}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: localSettings.accentColor }}>{t('settings.prayerTimes')}</h3>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center"><input type="radio" name="prayerTimeSource" value="api" checked={localSettings.prayerTimeSource === 'api'} onChange={() => handleInputChange('prayerTimeSource', 'api')} className="mr-2" /> {t('settings.prayerTimeSourceApi')}</label>
              <label className="flex items-center"><input type="radio" name="prayerTimeSource" value="manual" checked={localSettings.prayerTimeSource === 'manual'} onChange={() => handleInputChange('prayerTimeSource', 'manual')} className="mr-2" /> {t('settings.prayerTimeSourceManual')}</label>
            </div>

            {localSettings.prayerTimeSource === 'api' ? (
              <div className="space-y-6">
                 <div>
                    <label className={labelClass}>{t('settings.locationSource')}</label>
                     <div className="flex space-x-4">
                        <label className="flex items-center"><input type="radio" name="locationSource" value="city" checked={localSettings.locationSource === 'city'} onChange={() => handleInputChange('locationSource', 'city')} className="mr-2" /> {t('settings.locationSourceCity')}</label>
                        <label className="flex items-center"><input type="radio" name="locationSource" value="address" checked={localSettings.locationSource === 'address'} onChange={() => handleInputChange('locationSource', 'address')} className="mr-2" /> {t('settings.locationSourceAddress')}</label>
                    </div>
                </div>

                {localSettings.locationSource === 'city' ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="city" className={labelClass}>{t('settings.city')}</label>
                        <input type="text" id="city" value={localSettings.city} onChange={(e) => handleInputChange('city', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="country" className={labelClass}>{t('settings.country')}</label>
                        <input type="text" id="country" value={localSettings.country} onChange={(e) => handleInputChange('country', e.target.value)} className={inputClass} />
                      </div>
                   </div>
                ) : (
                    <div>
                        <label htmlFor="address" className={labelClass}>{t('settings.address')}</label>
                        <input type="text" id="address" placeholder={t('settings.addressExample')} value={localSettings.address} onChange={(e) => handleInputChange('address', e.target.value)} className={inputClass} />
                    </div>
                )}
                
                <div className="flex items-end gap-2">
                    <button onClick={handleVerifyLocation} disabled={locationSearchStatus === 'loading'} className={`p-2.5 rounded-lg ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-slate-200 hover:bg-slate-300'} transition flex items-center gap-2`}>
                        <SearchIcon className="w-5 h-5"/> {t('settings.verifyLocation')}
                    </button>
                    {locationSearchStatus !== 'idle' && (
                      <div className="text-sm">
                        <p className={
                          locationSearchStatus === 'success' ? 'text-green-400' :
                          locationSearchStatus === 'error' ? 'text-red-400' :
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }>
                          {locationSearchResult}
                        </p>
                      </div>
                    )}
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="calculationMethod" className={labelClass}>{t('settings.calculationMethod')}</label>
                    <select id="calculationMethod" value={localSettings.calculationMethod} onChange={(e) => handleInputChange('calculationMethod', parseInt(e.target.value))} className={inputClass}>
                      {CALCULATION_METHODS.map(method => <option key={method.id} value={method.id}>{t(`constants.calculationMethods.${method.id}`)}</option>)}
                    </select>
                  </div>
                   <div>
                    <label htmlFor="school" className={labelClass}>{t('settings.asrSchool')}</label>
                    <select id="school" value={localSettings.school} onChange={(e) => handleInputChange('school', parseInt(e.target.value) as 0 | 1)} className={inputClass}>
                      <option value="0">{t('constants.asrSchools.0')}</option>
                      <option value="1">{t('constants.asrSchools.1')}</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="latitudeAdjustmentMethod" className={labelClass}>{t('settings.highLatitudeMethod')}</label>
                    <select id="latitudeAdjustmentMethod" value={localSettings.latitudeAdjustmentMethod} onChange={(e) => handleInputChange('latitudeAdjustmentMethod', parseInt(e.target.value))} className={inputClass}>
                      {LATITUDE_ADJUSTMENT_METHODS.map(method => <option key={method.id} value={method.id}>{t(`constants.latitudeAdjustmentMethods.${method.id}`)}</option>)}
                    </select>
                  </div>
                   <div>
                    <label htmlFor="midnightMode" className={labelClass}>{t('settings.midnightMode')}</label>
                    <select id="midnightMode" value={localSettings.midnightMode} onChange={(e) => handleInputChange('midnightMode', parseInt(e.target.value) as 0 | 1)} className={inputClass}>
                      {MIDNIGHT_MODES.map(mode => <option key={mode.id} value={mode.id}>{t(`constants.midnightModes.${mode.id}`)}</option>)}
                    </select>
                  </div>
                   <div>
                    <label htmlFor="shafaq" className={labelClass}>{t('settings.ishaTwilight')}</label>
                    <select id="shafaq" value={localSettings.shafaq} onChange={(e) => handleInputChange('shafaq', e.target.value as 'general' | 'ahmer' | 'abyad')} className={inputClass}>
                      {SHAFAQ_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{t(`constants.shafaqOptions.${opt.id}`)}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PRAYER_NAMES_MANUAL.map(prayer => (
                  <div key={prayer.key}>
                    <label htmlFor={prayer.key} className={labelClass}>{prayer.label}</label>
                    <input type="time" id={prayer.key} value={localSettings.manualPrayerTimes[prayer.key as keyof PrayerTimes]} onChange={(e) => handleManualTimeChange(prayer.key as keyof PrayerTimes, e.target.value)} className={inputClass} />
                  </div>
                ))}
              </div>
            )}
          </section>
          
           {/* Time Correction Section */}
           <section className={sectionClass}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: localSettings.accentColor }}>{t('settings.timeCorrections')}</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {IQAMAH_NAMES.map(prayer => (
                  <div key={prayer.key}>
                    <label htmlFor={`correction-${prayer.key}`} className={labelClass}>{prayer.label}</label>
                    <input type="number" id={`correction-${prayer.key}`} value={localSettings.timeCorrections[prayer.key as keyof TimeCorrections]} onChange={(e) => handleTimeCorrectionChange(prayer.key as keyof TimeCorrections, e.target.value)} className={inputClass} placeholder="0" />
                  </div>
                ))}
              </div>
            </section>

           {/* Prayer Flow Section */}
            <section className={sectionClass}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: localSettings.accentColor }}>{t('settings.prayerFlow')}</h3>
               <p className={labelClass + ' -mb-2'}>{t('settings.iqamahWaitTime')}</p>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {IQAMAH_NAMES.map(prayer => (
                  <div key={prayer.key}>
                    <label htmlFor={`iqamah-${prayer.key}`} className={labelClass}>{prayer.label}</label>
                    <input type="number" id={`iqamah-${prayer.key}`} min="0" value={localSettings.iqamah[prayer.key as keyof IqamahSettings]} onChange={(e) => handleIqamahChange(prayer.key as keyof IqamahSettings, e.target.value)} className={inputClass} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="prayerDuration" className={labelClass}>{t('settings.prayerDuration')}</label>
                  <input type="number" id="prayerDuration" min="0" value={localSettings.prayerDuration} onChange={(e) => handleNumericInputChange('prayerDuration', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="dzikirDuration" className={labelClass}>{t('settings.dzikirDuration')}</label>
                  <input type="number" id="dzikirDuration" min="0" value={localSettings.dzikirDuration} onChange={(e) => handleNumericInputChange('dzikirDuration', e.target.value)} className={inputClass} />
                </div>
              </div>
            </section>
          
          {/* Info Slides Section */}
          <section className={sectionClass}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: localSettings.accentColor }}>{t('settings.infoSlides')}</h3>
            <div className="flex items-center mb-4">
                <input 
                    type="checkbox" 
                    id="enableInfoSlides" 
                    checked={localSettings.enableInfoSlides} 
                    onChange={(e) => handleInputChange('enableInfoSlides', e.target.checked)} 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableInfoSlides" className="ml-2 text-sm font-medium">{t('settings.enableInfoSlides')}</label>
            </div>

            <div className={`space-y-6 transition-opacity duration-300 ${!localSettings.enableInfoSlides ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                    <label htmlFor="infoSlidesClockInterval" className={labelClass}>{t('settings.clockInterval')}</label>
                    <input 
                        type="number" 
                        id="infoSlidesClockInterval" 
                        min="30" 
                        value={localSettings.infoSlidesClockInterval} 
                        onChange={(e) => handleNumericInputChange('infoSlidesClockInterval', e.target.value)} 
                        className={inputClass} 
                        disabled={!localSettings.enableInfoSlides} 
                    />
                    <p className="text-xs mt-2 text-gray-500">{t('settings.clockIntervalHint')}</p>
                </div>

                <div>
                    <label className={labelClass}>{t('settings.slideList')}</label>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {(localSettings.infoSlides || []).map((slide, index) => (
                            <div key={slide.id} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-slate-50 border-gray-200'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">Slide {index + 1}</span>
                                    <button onClick={() => handleRemoveInfoSlide(slide.id)} className={`text-sm ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}>{t('settings.removeSlide')}</button>
                                </div>
                                <textarea
                                    rows={3}
                                    placeholder={t('settings.slideContentPlaceholder')}
                                    value={slide.content}
                                    onChange={(e) => handleInfoSlideChange(slide.id, 'content', e.target.value)}
                                    className={inputClass + ' mb-2'}
                                />
                                 <p className="text-xs -mt-1 mb-2 text-gray-500">{t('settings.slideHtmlHint')}</p>
                                <div>
                                    <label className="text-xs text-gray-400">{t('settings.displayDuration')}</label>
                                    <input
                                        type="number"
                                        min="5"
                                        value={slide.duration}
                                        onChange={(e) => handleInfoSlideChange(slide.id, 'duration', parseInt(e.target.value, 10) || 5)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddInfoSlide} className={buttonClass + ' mt-4'}>+ {t('settings.addSlide')}</button>
                </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className={sectionClass}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: localSettings.accentColor }}>{t('settings.appearance')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>{t('settings.theme')}</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center"><input type="radio" name="theme" value="dark" checked={localSettings.theme === 'dark'} onChange={() => handleInputChange('theme', 'dark')} className="mr-2" /> {t('settings.themeDark')}</label>
                    <label className="flex items-center"><input type="radio" name="theme" value="light" checked={localSettings.theme === 'light'} onChange={() => handleInputChange('theme', 'light')} className="mr-2" /> {t('settings.themeLight')}</label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t('settings.accentColor')}</label>
                  <div className="flex items-center gap-3">
                    {ACCENT_COLORS.map(color => (
                        <button key={color} onClick={() => handleInputChange('accentColor', color)} className="w-8 h-8 rounded-full transition transform hover:scale-110" style={{ backgroundColor: color }}>
                          {localSettings.accentColor === color && <CheckIcon className="w-6 h-6 text-white m-auto"/>}
                        </button>
                    ))}
                     <input type="color" value={localSettings.accentColor} onChange={(e) => handleInputChange('accentColor', e.target.value)} className="w-10 h-10 p-0 border-none rounded-full cursor-pointer bg-transparent"/>
                  </div>
                </div>
            </div>
            <div className="mt-6">
                <label className={labelClass}>{t('settings.background')}</label>
                <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="useWallpaper" 
                      checked={localSettings.useWallpaper} 
                      onChange={(e) => handleInputChange('useWallpaper', e.target.checked)} 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="useWallpaper" className="ml-2 text-sm font-medium">{t('settings.useWallpaper')}</label>
                </div>
            </div>
            <div className={`mt-4 transition-opacity duration-300 ${!localSettings.useWallpaper ? 'opacity-50 pointer-events-none' : ''}`}>
                <label htmlFor="wallpaperUrl" className={labelClass}>{t('settings.wallpaperUrl')}</label>
                <div className="flex items-center gap-2">
                    <input type="text" id="wallpaperUrl" placeholder="https://..." value={localSettings.wallpaperUrl} onChange={(e) => handleInputChange('wallpaperUrl', e.target.value)} className={inputClass} disabled={!localSettings.useWallpaper} />
                    <button onClick={() => fileInputRef.current?.click()} className={buttonClass} disabled={!localSettings.useWallpaper}>{t('settings.upload')}</button>
                    <input type="file" ref={fileInputRef} onChange={handleWallpaperUpload} className="hidden" accept="image/*" />
                </div>
                <p className="text-xs mt-2 text-gray-500">{t('settings.wallpaperHint')}</p>
            </div>
            <div className="mt-6 border-t pt-6" style={{borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgb(226, 232, 240)'}}>
              <label className={labelClass}>{t('settings.alarmSound')}</label>
              <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="enableAlarmSound" 
                    checked={localSettings.enableAlarmSound} 
                    onChange={(e) => handleInputChange('enableAlarmSound', e.target.checked)} 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="enableAlarmSound" className="ml-2 text-sm font-medium">{t('settings.enableAlarmSound')}</label>
              </div>
            </div>
            <div className={`mt-4 transition-opacity duration-300 ${!localSettings.enableAlarmSound ? 'opacity-50 pointer-events-none' : ''}`}>
                <label htmlFor="alarmSoundUrl" className={labelClass}>{t('settings.alarmSoundUrl')}</label>
                <div className="flex items-center gap-2">
                    <input type="text" id="alarmSoundUrl" placeholder="https://..." value={localSettings.alarmSoundUrl} onChange={(e) => handleInputChange('alarmSoundUrl', e.target.value)} className={inputClass} disabled={!localSettings.enableAlarmSound} />
                    <button onClick={() => audioFileInputRef.current?.click()} className={buttonClass} disabled={!localSettings.enableAlarmSound}>{t('settings.upload')}</button>
                    <button onClick={() => handleInputChange('alarmSoundUrl', DEFAULT_SETTINGS.alarmSoundUrl)} className={buttonClass} disabled={!localSettings.enableAlarmSound}>{t('settings.reset')}</button>
                    <input type="file" ref={audioFileInputRef} onChange={handleAlarmUpload} className="hidden" accept="audio/*" />
                </div>
                <p className="text-xs mt-2 text-gray-500">{t('settings.alarmHint')}</p>
                {localSettings.alarmSoundUrl && (
                  <audio controls src={localSettings.alarmSoundUrl} className="mt-2 w-full max-w-sm" key={localSettings.alarmSoundUrl}></audio>
                )}
            </div>
          </section>
        </main>

        <footer className="p-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgb(226, 232, 240)' }}>
            <div className="flex justify-end">
                <button onClick={handleSave} className="text-white font-bold py-2 px-6 rounded-lg transition" style={{ backgroundColor: localSettings.accentColor }}>
                    {t('settings.saveAndClose')}
                </button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
