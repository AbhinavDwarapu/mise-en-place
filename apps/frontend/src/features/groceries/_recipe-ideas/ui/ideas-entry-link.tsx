import { SparklesIcon } from 'lucide-react'
import { useHistory } from 'react-router-dom'

export function IdeasEntryLink() {
  const history = useHistory()

  return (
    <button
      type="button"
      onClick={() => history.push('/ideas')}
      className="mx-4 mt-2 flex w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-border p-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
        <SparklesIcon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-foreground">
          What should we use?
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          Recipe ideas from ingredients expiring soon
        </span>
      </span>
    </button>
  )
}
