import type { Settings, PrayerTimes, IqamahSettings, TimeCorrections } from './types';

export const PRAYER_NAMES: { key: keyof PrayerTimes; labelKey: string }[] = [
    { key: 'Fajr', labelKey: 'prayers.fajr' },
    { key: 'Shuruq', labelKey: 'prayers.shuruq' },
    { key: 'Dhuhr', labelKey: 'prayers.dhuhr' },
    { key: 'Asr', labelKey: 'prayers.asr' },
    { key: 'Maghrib', labelKey: 'prayers.maghrib' },
    { key: 'Isha', labelKey: 'prayers.isha' },
];

export const IQAMAH_PRAYER_NAMES: { key: keyof IqamahSettings; labelKey: string }[] = [
    { key: 'Fajr', labelKey: 'prayers.fajr' },
    { key: 'Dhuhr', labelKey: 'prayers.dhuhr' },
    { key: 'Asr', labelKey: 'prayers.asr' },
    { key: 'Maghrib', labelKey: 'prayers.maghrib' },
    { key: 'Isha', labelKey: 'prayers.isha' },
];

export const landscapePrayerDisplayOrder: (keyof PrayerTimes)[] = ['Fajr', 'Shuruq', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
export const portraitDisplayOrder: (keyof PrayerTimes)[] = ['Fajr', 'Shuruq', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const dzikirTexts = [
  { arabic: "أَسْتَغْفِرُ اللهَ الْعَظِيمَ", transliteration: "Astaghfirullahal 'adzim (3x)", weight: 1.5 },
  { arabic: "اَللّهُمَّ أَنْتَ السَّلاَمُ، وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَاْلإِكْرَامِ", transliteration: "Allahumma antas salaam, wa minkas salaam, tabaarakta yaa dzal jalaali wal ikraam.", weight: 2.5 },
  { arabic: "سُبْحَانَ اللهِ", transliteration: "Subhanallah (33x)", weight: 2 },
  { arabic: "اَلْحَمْدُ لِلهِ", transliteration: "Alhamdulillah (33x)", weight: 2 },
  { arabic: "اَللهُ أَكْبَرُ", transliteration: "Allahu Akbar (33x)", weight: 2 },
  { arabic: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ", transliteration: "Laa ilaaha illallaahu wahdahu laa syariikalah, lahul mulku walahul hamdu, wahuwa 'alaa kulli syai-in qadiir.", weight: 3 },
];


export const QURAN_THEMES = [
  { id: 'keimanan' },
  { id: 'ibadah' },
  { id: 'akhlak' },
  { id: 'keluarga' },
];

export const QURAN_VERSES: { [key: string]: { arabic: string, translation: string, surah: string }[] } = {
  keimanan: [
    { arabic: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", translation: "Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya).", surah: "Al-Baqarah: 255" },
    { arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ، ٱللَّهُ ٱلصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", translation: "Katakanlah: 'Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorangpun yang setara dengan Dia'.", surah: "Al-Ikhlas: 1-4" },
    { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا kُنتُمْ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ", translation: "Dan Dia bersama kamu di mana saja kamu berada. Dan Allah Maha Melihat apa yang kamu kerjakan.", surah: "Al-Hadid: 4" },
  ],
  ibadah: [
    { arabic: "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِcِينَ", translation: "Dan dirikanlah shalat, tunaikanlah zakat dan ruku'lah beserta orang-orang yang ruku'.", surah: "Al-Baqarah: 43" },
    { arabic: "إِنَّنِىٓ أَنَا ٱللَّهُ لَآ إِلَٰهَ إِلَّآ أَنَا۠ فَٱcْبُdْنِى وَأَقِمِ ٱلصَّلَوٰةَ لِذِكْرِىٓ", translation: "Sesungguhnya Aku ini adalah Allah, tidak ada Tuhan (yang hak) selain Aku, maka sembahlah Aku dan dirikanlah shalat untuk mengingat Aku.", surah: "Ta-Ha: 14" },
    { arabic: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ", translation: "Hai orang-orang yang beriman, jadikanlah sabar dan shalat sebagai penolongmu, sesungguhnya Allah beserta orang-orang yang sabar.", surah: "Al-Baqarah: 153" },
  ],
  akhlak: [
    { arabic: "وَقُولُوا۟ لِلنَّاسِ حُsْنًا", translation: "Serta ucapkanlah kata-kata yang baik kepada manusia.", surah: "Al-Baqarah: 83" },
    { arabic: "إِنَّ ٱللَّهَ يَأْمُرُ بِٱلْعَدْلِ وَٱلْإِحْسَٰنِ", translation: "Sesungguhnya Allah menyuruh (kamu) berlaku adil dan berbuat kebajikan.", surah: "An-Nahl: 90" },
    { arabic: "وَلَا تَسْتَوِى ٱلْحَسَنَةُ وَلَا ٱلسَّيِّئَةُ ۚ ٱdْفَعْ بِٱلَّتِى هِىَ أَحْسَنُ", translation: "Dan tidaklah sama kebaikan dan kejahatan. Tolaklah (kejahatan itu) dengan cara yang lebih baik.", surah: "Fussilat: 34" },
  ],
  keluarga: [
    { arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّٰتِنَا قُرَّةَ أَعْyُنٍ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", translation: "Ya Tuhan kami, anugerahkanlah kepada kami isteri-isteri kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami imam bagi orang-orang yang bertakwa.", surah: "Al-Furqan: 74" },
    { arabic: "وَوَصَّيْنَا ٱلْإِنسَٰنَ بِوَٰلِدَيْهِ إِحْسَٰنًا", translation: "Kami perintahkan kepada manusia supaya berbuat baik kepada dua orang ibu bapaknya.", surah: "Al-Ahqaf: 15" },
    { arabic: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ قُوٓا۟ أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا", translation: "Hai orang-orang yang beriman, peliharalah dirimu dan keluargamu dari api neraka.", surah: "At-Tahrim: 6" },
  ],
  jumat: [
    { arabic: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ", translation: "Segala puji bagi Allah yang telah menurunkan kepada hamba-Nya Al Kitab (Al-Quran) dan Dia tidak mengadakan kebengkokan di dalamnya.", surah: "Al-Kahfi: 1" },
    { arabic: "إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", translation: "(Ingatlah) tatkala para pemuda itu mencari tempat berlindung ke dalam gua, lalu mereka berdoa: 'Wahai Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu dan sempurnakanlah bagi kami petunjuk yang lurus dalam urusan kami (ini)'.", surah: "Al-Kahfi: 10" },
    { arabic: "وَقُلِ ٱلْحَقُّ مِن رَّبِّكُمْ ۖ فَمَن شَآءَ فَلْيُؤْمِن وَمَن شَآءَ فَلْيَكْفُرْ ۚ", translation: "Dan katakanlah: 'Kebenaran itu datangnya dari Tuhanmu; maka barangsiapa yang ingin (beriman) hendaklah ia beriman, dan barangsiapa yang ingin (kafir) biarlah ia kafir'.", surah: "Al-Kahfi: 29" },
    { arabic: "قُلْ إِنَّمَآ أَنَا۠ bَشَرٌ مِّثْلُكُمْ يُوحَىٰٓ إِلَىَّ أَنَّمَآ إِلَٰهُكُمْ إِلَٰهٌ وَٰحِدٌ ۖ فَمَن كَانَ يَرْجُوا۟ لِقَآءَ رَبِّهِۦ فَلْيَعْمَلْ عَمَلًا صَٰلِحًا وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِۦٓ أَحَدًۢا", translation: "Katakanlah: Sesungguhnya aku ini manusia biasa seperti kamu, yang diwahyukan kepadaku: 'Bahwa sesungguhnya Tuhan kamu itu adalah Tuhan yang Esa'. Barangsiapa mengharap perjumpaan dengan Tuhannya, maka hendaklah ia mengerjakan amal yang saleh dan janganlah ia mempersekutukan seorangpun dalam beribadat kepada Tuhannya'.", surah: "Al-Kahfi: 110" },
  ],
};

export const HADITH_THEMES = [
  { id: 'akhlak' },
  { id: 'iman' },
  { id: 'ilmu' },
  { id: 'doa' },
];

export const HADITHS: { [key: string]: { text: string, narrator: string }[] } = {
  akhlak: [
    { text: "Sesungguhnya yang paling aku cintai di antara kalian dan yang paling dekat tempat duduknya denganku pada hari kiamat adalah yang paling baik akhlaknya.", narrator: "HR. Tirmidzi" },
    { text: "Orang mukmin yang paling sempurna imannya adalah yang paling baik akhlaknya.", narrator: "HR. Tirmidzi" },
    { text: "Tidak ada sesuatu yang lebih berat dalam timbangan seorang mukmin pada hari kiamat daripada akhlak yang baik.", narrator: "HR. Tirmidzi" },
  ],
  iman: [
    { text: "Iman itu ada tujuh puluh lebih cabang, dan malu adalah salah satu cabang dari iman.", narrator: "HR. Bukhari dan Muslim" },
    { text: "Tidak akan masuk surga kecuali orang yang beriman.", narrator: "HR. Muslim" },
    { text: "Perbaharuilah iman kalian. Dikatakan, 'Wahai Rasulullah, bagaimana kami memperbarui iman kami?' Beliau bersabda, 'Perbanyaklah mengucapkan Laa ilaaha illallah.'", narrator: "HR. Ahmad" },
  ],
  ilmu: [
    { text: "Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.", narrator: "HR. Muslim" },
    { text: "Menuntut ilmu itu wajib atas setiap Muslim.", narrator: "HR. Ibnu Majah" },
    { text: "Apabila manusia meninggal dunia, maka terputuslah semua amalnya kecuali tiga (perkara), yaitu sedekah jariyah, ilmu yang bermanfaat, dan anak saleh yang mendoakannya.", narrator: "HR. Muslim" },
  ],
  doa: [
    { text: "Doa adalah senjata seorang mukmin, tiang agama, serta cahaya langit dan bumi.", narrator: "HR. Al-Hakim" },
    { text: "Tidak ada sesuatu yang lebih mulia di sisi Allah Ta'ala daripada doa.", narrator: "HR. Tirmidzi" },
    { text: "Sesungguhnya Rabb kalian Maha Pemalu lagi Maha Mulia. Dia malu terhadap hamba-Nya, jika hamba tersebut menengadahkan tangan kepada-Nya, lalu Dia mengembalikannya dalam keadaan kosong (tidak dikabulkan).", narrator: "HR. Abu Dawud" },
  ],
  jumat: [
    { text: "Sebaik-baik hari di mana matahari terbit adalah hari Jumat. Pada hari itu Adam diciptakan, pada hari itu ia dimasukkan ke surga, dan pada hari itu ia dikeluarkan darinya.", narrator: "HR. Muslim" },
    { text: "Barangsiapa membaca surat Al-Kahfi pada hari Jumat, maka akan dipancarkan cahaya untuknya di antara dua Jumat.", narrator: "HR. Al-Hakim & Al-Baihaqi" },
    { text: "Pada hari Jumat terdapat suatu waktu, dimana jika seorang hamba muslim shalat dan memohon kebaikan kepada Allah, niscaya Allah akan mengabulkannya.", narrator: "HR. Bukhari dan Muslim" },
    { text: "Perbanyaklah shalawat kepadaku pada hari Jumat dan malam Jumat. Barangsiapa yang bershalawat kepadaku satu kali, maka Allah akan bershalawat kepadanya sepuluh kali.", narrator: "HR. Al-Baihaqi" },
  ],
};

export const RUNNING_TEXT_ROTATION_SPEEDS = [
    { value: 15 },
    { value: 30 },
    { value: 45 },
    { value: 60 },
    { value: 120 },
];

export const DEFAULT_PRAYER_TIMES: PrayerTimes = {
  Fajr: '04:30',
  Shuruq: '05:45',
  Dhuhr: '11:45',
  Asr: '15:00',
  Maghrib: '17:45',
  Isha: '18:55',
};

export const DEFAULT_IQAMAH_SETTINGS: IqamahSettings = {
    Fajr: 15,
    Dhuhr: 15,
    Asr: 15,
    Maghrib: 10,
    Isha: 10,
};

export const DEFAULT_TIME_CORRECTIONS: TimeCorrections = {
  Fajr: 0,
  Dhuhr: 0,
  Asr: 0,
  Maghrib: 0,
  Isha: 0,
};

export const DEFAULT_SETTINGS: Settings = {
  masjidName: 'Yuk Sholat',
  runningText: 'Ini adalah contoh running text. Silakan ubah di menu pengaturan. "Dan dirikanlah shalat, tunaikanlah zakat dan ruku\'lah beserta orang-orang yang ruku\'." (QS. Al-Baqarah: 43)',
  runningTextContent: ['static'],
  quranTheme: 'ibadah',
  hadithTheme: 'akhlak',
  runningTextRotationSpeed: 30,
  prayerTimeSource: 'api',
  locationSource: 'city',
  address: 'Masjid Istiqlal, Jakarta, Indonesia',
  city: 'Jakarta',
  country: 'Indonesia',
  calculationMethod: 5, // Kemenag (based on user feedback for accuracy)
  school: 0, // 0 for Shafi
  latitudeAdjustmentMethod: 3, // Angle Based
  midnightMode: 0, // Standard
  shafaq: 'general', // General
  manualPrayerTimes: DEFAULT_PRAYER_TIMES,
  iqamah: DEFAULT_IQAMAH_SETTINGS,
  timeCorrections: DEFAULT_TIME_CORRECTIONS,
  prayerDuration: 10,
  dzikirDuration: 5,
  theme: 'dark',
  accentColor: '#ef4444', // red-500
  useWallpaper: true,
  wallpaperUrl: 'https://cdn.pixabay.com/photo/2018/04/24/17/57/masjid-nabawi-3347602_960_720.jpg',
  orientation: 'landscape',
  enableAlarmSound: true,
  alarmSoundUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_32283e5329.mp3?filename=alarm-clock-90867.mp3',
  enableInfoSlides: false,
  infoSlidesClockInterval: 180, // 3 minutes
  infoSlides: [
    { id: '1', content: '<b>Selamat Datang</b><br>di Masjid Yuk Sholat', duration: 15 },
    { id: '2', content: '<i>"Dan dirikanlah shalat, tunaikanlah zakat dan rukuklah beserta orang-orang yang rukuk."</i><br>(QS. Al-Baqarah: 43)', duration: 20 },
  ],
};

export const CALCULATION_METHODS = [
  { id: 5 }, { id: 3 }, { id: 2 }, { id: 4 }, { id: 6 },
  { id: 1 }, { id: 8 }, { id: 9 }, { id: 11 },
];

export const LATITUDE_ADJUSTMENT_METHODS = [
  { id: 1 }, { id: 2 }, { id: 3 },
];

export const MIDNIGHT_MODES = [
  { id: 0 }, { id: 1 },
];

export const SHAFAQ_OPTIONS = [
  { id: 'general' }, { id: 'ahmer' }, { id: 'abyad' },
];

export const ACCENT_COLORS = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
];