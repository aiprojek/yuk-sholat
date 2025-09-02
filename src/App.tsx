import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSettings } from './hooks/useSettings';
import type { Settings, PrayerTimes, PrayerName, AladhanData, TimeCorrections, AladhanCalendarResponse, AladhanHijriDate } from './types';
import { fetchPrayerTimesByCity, fetchPrayerTimesByAddress, fetchHijriDate } from './services/prayerTimeService';
import { fetchMonthlyPrayerTimesByCity, fetchMonthlyPrayerTimesByAddress } from './services/prayerTimeService';
import { fetchRandomQuranVerse, fetchRandomHadith } from './services/contentService';
import { DEFAULT_PRAYER_TIMES, DEFAULT_SETTINGS, landscapePrayerDisplayOrder, portraitDisplayOrder, dzikirTexts } from './constants';
import SettingsModal from './components/SettingsModal';
import InfoModal from './components/InfoModal';
import RunningText from './components/RunningText';
import { InfoIcon, SettingsIcon } from './components/icons';
import { useLanguage } from './contexts/LanguageContext';

const prayerSequence: PrayerName[] = ['Fajr', 'Shuruq', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const applyTimeCorrection = (time: string, correction: number): string => {
  if (!time || !time.includes(':') || correction === 0) return time;
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + correction);
  const newHours = String(date.getHours()).padStart(2, '0');
  const newMinutes = String(date.getMinutes()).padStart(2, '0');
  return `${newHours}:${newMinutes}`;
};

const formatHijriDateFromApi = (hijri: AladhanHijriDate, lang: 'id' | 'en' | 'ar', t: (key: string) => string): string => {
    if (lang === 'ar') {
        return `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;
    }
    const hijriMonthName = t(`hijriMonths.${hijri.month.en}`);
    const month = hijriMonthName.startsWith('hijriMonths.') ? hijri.month.en : hijriMonthName;
    return `${hijri.day} ${month} ${hijri.year} H`;
};

const PhoneSilenceIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className={className} viewBox="0 0 16 16">
      <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06M6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/>
    </svg>
);

const AlarmIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InfoSlideDisplay: React.FC<{ content: string }> = ({ content }) => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 md:p-8 text-center animate-fade-in">
            <div
                className="font-semibold leading-tight text-shadow-lg"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3.75rem)' }}
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
            />
        </div>
    );
};

const DzikirDisplay: React.FC<{
    settings: Settings;
    isDzikirVisible: boolean;
    currentDzikirIndex: number;
    t: (key: string) => string;
}> = ({ settings, isDzikirVisible, currentDzikirIndex, t }) => {
    const currentDzikir = dzikirTexts[currentDzikirIndex];
    if (!currentDzikir) return null;

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center">
            <h2 className="font-bold mb-8 text-shadow-lg" style={{ color: settings.accentColor, fontSize: 'clamp(1.5rem, 5vw, 2.25rem)' }}>
                {t('main.dzikirTitle')}
            </h2>
            <div className="flex-grow flex items-center justify-center w-full">
                 <div className={`space-y-4 max-w-4xl transition-opacity duration-1000 ease-in-out ${isDzikirVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="leading-tight text-shadow" style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 'clamp(2rem, 8vw, 3.75rem)' }}>
                        {currentDzikir.arabic}
                    </p>
                    <p className="text-shadow" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>
                        {currentDzikir.transliteration}
                    </p>
                </div>
            </div>
        </div>
    );
};

