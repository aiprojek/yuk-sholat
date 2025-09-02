import { HADITHS, QURAN_VERSES } from '../constants';

/**
 * Fetches a random Quran verse from the local collection based on a theme.
 * @param theme The theme of the verse to fetch.
 * @returns A formatted string containing the verse, translation, and surah reference.
 */
export const fetchRandomQuranVerse = async (theme: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const verseCollection = QURAN_VERSES[theme];
        if (!verseCollection || verseCollection.length === 0) {
            return reject(new Error(`No verses found for theme: ${theme}`));
        }
        const randomIndex = Math.floor(Math.random() * verseCollection.length);
        const verse = verseCollection[randomIndex];
        resolve(`"${verse.arabic}" (QS. ${verse.surah}) — Artinya: "${verse.translation}"`);
    });
};

/**
 * Fetches a random Hadith from the local collection based on a theme.
 * @param theme The theme of the hadith to fetch.
 * @returns A formatted string containing the hadith text and its narrator.
 */
export const fetchRandomHadith = async (theme: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const hadithCollection = HADITHS[theme];
        if (!hadithCollection || hadithCollection.length === 0) {
            return reject(new Error(`No hadiths found for theme: ${theme}`));
        }
        const randomIndex = Math.floor(Math.random() * hadithCollection.length);
        const hadith = hadithCollection[randomIndex];
        resolve(`Hadits: "${hadith.text}" (${hadith.narrator})`);
    });
};
