
export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Shuruq: string;
}

export type PrayerName = keyof PrayerTimes;

export interface IqamahSettings {
  Fajr: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}

export interface TimeCorrections {
  Fajr: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}

export type RunningTextContent = 'static' | 'quran' | 'hadith';

export interface InfoSlide {
  id: string;
  content: string;
  duration: number; // in seconds
}

export interface Settings {
  masjidName: string;
  runningText: string;
  runningTextContent: RunningTextContent[];
  quranTheme: string;
  hadithTheme: string;
  runningTextRotationSpeed: number;
  prayerTimeSource: 'api' | 'manual';
  locationSource: 'city' | 'address';
  address: string;
  city: string;
  country: string;
  calculationMethod: number;
  school: 0 | 1; // 0 for Shafi, 1 for Hanafi
  latitudeAdjustmentMethod: number;
  midnightMode: 0 | 1;
  shafaq: 'general' | 'ahmer' | 'abyad';
  manualPrayerTimes: PrayerTimes;
  iqamah: IqamahSettings;
  timeCorrections: TimeCorrections;
  prayerDuration: number;
  dzikirDuration: number;
  theme: 'dark' | 'light';
  accentColor: string;
  useWallpaper: boolean;
  wallpaperUrl: string;
  orientation: 'landscape' | 'portrait';
  enableAlarmSound: boolean;
  alarmSoundUrl: string;
  enableInfoSlides: boolean;
  infoSlidesClockInterval: number; // in seconds
  infoSlides: InfoSlide[];
}

export interface AladhanTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
}

export interface AladhanHijriDate {
  date: string; // e.g., "10-03-1446"
  day: string; // e.g., "10"
  weekday: { en: string; ar: string };
  month: { en: string; ar: string; number: number };
  year: string;
}

export interface AladhanGregorianDate {
  date: string; // "03-09-2024"
  format: string; // "DD-MM-YYYY"
  day: string; // "03"
  weekday: { en: string };
  month: { number: number; en: string };
  year: string;
}

export interface AladhanDate {
  readable: string; // e.g., "03 Sep 2024"
  timestamp: string;
  hijri: AladhanHijriDate;
  gregorian: AladhanGregorianDate;
}

export interface AladhanData {
  timings: AladhanTimings;
  date: AladhanDate;
}

export interface AladhanCalendarResponse {
  code: number;
  status: string;
  data: AladhanData[];
}

export interface AladhanTimingsResponse {
  code: number;
  status: string;
  data: AladhanData;
}

export interface GToHResponse {
  code: number;
  status: string;
  data: AladhanDate;
}