const MainDisplay: React.FC<{
    displayState: 'default' | 'azan' | 'iqamahCountdown' | 'silencePhone' | 'prayerInProgress' | 'dzikir';
    mainDisplayMode: 'clock' | 'infoSlide';
    settings: Settings;
    PRAYER_NAMES: { key: PrayerName; label: string }[];
    currentInfoSlideIndex: number;
    currentTime: Date;
    gregorianDate: string;
    hijriDate: string;
    nextPrayer: { name: PrayerName; time: Date } | null;
    countdown: string;
    iqamahInfo: { prayer: PrayerName; countdown: number } | null;
    isDzikirVisible: boolean;
    currentDzikirIndex: number;
    t: (key: string) => string;
}> = ({
    displayState,
    mainDisplayMode,
    settings,
    PRAYER_NAMES,
    currentInfoSlideIndex,
    currentTime,
    gregorianDate,
    hijriDate,
    nextPrayer,
    countdown,
    iqamahInfo,
    isDzikirVisible,
    currentDzikirIndex,
    t,
}) => {
    const timeFormatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

   switch (displayState) {
        case 'azan':
            return (
                <div className="flex flex-col items-center justify-center text-center p-4 animate-fade-in">
                    <div className="flex items-center gap-4 font-bold text-shadow-lg animate-blink" style={{ fontSize: 'clamp(1.8rem, 6vw, 3.75rem)' }}>
                       <AlarmIcon className="w-[1em] h-[1em]" />
                       <h2>{t('main.azanMessage')}</h2>
                       <AlarmIcon className="w-[1em] h-[1em]" />
                    </div>
                    <p className="mt-4 text-shadow" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.875rem)' }}>{t('main.prepareMessage')}</p>
                </div>
            );
        case 'iqamahCountdown':
            if (iqamahInfo) {
                const minutes = Math.floor(iqamahInfo.countdown / 60);
                const seconds = iqamahInfo.countdown % 60;
                return (
                    <div className="flex flex-col items-center justify-center animate-fade-in">
                        <div className="font-bold tracking-tight text-shadow-lg tabular-nums" style={{ color: settings.accentColor, fontSize: 'clamp(3.5rem, 18vw, 8rem)' }}>
                           {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </div>
                        <p className="mt-2 text-shadow" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.875rem)' }}>{t('main.iqamahCountdown')} {PRAYER_NAMES.find(p => p.key === iqamahInfo.prayer)?.label}</p>
                    </div>
                );
            }
            return null;
        case 'silencePhone':
            return (
                 <div className="flex flex-col items-center justify-center text-center p-4 animate-fade-in">
                    <PhoneSilenceIcon className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 mb-4 text-shadow-lg animate-blink" />
                    <p className="font-semibold text-shadow" style={{ fontSize: 'clamp(1.3rem, 5vw, 2.25rem)' }}>
                       {t('main.silencePhoneTitle')}
                    </p>
                </div>
            );
        case 'prayerInProgress':
             return (
                 <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                    <h2 className="font-bold text-shadow-lg" style={{color: settings.accentColor, fontSize: 'clamp(2.5rem, 10vw, 6rem)'}}>{t('main.prayerInProgressTitle')}</h2>
                    <p className="mt-4 text-shadow" style={{ fontSize: 'clamp(1.3rem, 5vw, 2.25rem)' }}>{t('main.prayerInProgressSubtitle')}</p>
                </div>
            );
        case 'dzikir':
            return <DzikirDisplay settings={settings} isDzikirVisible={isDzikirVisible} currentDzikirIndex={currentDzikirIndex} t={t} />;
        case 'default':
        default:
             if (mainDisplayMode === 'infoSlide' && (settings.infoSlides || []).length > 0) {
                 const currentSlide = settings.infoSlides[currentInfoSlideIndex];
                 return currentSlide ? <InfoSlideDisplay content={currentSlide.content} /> : null;
             }
             return (
                 <div className="flex flex-col items-center justify-center animate-fade-in">
                    <div className="font-bold tracking-tight text-shadow-lg tabular-nums" style={{ fontSize: 'clamp(4rem, 20vw, 10rem)' }}>
                        {timeFormatter.format(currentTime)}
                    </div>
                    <div className="mt-4 text-shadow text-center" style={{ fontSize: 'clamp(1.25rem, 4vw, 2.25rem)' }}>
                       <div>{gregorianDate}</div>
                       <div className="opacity-80">{hijriDate}</div>
                    </div>
                    {nextPrayer && (
                        <div className="mt-6 inline-grid place-items-center rounded-2xl backdrop-blur-md bg-black/30 px-4 py-2 sm:px-6 sm:py-3 text-shadow" style={{ fontSize: 'clamp(1.25rem, 4vw, 2.25rem)' }}>
                            <span className="invisible col-start-1 row-start-1 whitespace-pre">
                               {t('main.countdownPrefix')} <span className="font-semibold">{PRAYER_NAMES.find(p => p.key === 'Isha')?.label}</span>
                               <span className="mx-2">{t('main.countdownSuffix')}</span>
                               <span className="font-semibold tracking-wider tabular-nums">
                                   00:00:00
                               </span>
                            </span>
                    
                            <span className="col-start-1 row-start-1">
                               {t('main.countdownPrefix')} <span className="font-semibold" style={{ color: settings.accentColor }}>{PRAYER_NAMES.find(p => p.key === nextPrayer.name)?.label}</span>
                               <span className="mx-2">{t('main.countdownSuffix')}</span>
                               <span className="font-semibold tracking-wider tabular-nums">
                                   {countdown}
                               </span>
                            </span>
                        </div>
                    )}
                </div>
            );
   }
};

