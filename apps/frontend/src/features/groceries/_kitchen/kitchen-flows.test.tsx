import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fetchCategories,
  fetchSubstituteSuggestions,
} from '../boundary/suggestions-api'
import { useCategoryCacheStore } from '../state/category-cache-store'
import { useGroceryStore } from '../state/grocery-store'
import { clearSubstituteSuggestionsCache } from '../state/use-substitute-suggestions'
import { KitchenScreen } from './ui/kitchen-screen'

vi.mock('../boundary/suggestions-api')

beforeEach(() => {
  localStorage.clear()
  useGroceryStore.setState(useGroceryStore.getInitialState(), true)
  useGroceryStore.setState({
    items: useGroceryStore
      .getState()
      .items.filter((item) => item.location === 'kitchen'),
  })
  useCategoryCacheStore.setState(useCategoryCacheStore.getInitialState(), true)
  clearSubstituteSuggestionsCache()
  vi.mocked(fetchSubstituteSuggestions).mockReset().mockResolvedValue([])
  vi.mocked(fetchCategories).mockReset().mockResolvedValue({})
})

afterEach(cleanup)

async function openDetailSheet(user: ReturnType<typeof userEvent.setup>, name: RegExp) {
  render(<KitchenScreen />)
  await user.click(screen.getByRole('button', { name }))
  await screen.findByLabelText('Name')
}

describe('adding an ingredient', () => {
  it('creates it with sensible defaults from the quick-add', async () => {
    const user = userEvent.setup()
    render(<KitchenScreen />)

    await user.type(screen.getByPlaceholderText('Add ingredient…'), 'Kale')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    const row = screen.getByRole('button', { name: /Kale/ })
    expect(within(row).getByText('×1')).toBeInTheDocument()
    expect(within(row).getByText('Exp ~5d')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add ingredient…')).toHaveValue('')
  })

  it('upgrades an unknown name to the LLM category', async () => {
    vi.mocked(fetchCategories).mockResolvedValue({ 'Dragon fruit': 'produce' })
    const user = userEvent.setup()
    render(<KitchenScreen />)

    await user.type(
      screen.getByPlaceholderText('Add ingredient…'),
      'Dragon fruit{enter}'
    )
    await user.click(screen.getByRole('button', { name: /Dragon fruit/ }))
    await screen.findByLabelText('Name')

    expect(fetchCategories).toHaveBeenCalledWith(['dragon fruit'])
    expect(screen.getByLabelText('Category')).toHaveTextContent('produce')
  })
})

describe('editing an ingredient', () => {
  it('shows which recipes use it', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    expect(screen.getByText('Sat. frittata')).toBeInTheDocument()
    expect(screen.getByText('needs 1 bag')).toBeInTheDocument()
    expect(screen.getByText('Green smoothies')).toBeInTheDocument()
    expect(screen.getByText('needs 0.5 bag')).toBeInTheDocument()
  })

  it('updates name and quantity from the detail sheet', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    await user.click(screen.getByRole('button', { name: 'Increase amount' }))
    await user.type(screen.getByLabelText('Name'), '!')
    await user.click(screen.getByRole('button', { name: 'Done' }))

    const row = screen.getByRole('button', { name: /Baby spinach!/ })
    expect(within(row).getByText('2 bag')).toBeInTheDocument()
  })

  it('sets expiration from a preset and keeps the date input in sync', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    await user.click(screen.getByRole('button', { name: '14d' }))

    expect(screen.getByLabelText('Expiration date')).toHaveValue(
      '2026-08-02'
    )
  })

  it('sets expiration from a custom date', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    fireEvent.change(screen.getByLabelText('Expiration date'), {
      target: { value: '2026-09-01' },
    })

    expect(screen.getByLabelText('Expiration date')).toHaveValue(
      '2026-09-01'
    )
  })

  it('adds and removes substitutes', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    await user.type(screen.getByLabelText('Substitutes'), 'chard{enter}')
    expect(screen.getByText('chard')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove chard' }))
    expect(screen.queryByText('chard')).not.toBeInTheDocument()

    expect(screen.getByText('frozen spinach')).toBeInTheDocument()
    expect(screen.getByText('kale')).toBeInTheDocument()
  })
})

