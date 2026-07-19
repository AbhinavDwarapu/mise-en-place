export interface LoyaltyCard {
  id: string
  storeName: string
  brandColor: string
  codeDigits: string
}

export const LOYALTY_CARDS: LoyaltyCard[] = [
  {
    id: 'morrisons',
    storeName: 'Morrisons',
    brandColor: '#00563f',
    codeDigits: '9826135802511343093',
  },
  {
    id: 'tesco',
    storeName: 'Tesco',
    brandColor: '#00539f',
    codeDigits: '634004027443648600',
  },
]
