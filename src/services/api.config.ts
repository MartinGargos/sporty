// API konfigurace
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.222:3000' // Development - změň na IP adresu počítače pro fyzické zařízení
  : 'https://api.sporty.app'; // Production

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

// Helper pro vytvoření URL
export const apiUrl = (path: string): string => {
  return `${API_CONFIG.baseURL}${path}`;
};


