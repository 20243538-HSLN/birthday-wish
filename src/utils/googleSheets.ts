export interface WishData {
  recipientName: string;
  birthdate: string;
  age: number;
  cakeFlavor: string;
  wishText: string;
  customMessage?: string;
  submittedAt?: string;
}

const STORAGE_KEY = 'birthday_card_gsheet_webhook_url';

// 💡 Paste your Google Apps Script Web App URL here so all friends' responses are saved automatically!
export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxpM_B_rna0dekd4N-k1Y-HyENtl6l9WVqyZ0qFyL2g-CQoC87AFL2z_1FO0wgCRHM/exec';

export function getStoredWebhookUrl(): string {
  const envUrl = ((import.meta as any).env?.VITE_GOOGLE_SHEET_WEBHOOK_URL as string) || '';
  if (envUrl) return envUrl;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  return DEFAULT_WEBHOOK_URL;
}

export function saveStoredWebhookUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY, url.trim());
}

export async function sendWishToGoogleSheet(data: WishData): Promise<boolean> {
  const webhookUrl = getStoredWebhookUrl();
  if (!webhookUrl) {
    console.log('No Google Sheet Webhook URL configured. Skipping sheet sync.');
    return false;
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    recipientName: data.recipientName || '(Anonymous)',
    birthdate: data.birthdate || '',
    age: data.age || 0,
    cakeFlavor: data.cakeFlavor || '',
    wishText: data.wishText || '',
  };

  try {
    // Google Apps Script requires mode: 'no-cors' or standard CORS handling with JSON
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });
    console.log('Wish successfully sent to Google Sheet!');
    return true;
  } catch (err) {
    console.error('Failed to send wish to Google Sheet:', err);
    return false;
  }
}