const LandscapeLayout: React.FC<{
    settings: Settings;
    PRAYER_NAMES: { key: PrayerName; label: string }[];
    isJumat: boolean;
    displayState: string;
    nextPrayer: { name: PrayerName; time: Date } | null;
    currentPrayerInSession: PrayerName | null;
    prayerTimes: PrayerTimes;
    children: React.ReactNode;
}> = ({ settings, PRAYER_NAMES, isJumat, displayState, nextPrayer, currentPrayerInSession, prayerTimes, children }) => {
    const isDark = settings.theme === 'dark';
    const { t } = useLanguage();
    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8">
            <header className="text-center w-full">
                <h1 className="font-bold tracking-wider text-shadow-lg" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>{settings.masjidName}</h1>
            </header>
            
            <main className="flex-1 flex flex-col items-center justify-center text-center relative">
                <div className="w-full h-full flex items-center justify-center">
                    {children}
                </div>
            </main>
            
            <footer className="w-full pb-4">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-4 max-w-7xl mx-auto">
                {landscapePrayerDisplayOrder.map(name => {
                    const isDhuhrOnJumat = isJumat && name === 'Dhuhr';
                    const isNext = (displayState === 'default' && nextPrayer?.name === name) || currentPrayerInSession === name;
                    const prayerLabel = isDhuhrOnJumat ? t('prayers.jumat') : PRAYER_NAMES.find(p => p.key === name)?.label;
                    const isHighlighted = isNext || isDhuhrOnJumat;
                    const iqamahMinutes = name !== 'Shuruq' ? settings.iqamah[name as keyof typeof settings.iqamah] : 0;
                    
                    return (
                        <div key={name} className={`p-2 md:p-4 rounded-2xl text-center shadow-lg transition-all duration-300 backdrop-blur-md border-2 ${isHighlighted ? 'border-opacity-100 scale-105 sm:scale-110' : 'border-transparent border-opacity-0'}`}
                             style={{ 
                                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(241, 245, 249, 0.5)',
                                borderColor: isHighlighted ? settings.accentColor : 'transparent', 
                                boxShadow: isHighlighted ? `0 0 30px ${settings.accentColor}`: 'none' 
                             }}
                        >
                            <p className="font-semibold text-shadow" style={{ color: isHighlighted ? settings.accentColor : 'inherit', fontSize: 'clamp(1.1rem, 2.5vw, 1.875rem)' }}>{prayerLabel}</p>
                            <p className="font-bold my-1 text-shadow-md tabular-nums" style={{ fontSize: 'clamp(1.5rem, 4.5vw, 3rem)' }}>{prayerTimes[name]}</p>
                            {name !== 'Shuruq' && (
                                <p className="opacity-80 text-shadow" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>+ {iqamahMinutes}</p>
                            )}
                        </div>
                    );
                })}
              </div>
            </footer>
        </div>
    );
};
    
const PortraitLayout: React.FC<{
    settings: Settings;
    PRAYER_NAMES: { key: PrayerName; label: string }[];
    isJumat: boolean;
    displayState: string;
    nextPrayer: { name: PrayerName; time: Date } | null;
    currentPrayerInSession: PrayerName | null;
    prayerTimes: PrayerTimes;
    children: React.ReactNode;
}> = ({ settings, PRAYER_NAMES, isJumat, displayState, nextPrayer, currentPrayerInSession, prayerTimes, children }) => {
    const isDark = settings.theme === 'dark';
    const { t } = useLanguage();
    return (
         <div className="flex flex-col h-full w-full p-4">
            <header className="text-center pt-4">
              <h1 className="font-bold tracking-wider text-shadow-lg" style={{ fontSize: 'clamp(1.5rem, 6vw, 1.875rem)' }}>{settings.masjidName}</h1>
            </header>
            
            <main className="flex-1 flex flex-col items-center justify-center my-4 relative">
                <div className="w-full h-full flex items-center justify-center">
                    {children}
                </div>
            </main>
            
            <footer className="space-y-2 pb-4 max-w-md w-full mx-auto">
                {portraitDisplayOrder.map(name => {
                    const isDhuhrOnJumat = isJumat && name === 'Dhuhr';
                    const isNext = (displayState === 'default' && nextPrayer?.name === name) || currentPrayerInSession === name;
                    const prayerLabel = isDhuhrOnJumat ? t('prayers.jumat') : PRAYER_NAMES.find(p => p.key === name)?.label;
                    const isHighlighted = isNext || isDhuhrOnJumat;
                    const iqamahMinutes = name !== 'Shuruq' ? settings.iqamah[name as keyof typeof settings.iqamah] : 0;
                    
                    return(
                         <div key={name} className={`flex justify-between items-center p-3 rounded-2xl transition-all duration-300 backdrop-blur-md border-2 ${isHighlighted ? 'border-opacity-100 scale-105' : 'border-transparent border-opacity-0'}`} 
                              style={{ 
                                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(241, 245, 249, 0.5)',
                                borderColor: isHighlighted ? settings.accentColor : 'transparent', 
                                boxShadow: isHighlighted ? `0 0 20px ${settings.accentColor}`: 'none' 
                              }}
                         >
                            <div className="flex-1">
                                <p className="font-semibold text-shadow" style={{ color: isHighlighted ? settings.accentColor : 'inherit', fontSize: 'clamp(1.1rem, 4vw, 1.25rem)' }}>{prayerLabel}</p>
                                {name !== 'Shuruq' && <p className="text-sm opacity-80 text-shadow">{t('settings.iqamahWaitTime')} +{iqamahMinutes} {t('main.minutes')}</p>}
                            </div>
                            <p className="font-bold text-shadow-md tabular-nums" style={{ fontSize: 'clamp(2rem, 8vw, 2.25rem)' }}>{prayerTimes[name]}</p>
                        </div>
                    );
                })}
            </footer>
        </div>
    );
};


