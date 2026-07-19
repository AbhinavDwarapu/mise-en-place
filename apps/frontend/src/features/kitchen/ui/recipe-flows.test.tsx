import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useShoppingListStore } from '@/shared/state/shopping-list-store'
import { useKitchenStore } from '../state/kitchen-store'
import { RecipesScreen } from './recipes-screen'

beforeEach(() => {
  localStorage.clear()
  useKitchenStore.setState(useKitchenStore.getInitialState(), true)
  useShoppingListStore.setState(useShoppingListStore.getInitialState(), true)
})

afterEach(cleanup)

async function openDetailSheet(
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp
) {
  render(<RecipesScreen />)
  await user.click(screen.getByRole('button', { name }))
  await screen.findByLabelText('Name')
}

describe('creating a recipe', () => {
  it('creates it with sensible defaults from the quick-add', async () => {
    const user = userEvent.setup()
    render(<RecipesScreen />)

    await user.type(screen.getByPlaceholderText('Add recipe…'), 'Cacio e pepe')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    const row = screen.getByRole('button', { name: /Cacio e pepe/ })
    expect(
      within(row).getByText('Serves 2 · 0 ingredients')
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add recipe…')).toHaveValue('')
  })
})

describe('editing a recipe', () => {
  it('updates name and servings from the detail sheet', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Taco night/)

    await user.click(screen.getByRole('button', { name: 'Increase servings' }))
    await user.type(screen.getByLabelText('Name'), '!')
    await user.click(screen.getByRole('button', { name: 'Done' }))

    const row = screen.getByRole('button', { name: /Taco night!/ })
    expect(
      within(row).getByText('Serves 5 · 4 ingredients')
    ).toBeInTheDocument()
  })

  it('adds an ingredient already in the kitchen', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Green smoothies/)

    await user.type(screen.getByLabelText('Add ingredient'), 'beef')
    await user.click(screen.getByRole('button', { name: /Ground beef/ }))

    expect(screen.getByText('Ground beef')).toBeInTheDocument()
    expect(screen.getByText('2 ingredients')).toBeInTheDocument()
    expect(screen.getByLabelText('Add ingredient')).toHaveValue('')
  })

  it('adds an ingredient already on the shopping list', async () => {
    useShoppingListStore
      .getState()
      .addItem('Pecorino', { amount: 80, unit: 'g' })
    const user = userEvent.setup()
    await openDetailSheet(user, /Green smoothies/)

    await user.type(screen.getByLabelText('Add ingredient'), 'Pecorino')
    expect(screen.queryByText('Create new')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Pecorino/ }))

    expect(screen.getByText('On list')).toBeInTheDocument()
    expect(useShoppingListStore.getState().items).toHaveLength(1)
  })

  it('creates a new shopping-list item for an ingredient not yet known', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Green smoothies/)

    await user.type(screen.getByLabelText('Add ingredient'), 'Pecorino')
    await user.click(screen.getByRole('button', { name: /Create new/ }))

    expect(screen.getByText('On list')).toBeInTheDocument()
    expect(
      useShoppingListStore.getState().items.map((item) => item.name)
    ).toContain('Pecorino')
  })

  it('updates the quantity for an ingredient', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Sat\. frittata/)

    const amountInput = screen.getByLabelText('Eggs amount')
    await user.clear(amountInput)
    await user.type(amountInput, '12')

    expect(amountInput).toHaveValue(12)
  })

  it('removes an ingredient from the recipe', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Sat\. frittata/)

    await user.click(screen.getByRole('button', { name: 'Remove Eggs' }))

    expect(screen.queryByText('Eggs')).not.toBeInTheDocument()
    expect(screen.getByText('1 ingredient')).toBeInTheDocument()
  })
})

describe('deleting a recipe', () => {
  it('removes the recipe after confirming', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Green smoothies/)

    await user.click(screen.getByRole('button', { name: 'Delete recipe' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(within(dialog).getByText(/This can.t be undone\./)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(
      screen.getByRole('button', { name: /Green smoothies/ })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Green smoothies/ }))
    await user.click(screen.getByRole('button', { name: 'Delete recipe' }))
    const reopened = await screen.findByRole('alertdialog')
    await user.click(within(reopened).getByRole('button', { name: 'Delete' }))

    expect(screen.queryByText(/Green smoothies/)).not.toBeInTheDocument()
  })
})
