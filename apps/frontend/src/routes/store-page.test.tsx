import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useKitchenStore, useShoppingListStore } from '@/features/groceries'
import { useStoreSessionStore } from '@/features/groceries/store-mode'
import { COUNT_UNIT } from '@/features/groceries/state/kitchen-constants'
import { StorePage } from './store-page'

beforeEach(() => {
  localStorage.clear()
  useKitchenStore.setState(useKitchenStore.getInitialState(), true)
  useShoppingListStore.setState(useShoppingListStore.getInitialState(), true)
  useStoreSessionStore.setState(useStoreSessionStore.getInitialState(), true)
})

afterEach(cleanup)

function addListItem(name: string, quantity = { amount: 1, unit: COUNT_UNIT }) {
  return useShoppingListStore.getState().addItem(name, quantity)
}

function renderStorePage() {
  return render(
    <MemoryRouter initialEntries={['/store']}>
      <StorePage />
      <Route path="/home" render={() => <p>Back at home</p>} />
    </MemoryRouter>
  )
}

function itemRow(name: string) {
  return screen.getByText(name, { selector: 'p' }).closest('li')!
}

describe('aisle tabs', () => {
  it('shows a chip per non-empty aisle with its pending count', () => {
    addListItem('Tomatoes', { amount: 6, unit: COUNT_UNIT })
    addListItem('Spinach', { amount: 1, unit: 'bag' })
    addListItem('Milk')
    renderStorePage()

    const produceChip = screen.getByRole('button', { name: 'produce · 2' })
    expect(produceChip).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: 'dairy · 1' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /bakery/ })
    ).not.toBeInTheDocument()
  })

  it('switches the visible items when a chip is tapped', async () => {
    const user = userEvent.setup()
    addListItem('Tomatoes')
    addListItem('Milk')
    renderStorePage()

    expect(screen.getByText('Tomatoes')).toBeInTheDocument()
    expect(screen.queryByText('Milk')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'dairy · 1' }))

    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.queryByText('Tomatoes')).not.toBeInTheDocument()
  })
})

describe('checking off items', () => {
  it('checks an item off and drops it from the pending count', async () => {
    const user = userEvent.setup()
    addListItem('Tomatoes', { amount: 6, unit: COUNT_UNIT })
    addListItem('Spinach', { amount: 1, unit: 'bag' })
    renderStorePage()

    const checkbox = screen.getByRole('checkbox', { name: 'Tomatoes' })
    await user.click(checkbox)

    expect(checkbox).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('Tomatoes')).toHaveClass('line-through')
    expect(
      screen.getByRole('button', { name: 'produce · 1' })
    ).toBeInTheDocument()
  })

  it('marks the aisle chip as done once nothing is pending', async () => {
    const user = userEvent.setup()
    addListItem('Tomatoes')
    renderStorePage()

    await user.click(screen.getByRole('checkbox', { name: 'Tomatoes' }))

    expect(screen.getByRole('button', { name: 'produce' })).toBeInTheDocument()
  })

  it('unchecks a checked item back to pending', async () => {
    const user = userEvent.setup()
    addListItem('Tomatoes')
    renderStorePage()

    const checkbox = screen.getByRole('checkbox', { name: 'Tomatoes' })
    await user.click(checkbox)
    await user.click(checkbox)

    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    expect(
      screen.getByRole('button', { name: 'produce · 1' })
    ).toBeInTheDocument()
  })
})

describe('skipping items', () => {
  it('skips an item without removing it, and unskips it again', async () => {
    const user = userEvent.setup()
    addListItem('Tomatoes')
    addListItem('Spinach')
    renderStorePage()

    await user.click(screen.getByRole('button', { name: 'Skip Tomatoes' }))

    expect(within(itemRow('Tomatoes')).getByText(/skipped/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'produce · 1' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Skip Tomatoes' }))

    expect(
      within(itemRow('Tomatoes')).queryByText(/skipped/)
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'produce · 2' })
    ).toBeInTheDocument()
  })
})