const App: React.FC = () => {
    const [settings, updateSettings] = useSettings();
    const { language, t, translations } = useLanguage();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(DEFAULT_PRAYER_TIMES);
    const [hijriDate, setHijriDate] = useState('');
    const [gregorianDate, setGregorianDate] = useState('');
    const [nextPrayer, setNextPrayer] = useState<{ name: PrayerName; time: Date } | null>(null);
    const [countdown, setCountdown] = useState('');
    const [iqamahInfo, setIqamahInfo] = useState<{ prayer: PrayerName; countdown: number } | null>(null);
    const [displayState, setDisplayState] = useState<'default' | 'azan' | 'iqamahCountdown' | 'silencePhone' | 'prayerInProgress' | 'dzikir'>('default');
    const [currentPrayerInSession, setCurrentPrayerInSession] = useState<PrayerName | null>(null);
    const [currentDzikirIndex, setCurrentDzikirIndex] = useState(0);
    const [isDzikirVisible, setIsDzikirVisible] = useState(true);
    const [dynamicRunningText, setDynamicRunningText] = useState(settings.runningText);
    const contentIndexRef = useRef(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [mainDisplayMode, setMainDisplayMode] = useState<'clock' | 'infoSlide'>('clock');
    const [currentInfoSlideIndex, setCurrentInfoSlideIndex] = useState(0);
    const mainDisplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isInfoOpen, setInfoOpen] = useState(false);

    const isDark = settings.theme === 'dark';
    const isJumat = currentTime.getDay() === 5;
    
    const PRAYER_NAMES: { key: PrayerName; label: string }[] = useMemo(() => [
        { key: 'Fajr', label: t('prayers.fajr') },
        { key: 'Shuruq', label: t('prayers.shuruq') },
        { key: 'Dhuhr', label: t('prayers.dhuhr') },
        { key: 'Asr', label: t('prayers.asr') },
        { key: 'Maghrib', label: t('prayers.maghrib') },
        { key: 'Isha', label: t('prayers.isha') },
    ], [t]);


    const playAlarm = useCallback(async () => {
        if (!settings.enableAlarmSound || !audioRef.current) return;

        const ALARM_CACHE_NAME = 'alarm-sound-cache-v1';
        let soundUrl = settings.alarmSoundUrl;

        if (soundUrl === DEFAULT_SETTINGS.alarmSoundUrl) {
            try {
                const cache = await caches.open(ALARM_CACHE_NAME);
                const cachedResponse = await cache.match(DEFAULT_SETTINGS.alarmSoundUrl);
                if (cachedResponse) {
                    const blob = await cachedResponse.blob();
                    soundUrl = URL.createObjectURL(blob);
                }
            } catch (error) {
                console.error('Could not load alarm from cache, using direct URL.', error);
            }
        }
        
        if (audioRef.current.src !== soundUrl) {
            audioRef.current.src = soundUrl;
        }

        audioRef.current.currentTime = 0;
        try {
            await audioRef.current.play();
        } catch (error) {
            console.error("Audio playback failed:", error);
        }
    }, [settings.enableAlarmSound, settings.alarmSoundUrl]);

    const applyAllCorrections = useCallback((times: PrayerTimes, corrections: TimeCorrections): PrayerTimes => {
        const correctedTimes = { ...times };
        (Object.keys(corrections) as Array<keyof TimeCorrections>).forEach(key => {
            if (correctedTimes[key]) {
                correctedTimes[key] = applyTimeCorrection(correctedTimes[key], corrections[key]);
            }
        });
        return correctedTimes;
    }, []);
    
    const fetchAndSetPrayerTimes = useCallback(async () => {
        const currentDate = new Date();
        
        setGregorianDate(new Intl.DateTimeFormat(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(currentDate));

        const setFallbackHijriDate = () => {
            try {
                const formattedDate = new Intl.DateTimeFormat(`${language}-u-ca-islamic`, { day: 'numeric', month: 'long', year: 'numeric' }).format(currentDate);
                setHijriDate(formattedDate.replace(" AH", " H"));
            } catch (e) {
                console.error("Failed to format Hijri date with Intl:", e);
                setHijriDate(""); 
            }
        };
        
        if (isOnline) {
            try {
                const hijriResponse = await fetchHijriDate(currentDate);
                if (hijriResponse.data) {
                    setHijriDate(formatHijriDateFromApi(hijriResponse.data.hijri, language, t));
                } else {
                    setFallbackHijriDate();
                }
            } catch (error) {
                console.error("Failed to fetch Hijri date from API:", error);
                setFallbackHijriDate();
            }
        } else {
            setFallbackHijriDate();
        }

        if (settings.prayerTimeSource === 'manual') {
            const correctedTimes = applyAllCorrections(settings.manualPrayerTimes, settings.timeCorrections);
            setPrayerTimes(correctedTimes);
            return;
        }

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        
        const locationIdentifier = settings.locationSource === 'city' 
            ? `${settings.city}_${settings.country}` 
            : settings.address;
        
        const cacheKey = `prayerTimes_${year}-${String(month).padStart(2, '0')}_${locationIdentifier}_${settings.calculationMethod}_${settings.school}_${settings.midnightMode}_${settings.shafaq}`;
        
        const processApiData = (monthlyData: AladhanData[]) => {
            const todaysData = monthlyData.find(d => parseInt(d.date.gregorian.day, 10) === day);

            if (todaysData) {
                const transformedTimings: PrayerTimes = {
                    Fajr: todaysData.timings.Fajr.split(' ')[0],
                    Shuruq: todaysData.timings.Sunrise.split(' ')[0],
                    Dhuhr: todaysData.timings.Dhuhr.split(' ')[0],
                    Asr: todaysData.timings.Asr.split(' ')[0],
                    Maghrib: todaysData.timings.Maghrib.split(' ')[0],
                    Isha: todaysData.timings.Isha.split(' ')[0],
                };
                const correctedTimes = applyAllCorrections(transformedTimings, settings.timeCorrections);
                setPrayerTimes(correctedTimes);
            } else {
                 console.warn(`Could not find prayer times for day ${day} in cached/fetched data.`);
                 const correctedTimes = applyAllCorrections(settings.manualPrayerTimes, settings.timeCorrections);
                 setPrayerTimes(correctedTimes);
            }
        };

        try {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                const parsedData: AladhanCalendarResponse = JSON.parse(cachedData);
                if (parsedData.data && parsedData.data.length > 0) {
                    processApiData(parsedData.data);
                    return; 
                }
            }
            
            if (!isOnline) {
                console.warn("Offline and no cache for this month.");
                const correctedTimes = applyAllCorrections(settings.manualPrayerTimes, settings.timeCorrections);
                setPrayerTimes(correctedTimes);
                return;
            }

            const response = settings.locationSource === 'address'
                ? await fetchMonthlyPrayerTimesByAddress(year, month, settings.address, settings.calculationMethod, settings.school, settings.midnightMode, settings.shafaq)
                : await fetchMonthlyPrayerTimesByCity(year, month, settings.city, settings.country, settings.calculationMethod, settings.school, settings.midnightMode, settings.shafaq);

            if (response.data && response.data.length > 0) {
                localStorage.setItem(cacheKey, JSON.stringify(response));
                processApiData(response.data);
            } else {
                throw new Error("API returned no data for the current month.");
            }

            const nextMonthDate = new Date(currentDate);
            nextMonthDate.setMonth(currentDate.getMonth() + 1);
            const nextYear = nextMonthDate.getFullYear();
            const nextMonth = nextMonthDate.getMonth() + 1;
            const nextMonthCacheKey = `prayerTimes_${nextYear}-${String(nextMonth).padStart(2, '0')}_${locationIdentifier}_${settings.calculationMethod}_${settings.school}_${settings.midnightMode}_${settings.shafaq}`;
            
            if (!localStorage.getItem(nextMonthCacheKey)) {
                 const nextMonthResponse = settings.locationSource === 'address'
                    ? await fetchMonthlyPrayerTimesByAddress(nextYear, nextMonth, settings.address, settings.calculationMethod, settings.school, settings.midnightMode, settings.shafaq)
                    : await fetchMonthlyPrayerTimesByCity(nextYear, nextMonth, settings.city, settings.country, settings.calculationMethod, settings.school, settings.midnightMode, settings.shafaq);
                if (nextMonthResponse.data) {
                    localStorage.setItem(nextMonthCacheKey, JSON.stringify(nextMonthResponse));
                }
            }
        } catch (error) {
            console.error("Error fetching prayer times: ", error);
            const correctedTimes = applyAllCorrections(settings.manualPrayerTimes, settings.timeCorrections);
            setPrayerTimes(correctedTimes);
        }
    }, [
        settings.prayerTimeSource, settings.manualPrayerTimes, settings.city, settings.country,
        settings.address, settings.locationSource, settings.calculationMethod, settings.school, 
        settings.midnightMode, settings.shafaq, settings.timeCorrections, isOnline, 
        applyAllCorrections, language, t
    ]);

    // Effect for running text rotation
    useEffect(() => {
        let isMounted = true;
        
        const fetchAndSetContent = async () => {
            if (!isMounted) return;

            const contentTypes = settings.runningTextContent;
            if (!contentTypes || contentTypes.length === 0) {
                setDynamicRunningText(settings.runningText);
                return;
            }

            const isCurrentlyJumat = new Date().getDay() === 5;
            const currentIndex = contentIndexRef.current % contentTypes.length;
            const currentContentType = contentTypes[currentIndex];
            
            try {
                switch (currentContentType) {
                    case 'quran':
                        setDynamicRunningText("Loading Quran verse...");
                        const quranTheme = isCurrentlyJumat ? 'jumat' : settings.quranTheme;
                        const verse = await fetchRandomQuranVerse(quranTheme);
                        if(isMounted) setDynamicRunningText(verse);
                        break;
                    case 'hadith':
                        const hadithTheme = isCurrentlyJumat ? 'jumat' : settings.hadithTheme;
                        const hadith = await fetchRandomHadith(hadithTheme);
                        if(isMounted) setDynamicRunningText(hadith);
                        break;
                    case 'static':
                    default:
                        if(isMounted) setDynamicRunningText(settings.runningText);
                        break;
                }
            } catch (error) {
                console.error("Failed to update running text:", error);
                if(isMounted) setDynamicRunningText(settings.runningText); // Fallback
            }
            
            contentIndexRef.current += 1;
        };
        
        fetchAndSetContent(); 
        
        const intervalId = (settings.runningTextContent && settings.runningTextContent.length > 1)
          ? setInterval(fetchAndSetContent, settings.runningTextRotationSpeed * 1000)
          : null;

        return () => {
            isMounted = false;
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [settings.runningText, settings.runningTextContent, settings.quranTheme, settings.hadithTheme, settings.runningTextRotationSpeed]);


    useEffect(() => {
        fetchAndSetPrayerTimes();
        const dailyUpdate = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() < 5) { 
                fetchAndSetPrayerTimes();
            }
        }, 1000 * 60 * 5);
        return () => clearInterval(dailyUpdate);
    }, [fetchAndSetPrayerTimes]);
    
    useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      const cacheDefaultAlarm = async () => {
        try {
            const ALARM_CACHE_NAME = 'alarm-sound-cache-v1';
            const cache = await caches.open(ALARM_CACHE_NAME);
            const response = await cache.match(DEFAULT_SETTINGS.alarmSoundUrl);
            if (!response) {
                console.log('Default alarm sound not in cache, fetching and caching...');
                const fetchResponse = await fetch(DEFAULT_SETTINGS.alarmSoundUrl);
                await cache.put(DEFAULT_SETTINGS.alarmSoundUrl, fetchResponse);
            }
        } catch (error) {
            console.error('Failed to cache alarm sound:', error);
        }
      };
      
      cacheDefaultAlarm();

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    // Effect for handling timed state transitions
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        
        if (displayState === 'azan') {
            timer = setTimeout(() => {
                const iqamahDuration = iqamahInfo?.countdown ?? 0;
                 if (iqamahDuration > 0) {
                     setDisplayState('iqamahCountdown');
                 } else {
                     setDisplayState('silencePhone');
                 }
            }, 10000); // 10 seconds for azan message
        } else if (displayState === 'silencePhone') {
            timer = setTimeout(() => {
                setDisplayState('prayerInProgress');
            }, 7000); // 7 seconds for phone silence message
        } else if (displayState === 'prayerInProgress') {
            timer = setTimeout(() => {
                setDisplayState('dzikir');
            }, settings.prayerDuration * 60 * 1000);
        } else if (displayState === 'dzikir') {
            timer = setTimeout(() => {
                setDisplayState('default');
                setCurrentPrayerInSession(null);
                fetchAndSetPrayerTimes(); // Resync for next day or any updates
            }, settings.dzikirDuration * 60 * 1000);
        }
        
        return () => clearTimeout(timer);
    }, [displayState, fetchAndSetPrayerTimes, settings.prayerDuration, settings.dzikirDuration, iqamahInfo]);

    
    // Effect for cycling dzikir with fade transitions
    useEffect(() => {
        if (displayState === 'dzikir') {
            let isMounted = true;
            let mainTimer: ReturnType<typeof setTimeout>;
            let transitionTimer: ReturnType<typeof setTimeout>;

            const totalDzikirDurationMs = settings.dzikirDuration * 60 * 1000;
            if (totalDzikirDurationMs <= 0 || dzikirTexts.length === 0) return;

            const totalWeight = dzikirTexts.reduce((sum, item) => sum + item.weight, 0);
            const FADE_DURATION = 1000; // ms

            const cycleDzikir = (index: number) => {
                if (!isMounted) return;

                const currentItemWeight = dzikirTexts[index].weight;
                const durationForItem = Math.max(
                    (totalDzikirDurationMs / totalWeight) * currentItemWeight, 
                    FADE_DURATION
                );

                mainTimer = setTimeout(() => {
                    if (!isMounted) return;
                    
                    setIsDzikirVisible(false);

                    transitionTimer = setTimeout(() => {
                        if (!isMounted) return;
                        const nextIndex = (index + 1) % dzikirTexts.length;
                        setCurrentDzikirIndex(nextIndex);
                        setIsDzikirVisible(true);
                        
                        cycleDzikir(nextIndex);
                    }, FADE_DURATION);

                }, durationForItem);
            };

            setCurrentDzikirIndex(0);
            setIsDzikirVisible(true);
            cycleDzikir(0);

            return () => {
                isMounted = false;
                clearTimeout(mainTimer);
                clearTimeout(transitionTimer);
            };
        }
    }, [displayState, settings.dzikirDuration]);


    // Main countdown and prayer state logic
    useEffect(() => {
        if (displayState === 'iqamahCountdown' && iqamahInfo) {
            const iqamahTimer = setInterval(() => {
                setIqamahInfo(prev => {
                    if (prev && prev.countdown > 1) {
                        return { ...prev, countdown: prev.countdown - 1 };
                    }
                    clearInterval(iqamahTimer);
                    playAlarm();
                    setIqamahInfo(null);
                    setDisplayState('silencePhone');
                    return null;
                });
            }, 1000);
            return () => clearInterval(iqamahTimer);
        } else if (displayState === 'default') {
            const today = new Date();
            const prayerDateObjects = prayerSequence.map(name => {
                const timeParts = prayerTimes[name].split(':');
                if (timeParts.length !== 2) return { name, time: new Date(0) }; // Invalid time
                const date = new Date(today);
                date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);
                return { name, time: date };
            }).filter(p => p.time.getTime() !== 0);

            let next = prayerDateObjects.find(p => p.time > currentTime);

            if (!next && prayerDateObjects.length > 0) {
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const firstPrayerTime = prayerTimes[prayerSequence[0]].split(':');
                const nextDate = new Date(tomorrow);
                if(firstPrayerTime.length === 2) {
                    nextDate.setHours(parseInt(firstPrayerTime[0]), parseInt(firstPrayerTime[1]), 0, 0);
                    next = { name: prayerSequence[0], time: nextDate };
                }
            }
            
            setNextPrayer(next || null);

            if (next) {
                const diff = next.time.getTime() - currentTime.getTime();
                
                 if (diff <= 1000 && diff > -1000) { // Time for prayer
                    const prayerName = next.name;
                    if(prayerName !== 'Shuruq'){
                        const iqamahDuration = settings.iqamah[prayerName as keyof typeof settings.iqamah] * 60;
                        setIqamahInfo({ prayer: prayerName, countdown: iqamahDuration });
                        setCurrentPrayerInSession(prayerName);
                        playAlarm();
                        setDisplayState('azan');
                    }
                } else {
                    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
                    if (hours > 0) {
                        setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
                    } else {
                        setCountdown(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
                    }
                }
            }
        }
    }, [currentTime, prayerTimes, settings.iqamah, displayState, playAlarm]);
    
    // Effect for info slide rotation
    useEffect(() => {
        const clearTimer = () => {
            if (mainDisplayTimerRef.current) {
                clearTimeout(mainDisplayTimerRef.current);
                mainDisplayTimerRef.current = null;
            }
        };

        const shouldRunSlides = settings.enableInfoSlides && (settings.infoSlides || []).length > 0 && displayState === 'default';

        if (!shouldRunSlides) {
            if (mainDisplayMode !== 'clock') {
              setMainDisplayMode('clock');
            }
            clearTimer();
            return;
        }

        const currentSlides = settings.infoSlides;

        if (mainDisplayMode === 'clock') {
            mainDisplayTimerRef.current = setTimeout(() => {
                setMainDisplayMode('infoSlide');
            }, settings.infoSlidesClockInterval * 1000);
        } else if (mainDisplayMode === 'infoSlide') {
            const slideDuration = currentSlides[currentInfoSlideIndex]?.duration || 15;
            mainDisplayTimerRef.current = setTimeout(() => {
                setCurrentInfoSlideIndex(prevIndex => (prevIndex + 1) % currentSlides.length);
                setMainDisplayMode('clock');
            }, slideDuration * 1000);
        }

        return clearTimer;

    }, [
        mainDisplayMode,
        displayState,
        settings.enableInfoSlides,
        settings.infoSlides,
        settings.infoSlidesClockInterval,
        currentInfoSlideIndex
    ]);

    if (!translations.settings) {
        return <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
    }

    const mainDisplayProps = {
        displayState,
        mainDisplayMode,
        settings,
        PRAYER_NAMES,
        currentInfoSlideIndex,
        currentTime,
        gregorianDate,
        hijriDate,
        nextPrayer,
        countdown,
        iqamahInfo,
        isDzikirVisible,
        currentDzikirIndex,
        t,
    };

    const layoutProps = {
        settings,
        PRAYER_NAMES,
        isJumat,
        displayState,
        nextPrayer,
        currentPrayerInSession,
        prayerTimes,
    };

    const containerStyle: React.CSSProperties & { '--accent-color': string; } = {
        '--accent-color': settings.accentColor,
    };

    if (settings.useWallpaper) {
        containerStyle.backgroundImage = `url("${settings.wallpaperUrl}")`;
        containerStyle.backgroundSize = 'cover';
        containerStyle.backgroundPosition = 'center';
    }

    const containerClasses = [
        'h-screen', 'w-screen', 'overflow-hidden', 'flex', 'flex-col', 'transition-colors', 'duration-500',
        isDark ? 'text-white' : 'text-slate-800',
        !settings.useWallpaper && (isDark ? 'bg-gradient-to-br from-gray-900 to-slate-800' : 'bg-gradient-to-br from-slate-100 to-slate-300')
    ].filter(Boolean).join(' ');


    return (
        <div 
          className={containerClasses}
          style={containerStyle}
        >
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet" />
            
            <style>{`
                .tabular-nums {
                  font-variant-numeric: tabular-nums;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.7s ease-out forwards;
                }
                @keyframes blink {
                    50% { opacity: 0.3; }
                }
                .animate-blink {
                    animation: blink 1.5s linear infinite;
                }
            `}</style>

            <audio ref={audioRef} preload="auto" />

            {settings.useWallpaper && <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/10'}`}></div>}
            
            <div className="relative z-10 p-4 flex justify-between items-start">
                <div>
                  <button onClick={() => setInfoOpen(true)} className={`p-2 rounded-full backdrop-blur-sm ${isDark ? 'bg-black/20 hover:bg-black/40' : 'bg-slate-100/30 hover:bg-slate-100/50'} transition`}>
                      <InfoIcon className="w-8 h-8" />
                  </button>
                </div>
                <button onClick={() => setSettingsOpen(true)} className={`p-2 rounded-full backdrop-blur-sm ${isDark ? 'bg-black/20 hover:bg-black/40' : 'bg-slate-100/30 hover:bg-slate-100/50'} transition`}>
                    <SettingsIcon className="w-8 h-8" />
                </button>
            </div>
            
            <main className="relative flex-grow z-10 flex flex-col min-h-0">
                 {settings.orientation === 'landscape' ? (
                    <LandscapeLayout {...layoutProps}>
                        <MainDisplay {...mainDisplayProps} />
                    </LandscapeLayout>
                ) : (
                    <PortraitLayout {...layoutProps}>
                        <MainDisplay {...mainDisplayProps} />
                    </PortraitLayout>
                )}
            </main>

            {displayState === 'default' && mainDisplayMode === 'clock' && (
                <footer className="relative z-10">
                    <div className={`w-full py-3 md:py-4 ${isDark ? 'bg-black/60' : 'bg-slate-100/70'} backdrop-blur-sm flex items-center justify-between text-sm`}>
                        <div className="px-4 whitespace-nowrap">
                            <span className={`w-3 h-3 rounded-full inline-block mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                            {isOnline ? t('main.online') : t('main.offline')}
                        </div>
                        <div className={`flex-1 overflow-hidden ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            <RunningText text={dynamicRunningText} accentColor={settings.accentColor} />
                        </div>
                        <div className="px-4 whitespace-nowrap opacity-80 hidden sm:block">
                            {t('main.createdBy')}
                        </div>
                    </div>
                </footer>
            )}
            
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} updateSettings={updateSettings}/>
            <InfoModal isOpen={isInfoOpen} onClose={() => setInfoOpen(false)} settings={settings}/>
        </div>
    );
};

export default App;