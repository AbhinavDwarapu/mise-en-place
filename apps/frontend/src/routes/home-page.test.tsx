import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useKitchenStore, useShoppingListStore } from '@/features/groceries'
import { HomePage } from './home-page'

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  useKitchenStore.setState(useKitchenStore.getInitialState(), true)
  useShoppingListStore.setState(useShoppingListStore.getInitialState(), true)
})

afterEach(cleanup)

function addItemSection() {
  return screen.getByLabelText('Add item').closest('section')!
}

function shoppingListRow(name: string) {
  return screen.getByText(name, { selector: 'p' }).closest('li')!
}

async function createNewItem(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.type(screen.getByLabelText('Add item'), name)
  await user.click(
    within(addItemSection()).getByRole('button', { name: /Create new/ })
  )
}

describe('starting a shop', () => {
  it('navigates to the in-store view', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/home']}>
        <HomePage />
        <Route path="/store" render={() => <p>In-store route</p>} />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /Start shopping/ }))

    expect(screen.getByText('In-store route')).toBeInTheDocument()
  })
})

describe("this week's recipes", () => {
  it('shows only recipes marked cooking this week', () => {
    renderHomePage()

    expect(
      screen.getByRole('button', { name: /Taco night/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Sat\. frittata/ })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Green smoothies/ })
    ).not.toBeInTheDocument()
  })

  it('opens the recipe detail sheet when a card is tapped', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await user.click(screen.getByRole('button', { name: /Taco night/ }))

    expect(await screen.findByLabelText('Name')).toHaveValue('Taco night')
  })

  it('drops off the strip when toggled off from the detail sheet', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await user.click(screen.getByRole('button', { name: /Sat\. frittata/ }))
    await screen.findByLabelText('Name')
    await user.click(screen.getByRole('button', { name: 'Cooking this week' }))
    await user.click(screen.getByRole('button', { name: 'Done' }))

    expect(
      screen.queryByRole('button', { name: /Sat\. frittata/ })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Taco night/ })
    ).toBeInTheDocument()
  })
})

describe('adding to the shopping list', () => {
  it('creates a new item when nothing matches', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await createNewItem(user, 'Pecorino')

    expect(within(shoppingListRow('Pecorino')).getByText('1')).toBeInTheDocument()
    expect(screen.getByLabelText('Add item')).toHaveValue('')
  })

  it('recommends kitchen ingredients annotated with which recipe needs them', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await user.type(screen.getByLabelText('Add item'), 'beef')

    const recommendation = within(addItemSection()).getByRole('button', {
      name: /Ground beef/,
    })
    expect(within(recommendation).getByText('In kitchen')).toBeInTheDocument()
    expect(
      within(recommendation).getByText('Needed by Taco night')
    ).toBeInTheDocument()

    await user.click(recommendation)

    const row = shoppingListRow('Ground beef')
    expect(within(row).getByLabelText('Ground beef unit')).toHaveValue('lb')
  })

  it('bumps the quantity instead of duplicating an item already on the list', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await createNewItem(user, 'Pecorino')

    await user.type(screen.getByLabelText('Add item'), 'Pecorino')
    const match = within(addItemSection()).getByRole('button', {
      name: /Pecorino/,
    })
    expect(within(match).getByText('On list')).toBeInTheDocument()
    expect(
      within(addItemSection()).queryByText('Create new')
    ).not.toBeInTheDocument()

    await user.click(match)

    expect(within(shoppingListRow('Pecorino')).getByText('2')).toBeInTheDocument()
  })
})

describe('editing the shopping list', () => {
  it('adjusts quantity with the stepper, floored at 1', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await createNewItem(user, 'Pecorino')

    await user.click(
      screen.getByRole('button', { name: 'Increase Pecorino amount' })
    )
    expect(within(shoppingListRow('Pecorino')).getByText('2')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Decrease Pecorino amount' })
    )
    await user.click(
      screen.getByRole('button', { name: 'Decrease Pecorino amount' })
    )
    expect(within(shoppingListRow('Pecorino')).getByText('1')).toBeInTheDocument()
  })

  it('sets a unit, defaulting back to a bare count when cleared', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await createNewItem(user, 'Pecorino')

    const row = shoppingListRow('Pecorino')
    const unitInput = within(row).getByLabelText('Pecorino unit')
    expect(unitInput).toHaveValue('')

    await user.type(unitInput, 'g')
    expect(unitInput).toHaveValue('g')

    await user.clear(unitInput)
    expect(unitInput).toHaveValue('')
  })

  it('removes an item', async () => {
    const user = userEvent.setup()
    renderHomePage()

    await createNewItem(user, 'Pecorino')

    await user.click(screen.getByRole('button', { name: 'Remove Pecorino' }))

    expect(screen.queryByText('Pecorino')).not.toBeInTheDocument()
    expect(
      screen.getByText(
        'Your shopping list is empty. Add your first item below.'
      )
    ).toBeInTheDocument()
  })
})
