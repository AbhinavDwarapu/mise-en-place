import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fetchCategories,
  fetchSubstituteSuggestions,
} from '../../boundary/suggestions-api'
import { useCategoryCacheStore } from '../../state/category-cache-store'
import { useKitchenStore } from '../../state/kitchen-store'
import { useShoppingListStore } from '../../state/shopping-list-store'
import { useSubstituteSuggestionsStore } from '../../state/substitute-suggestions-store'
import { KitchenScreen } from './kitchen-screen'

vi.mock('../../boundary/suggestions-api')

beforeEach(() => {
  localStorage.clear()
  useKitchenStore.setState(useKitchenStore.getInitialState(), true)
  useShoppingListStore.setState(useShoppingListStore.getInitialState(), true)
  useCategoryCacheStore.setState(useCategoryCacheStore.getInitialState(), true)
  useSubstituteSuggestionsStore.setState(
    useSubstituteSuggestionsStore.getInitialState(),
    true
  )
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

    expect(fetchCategories).toHaveBeenCalledWith(['Dragon fruit'])
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

    const spinachItem = useShoppingListStore
      .getState()
      .items.find((item) => item.name === 'Baby spinach')
    expect(spinachItem?.quantity).toEqual({ amount: 1, unit: 'bag' })

    const recipes = useKitchenStore.getState().recipes
    const frittata = recipes.find((recipe) => recipe.name === 'Sat. frittata')!
    const smoothies = recipes.find(
      (recipe) => recipe.name === 'Green smoothies'
    )!
    const listSource = {
      kind: 'shopping-list' as const,
      shoppingListItemId: spinachItem!.id,
    }
    expect(frittata.ingredients).toContainEqual({
      source: listSource,
      needed: { amount: 1, unit: 'bag' },
    })
    expect(smoothies.ingredients).toContainEqual({
      source: listSource,
      needed: { amount: 0.5, unit: 'bag' },
    })
  })

  it('reuses an existing shopping-list item with the same name instead of duplicating it', async () => {
    const existing = useShoppingListStore
      .getState()
      .addItem('Baby spinach', { amount: 2, unit: 'bag' })

    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)
    await user.click(screen.getByRole('button', { name: 'Delete ingredient' }))
    const dialog = await screen.findByRole('alertdialog')
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    const spinachItems = useShoppingListStore
      .getState()
      .items.filter((item) => item.name === 'Baby spinach')
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
