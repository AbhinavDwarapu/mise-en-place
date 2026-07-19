import { Button } from '@/shared/ui/button'
import { LoyaltyCardStrip } from './loyalty-card-strip'

export function StoreModeScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <>
      <header className="px-4 pt-8 pb-3">
        <h1 className="text-3xl font-semibold text-foreground">In-store</h1>
      </header>
      <main className="flex-1 space-y-3 overflow-y-auto">
        <LoyaltyCardStrip />
      </main>
      <footer className="shrink-0 border-t border-border p-4">
        <Button className="w-full" size="lg" onClick={onComplete}>
          Complete shop
        </Button>
      </footer>
    </>
  )
}