describe('alternatives', () => {
  it('swaps an item for a substitute of the same-named kitchen ingredient', async () => {
    const user = userEvent.setup()
    const spinach = addListItem('Baby spinach', { amount: 1, unit: 'bag' })
    renderStorePage()

    await user.click(
      screen.getByRole('button', { name: /Can't find\? Show alternatives/ })
    )
    await user.click(screen.getByRole('button', { name: 'kale' }))

    expect(screen.getByText('kale')).toBeInTheDocument()
    expect(useShoppingListStore.getState().items).toEqual([
      { ...spinach, name: 'kale' },
    ])
  })

  it('undoes a swap, restoring the original name', async () => {
    const user = userEvent.setup()
    addListItem('Baby spinach', { amount: 1, unit: 'bag' })
    renderStorePage()

    await user.click(
      screen.getByRole('button', { name: /Can't find\? Show alternatives/ })
    )
    await user.click(screen.getByRole('button', { name: 'kale' }))
    await user.click(
      screen.getByRole('button', { name: 'Undo swap of Baby spinach' })
    )

    expect(screen.getByText('Baby spinach')).toBeInTheDocument()
    expect(screen.queryByText(/Swapped from/)).not.toBeInTheDocument()
    expect(useStoreSessionStore.getState().swaps).toEqual({})
  })

  it('follows the item to its new aisle when a swap changes category', async () => {
    const user = userEvent.setup()
    const basil = useKitchenStore.getState().addIngredient('Basil')
    useKitchenStore.getState().addSubstitution(basil.id, 'frozen basil')
    addListItem('Basil')
    addListItem('Tomatoes')
    renderStorePage()

    await user.click(
      screen.getByRole('button', { name: /Can't find\? Show alternatives/ })
    )
    await user.click(screen.getByRole('button', { name: 'frozen basil' }))

    expect(screen.getByRole('button', { name: 'frozen · 1' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByText('frozen basil')).toBeInTheDocument()
    expect(screen.queryByText('Tomatoes')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Undo swap of Basil' }))

    expect(screen.getByRole('button', { name: 'produce · 2' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByText('Basil')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /frozen/ })
    ).not.toBeInTheDocument()
  })

  it('offers no alternatives for items unknown to the kitchen', () => {
    addListItem('Milk')
    renderStorePage()

    expect(screen.queryByText(/Can't find\?/)).not.toBeInTheDocument()
  })
})

describe('completing the shop', () => {
  it('moves checked items into the kitchen and repoints their recipes', async () => {
    const user = userEvent.setup()
    const pecorino = addListItem('Pecorino', { amount: 200, unit: 'g' })
    addListItem('Milk')
    addListItem('Bread')
    useKitchenStore.getState().addRecipeIngredient(
      'rec-taco-night',
      { kind: 'shopping-list', shoppingListItemId: pecorino.id },
      { amount: 150, unit: 'g' }
    )
    renderStorePage()

    await user.click(screen.getByRole('checkbox', { name: 'Pecorino' }))
    await user.click(screen.getByRole('button', { name: 'bakery · 1' }))
    await user.click(screen.getByRole('button', { name: 'Skip Bread' }))
    await user.click(screen.getByRole('button', { name: 'Complete shop' }))

    const remainingNames = useShoppingListStore
      .getState()
      .items.map((item) => item.name)
    expect(remainingNames).toEqual(['Milk', 'Bread'])

    const boughtPecorino = useKitchenStore
      .getState()
      .ingredients.find((ingredient) => ingredient.name === 'Pecorino')!
    expect(boughtPecorino.quantity).toEqual({ amount: 200, unit: 'g' })

    const tacoNight = useKitchenStore
      .getState()
      .recipes.find((recipe) => recipe.id === 'rec-taco-night')!
    expect(tacoNight.ingredients).toContainEqual({
      source: { kind: 'kitchen', ingredientId: boughtPecorino.id },
      needed: { amount: 150, unit: 'g' },
    })

    expect(useStoreSessionStore.getState().statuses).toEqual({})
    expect(screen.getByText('Back at home')).toBeInTheDocument()
  })

  it('reuses an existing kitchen ingredient instead of duplicating it', async () => {
    const user = userEvent.setup()
    addListItem('Baby spinach', { amount: 2, unit: 'bag' })
    renderStorePage()

    await user.click(screen.getByRole('checkbox', { name: 'Baby spinach' }))
    await user.click(screen.getByRole('button', { name: 'Complete shop' }))

    const spinachIngredients = useKitchenStore
      .getState()
      .ingredients.filter((ingredient) => ingredient.name === 'Baby spinach')
    expect(spinachIngredients).toHaveLength(1)
    expect(spinachIngredients[0].id).toBe('ing-baby-spinach')
    expect(useShoppingListStore.getState().items).toEqual([])
  })
})

describe('loyalty cards', () => {
  it('shows the likely store first, marked as nearby', () => {
    renderStorePage()

    const strip = screen.getByRole('region', { name: 'Loyalty cards' })
    const [firstCard] = within(strip).getAllByRole('listitem')
    expect(within(firstCard).getByText('Morrisons')).toBeInTheDocument()
    expect(within(firstCard).getByText('Nearby')).toBeInTheDocument()
  })

  it('renders each card as a barcode with its readable number', () => {
    renderStorePage()

    const strip = screen.getByRole('region', { name: 'Loyalty cards' })
    const cards = within(strip).getAllByRole('listitem')
    expect(cards).toHaveLength(2)
    for (const card of cards) {
      expect(card.querySelectorAll('svg rect').length).toBeGreaterThan(1)
    }
    expect(
      within(cards[0]).getByText('9826 1358 0251 1343 093')
    ).toBeInTheDocument()
    expect(
      within(cards[1]).getByText('6340 0402 7443 6486 00')
    ).toBeInTheDocument()
  })
})

describe('empty list', () => {
  it('shows an empty message when there is nothing to buy', () => {
    renderStorePage()

    expect(
      screen.getByText('Nothing to buy — your shopping list is empty.')
    ).toBeInTheDocument()
  })
})
