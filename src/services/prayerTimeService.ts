
import type { AladhanTimingsResponse, AladhanCalendarResponse, GToHResponse } from '../types';

const API_BASE_URL = 'https://api.aladhan.com/v1';

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export const fetchHijriDate = async (date: Date): Promise<GToHResponse> => {
    const dateString = formatDate(date);
    const url = `${API_BASE_URL}/gToH?date=${dateString}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        const data = await response.json();
        return data as GToHResponse;
    } catch (error) {
        console.error('Failed to fetch Hijri date:', error);
        throw error;
    }
};

export const fetchPrayerTimesByCity = async (
  date: Date,
  city: string,
  country: string,
  method: number,
  school: 0 | 1,
  midnightMode: 0 | 1,
  shafaq: string,
): Promise<AladhanTimingsResponse> => {
  const dateString = formatDate(date);
  const url = `${API_BASE_URL}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&school=${school}&midnightMode=${midnightMode}&shafaq=${shafaq}&date_or_timestamp=${dateString}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data as AladhanTimingsResponse;
  } catch (error) {
    console.error('Failed to fetch prayer times by city:', error);
    throw error;
  }
};

export const fetchPrayerTimesByAddress = async (
  date: Date,
  address: string,
  method: number,
  school: 0 | 1,
  midnightMode: 0 | 1,
  shafaq: string,
): Promise<AladhanTimingsResponse> => {
  const dateString = formatDate(date);
  const url = `${API_BASE_URL}/timingsByAddress?address=${encodeURIComponent(address)}&method=${method}&school=${school}&midnightMode=${midnightMode}&shafaq=${shafaq}&date_or_timestamp=${dateString}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data as AladhanTimingsResponse;
  } catch (error) {
    console.error('Failed to fetch prayer times by address:', error);
    throw error;
  }
};

export const fetchMonthlyPrayerTimesByCity = async (
  year: number,
  month: number,
  city: string,
  country: string,
  method: number,
  school: 0 | 1,
  midnightMode: 0 | 1,
  shafaq: string,
): Promise<AladhanCalendarResponse> => {
  const url = `${API_BASE_URL}/calendarByCity?year=${year}&month=${month}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&school=${school}&midnightMode=${midnightMode}&shafaq=${shafaq}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data as AladhanCalendarResponse;
  } catch (error) {
    console.error('Failed to fetch monthly prayer times by city:', error);
    throw error;
  }
};

export const fetchMonthlyPrayerTimesByAddress = async (
  year: number,
  month: number,
  address: string,
  method: number,
  school: 0 | 1,
  midnightMode: 0 | 1,
  shafaq: string,
): Promise<AladhanCalendarResponse> => {
  const url = `${API_BASE_URL}/calendarByAddress?year=${year}&month=${month}&address=${encodeURIComponent(address)}&method=${method}&school=${school}&midnightMode=${midnightMode}&shafaq=${shafaq}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data as AladhanCalendarResponse;
  } catch (error) {
    console.error('Failed to fetch monthly prayer times by address:', error);
    throw error;
  }
};