describe('substitute suggestions', () => {
  it('suggests substitutes when the sheet opens and adds one on tap', async () => {
    vi.mocked(fetchSubstituteSuggestions).mockResolvedValue([
      'chard',
      'collard greens',
    ])
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    expect(
      await screen.findByRole('button', { name: 'chard' })
    ).toBeInTheDocument()
    expect(fetchSubstituteSuggestions).toHaveBeenCalledWith('Baby spinach', [
      'frozen spinach',
      'kale',
    ])

    await user.click(screen.getByRole('button', { name: 'chard' }))

    expect(
      screen.getByRole('button', { name: 'Remove chard' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'chard' })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'collard greens' })
    ).toBeInTheDocument()
  })

  it('serves cached suggestions on reopen without refetching', async () => {
    vi.mocked(fetchSubstituteSuggestions).mockResolvedValue(['chard'])
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)
    await screen.findByRole('button', { name: 'chard' })

    await user.click(screen.getByRole('button', { name: 'Done' }))
    await user.click(screen.getByRole('button', { name: /Baby spinach/ }))
    await screen.findByLabelText('Name')

    expect(
      await screen.findByRole('button', { name: 'chard' })
    ).toBeInTheDocument()
    expect(fetchSubstituteSuggestions).toHaveBeenCalledTimes(1)
  })

  it("shows an error when suggestions can't be fetched", async () => {
    vi.mocked(fetchSubstituteSuggestions).mockRejectedValue(
      new Error('offline')
    )
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    expect(
      await screen.findByText("Couldn't get suggestions")
    ).toBeInTheDocument()
  })
})

describe('deleting an ingredient', () => {
  it('warns about dependent recipes and substitutes first', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    await user.click(screen.getByRole('button', { name: 'Delete ingredient' }))

    const dialog = await screen.findByRole('alertdialog')
    expect(
      within(dialog).getByText(
        'These recipes will need it from your shopping list instead:'
      )
    ).toBeInTheDocument()
    expect(within(dialog).getByText('Sat. frittata')).toBeInTheDocument()
    expect(within(dialog).getByText('Green smoothies')).toBeInTheDocument()
    expect(
      within(dialog).getByText('Possible substitutes: frozen spinach, kale')
    ).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(
      screen.getByRole('button', { name: /Baby spinach/ })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Baby spinach/ }))
    await user.click(screen.getByRole('button', { name: 'Delete ingredient' }))
    const reopened = await screen.findByRole('alertdialog')
    await user.click(within(reopened).getByRole('button', { name: 'Delete' }))

    expect(screen.queryByText(/Baby spinach/)).not.toBeInTheDocument()
  })

  it('moves dependent recipes onto a shopping-list item instead of leaving them dangling', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    await user.click(screen.getByRole('button', { name: 'Delete ingredient' }))
    const dialog = await screen.findByRole('alertdialog')
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    const spinachItem = useGroceryStore
      .getState()
      .items.find(
        (item) =>
          item.location === 'shopping-list' && item.name === 'Baby spinach'
      )
    expect(spinachItem?.quantity).toEqual({ amount: 1, unit: 'bag' })

    const recipes = useGroceryStore.getState().recipes
    const frittata = recipes.find((recipe) => recipe.name === 'Sat. frittata')!
    const smoothies = recipes.find(
      (recipe) => recipe.name === 'Green smoothies'
    )!
    expect(frittata.ingredients).toContainEqual({
      itemId: spinachItem!.id,
      needed: { amount: 1, unit: 'bag' },
    })
    expect(smoothies.ingredients).toContainEqual({
      itemId: spinachItem!.id,
      needed: { amount: 0.5, unit: 'bag' },
    })
  })

  it('reuses an existing shopping-list item with the same name instead of duplicating it', async () => {
    const existing = useGroceryStore
      .getState()
      .addItem('Baby spinach', 'shopping-list', { amount: 2, unit: 'bag' })

    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)
    await user.click(screen.getByRole('button', { name: 'Delete ingredient' }))
    const dialog = await screen.findByRole('alertdialog')
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    const spinachItems = useGroceryStore
      .getState()
      .items.filter(
        (item) =>
          item.location === 'shopping-list' && item.name === 'Baby spinach'
      )
    expect(spinachItems).toEqual([existing])
  })

  it('deletes an unused ingredient without recipe warnings', async () => {
    const user = userEvent.setup()
    render(<KitchenScreen />)

    await user.type(
      screen.getByPlaceholderText('Add ingredient…'),
      'Mystery paste{enter}'
    )
    await user.click(screen.getByRole('button', { name: /Mystery paste/ }))
    await screen.findByLabelText('Name')

    await user.click(screen.getByRole('button', { name: 'Delete ingredient' }))

    const dialog = await screen.findByRole('alertdialog')
    expect(
      within(dialog).getByText('It is removed from your kitchen.')
    ).toBeInTheDocument()
    expect(
      within(dialog).queryByText('These recipes will no longer be possible:')
    ).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))
    expect(
      screen.queryByRole('button', { name: /Mystery paste/ })
    ).not.toBeInTheDocument()
  })
})
