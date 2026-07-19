import { Button } from '@/shared/ui/button'

export function StoreModeScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <>
      <header className="px-4 pt-8 pb-3">
        <h1 className="text-3xl font-semibold text-foreground">In-store</h1>
      </header>
      <main className="flex-1 overflow-y-auto" />
      <footer className="shrink-0 border-t border-border p-4">
        <Button className="w-full" size="lg" onClick={onComplete}>
          Complete shop
        </Button>
      </footer>
    </>
  )
}
