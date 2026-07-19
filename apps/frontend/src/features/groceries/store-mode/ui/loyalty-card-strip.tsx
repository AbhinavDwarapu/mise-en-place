import { LOYALTY_CARDS, type LoyaltyCard } from '../logic/loyalty-cards'
import { Badge } from '@/shared/ui/badge'

const BARCODE_STRIPES =
  'repeating-linear-gradient(90deg, #000 0 2px, transparent 2px 4px, #000 4px 5px, transparent 5px 9px, #000 9px 12px, transparent 12px 14px)'

export function LoyaltyCardStrip() {
  return (
    <section aria-label="Loyalty cards">
      <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
        {LOYALTY_CARDS.map((card, index) => (
          <LoyaltyCardView key={card.id} card={card} isLikely={index === 0} />
        ))}
      </ul>
    </section>
  )
}

function LoyaltyCardView({
  card,
  isLikely,
}: {
  card: LoyaltyCard
  isLikely: boolean
}) {
  return (
    <li
      className="w-72 shrink-0 snap-center overflow-hidden rounded-2xl"
      style={{ backgroundColor: card.brandColor }}
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <p className="text-sm font-semibold tracking-wide text-white uppercase">
          {card.storeName}
        </p>
        {isLikely && <Badge variant="secondary">Nearby</Badge>}
      </div>
      <div className="m-4 mt-3 rounded-lg bg-white p-3">
        <div className="h-12" style={{ background: BARCODE_STRIPES }} />
        <p className="pt-1 text-center font-mono text-xs tracking-widest text-black">
          {card.codeDigits}
        </p>
      </div>
    </li>
  )
}
