
import { useState, useCallback } from 'react';
import type { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const SETTINGS_STORAGE_KEY = 'masjid-display-settings';
const LOCAL_WALLPAPER_KEY = 'masjid-display-local-wallpaper';
const LOCAL_ALARM_KEY = 'masjid-display-local-alarm';

export const useSettings = (): [Settings, (newSettings: Partial<Settings>) => void] => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettingsJSON = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const settingsData = storedSettingsJSON 
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettingsJSON) } 
        : DEFAULT_SETTINGS;

      // If wallpaper is stored locally, load it.
      if (settingsData.wallpaperUrl === 'local-wallpaper') {
          const localWallpaper = localStorage.getItem(LOCAL_WALLPAPER_KEY);
          if (localWallpaper) {
              settingsData.wallpaperUrl = localWallpaper;
          } else {
              // If local wallpaper is missing from storage, revert to default.
              settingsData.wallpaperUrl = DEFAULT_SETTINGS.wallpaperUrl;
          }
      }
      
      // If alarm sound is stored locally, load it.
      if (settingsData.alarmSoundUrl === 'local-alarm') {
          const localAlarm = localStorage.getItem(LOCAL_ALARM_KEY);
          if (localAlarm) {
              settingsData.alarmSoundUrl = localAlarm;
          } else {
              settingsData.alarmSoundUrl = DEFAULT_SETTINGS.alarmSoundUrl;
          }
      }

      return settingsData;
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
      // On error, clear potentially corrupted storage
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      localStorage.removeItem(LOCAL_WALLPAPER_KEY);
      localStorage.removeItem(LOCAL_ALARM_KEY);
      return DEFAULT_SETTINGS;
    }
  });

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prevSettings => {
        const updatedSettings = { ...prevSettings, ...newSettings };
        
        const wallpaperUrl = updatedSettings.wallpaperUrl;
        const isLocalWallpaper = wallpaperUrl.startsWith('data:image/');

        const alarmSoundUrl = updatedSettings.alarmSoundUrl;
        const isLocalAlarm = alarmSoundUrl.startsWith('data:audio/');

        const settingsToPersist = { ...updatedSettings };
        if (isLocalWallpaper) {
            settingsToPersist.wallpaperUrl = 'local-wallpaper';
        }
        if (isLocalAlarm) {
            settingsToPersist.alarmSoundUrl = 'local-alarm';
        }

        try {
            if (isLocalWallpaper) {
                localStorage.setItem(LOCAL_WALLPAPER_KEY, wallpaperUrl);
            } else {
                localStorage.removeItem(LOCAL_WALLPAPER_KEY);
            }
             if (isLocalAlarm) {
                localStorage.setItem(LOCAL_ALARM_KEY, alarmSoundUrl);
            } else {
                localStorage.removeItem(LOCAL_ALARM_KEY);
            }
            
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToPersist));
            
            return updatedSettings;

        } catch (error) {
            console.error('Error saving settings to localStorage:', error);
            if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
                alert('Gagal menyimpan file: Ukuran wallpaper atau suara alarm terlalu besar. File tersebut tidak disimpan. Setelan lain telah disimpan.');
                
                const revertedSettings = { ...updatedSettings };
                if (isLocalWallpaper) revertedSettings.wallpaperUrl = prevSettings.wallpaperUrl;
                if (isLocalAlarm) revertedSettings.alarmSoundUrl = prevSettings.alarmSoundUrl;

                const revertedSettingsToPersist = { ...revertedSettings };
                if (revertedSettings.wallpaperUrl.startsWith('data:image/')) {
                    revertedSettingsToPersist.wallpaperUrl = 'local-wallpaper';
                } else {
                    localStorage.removeItem(LOCAL_WALLPAPER_KEY);
                }
                if (revertedSettings.alarmSoundUrl.startsWith('data:audio/')) {
                    revertedSettingsToPersist.alarmSoundUrl = 'local-alarm';
                } else {
                    localStorage.removeItem(LOCAL_ALARM_KEY);
                }
                
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(revertedSettingsToPersist));
                
                return revertedSettings;
            } else {
                alert('An unexpected error occurred while saving settings.');
                return prevSettings; // Revert all changes on other errors
            }
        }
    });
  }, []);

  return [settings, updateSettings];
};
