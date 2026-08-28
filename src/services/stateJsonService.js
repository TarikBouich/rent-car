import stateService from './stateService';

export async function loadStateJson(key, fallback) {
  try {
    const response = await stateService.getByKey(key);
    const raw = response?.data?.value;
    if (raw == null || raw === '') return fallback;
    return JSON.parse(raw);
  } catch (error) {
    if (error?.response?.status !== 404) {
      console.error(`[state-json] failed loading ${key}:`, error);
    }
    return fallback;
  }
}

export async function saveStateJson(key, value) {
  try {
    await stateService.setByKey(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[state-json] failed saving ${key}:`, error);
  }
}
