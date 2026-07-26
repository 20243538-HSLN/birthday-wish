export type Step = 'welcome' | 'postcard' | 'cake' | 'sending' | 'fulfilled';

export type CakeFlavor = 'strawberry' | 'chocolate' | 'matcha' | 'cheese';

export type Language = 'ko' | 'en' | 'my';

export interface BirthdayState {
  recipientName: string;
  birthdate: string;
  age: number;
  candleType: 'number' | 'stick';
  customMessage: string;
  wishText: string;
  cakeFlavor: CakeFlavor;
  candleCount: number;
  litCandles: boolean[];
  candlesBlown: boolean;
  soundEnabled: boolean;
  bgmEnabled: boolean;
  bgmVolume: number;
}
