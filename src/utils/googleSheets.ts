export interface WishData {
  recipientName: string;
  birthdate: string;
  age: number;
  cakeFlavor: string;
  customMessage: string;
  wishText: string;
  submittedAt?: string;
}

const STORAGE_KEY = 'birthday_card_gsheet_webhook_url';

export function getStoredWebhookUrl(): string {
  const envUrl = ((import.meta as any).env?.VITE_GOOGLE_SHEET_WEBHOOK_URL as string) || '';
  if (envUrl) return envUrl;
  return localStorage.getItem(STORAGE_KEY) || '';
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
    customMessage: data.customMessage || '',
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
