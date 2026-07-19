export interface LoyaltyCard {
  id: string
  storeName: string
  brandColor: string
  codeDigits: string
}

export const LOYALTY_CARDS: LoyaltyCard[] = [
  {
    id: 'greenfield-market',
    storeName: 'Greenfield Market',
    brandColor: '#14532d',
    codeDigits: '4821 0093 7745 218',
  },
  {
    id: 'corner-fresh',
    storeName: 'Corner Fresh',
    brandColor: '#7f1d1d',
    codeDigits: '9034 5512 0087 663',
  },
  {
    id: 'daily-pantry',
    storeName: 'Daily Pantry',
    brandColor: '#1e3a8a',
    codeDigits: '2276 8450 1934 077',
  },
]
