import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchRecipeIdeas } from '../../boundary/suggestions-api'
import { daysToMs } from '../../logic/expiration'
import { useKitchenStore } from '../../state/kitchen-store'
import { useShoppingListStore } from '../../state/shopping-list-store'
import { clearRecipeIdeasCache } from '../state/use-recipe-ideas'
import { HomePage } from '@/routes/home-page'
import { IdeasPage } from '@/routes/ideas-page'

vi.mock('../../boundary/suggestions-api')

const saag = {
  name: 'Saag-style greens',
  usedIngredients: ['Spinach', 'Yogurt'],
  extraIngredients: [],
}

const flatbreads = {
  name: 'Yogurt flatbreads',
  usedIngredients: ['Yogurt'],
  extraIngredients: ['flour'],
}

function seedKitchen() {
  const kitchen = useKitchenStore.getState()
  const spinach = kitchen.addIngredient('Spinach')
  kitchen.updateIngredient(spinach.id, { expiresAfterMs: daysToMs(2) })
  const yogurt = kitchen.addIngredient('Yogurt')
  kitchen.updateIngredient(yogurt.id, { expiresAfterMs: daysToMs(4) })
  const salt = kitchen.addIngredient('Salt')
  kitchen.updateIngredient(salt.id, { expiresAfterMs: null })
}

beforeEach(() => {
  localStorage.clear()
  useKitchenStore.setState(useKitchenStore.getInitialState(), true)
  useKitchenStore.setState({ ingredients: [], recipes: [] })
  useShoppingListStore.setState({ items: [] })
  clearRecipeIdeasCache()
  vi.mocked(fetchRecipeIdeas).mockReset().mockResolvedValue([saag, flatbreads])
  seedKitchen()
})

afterEach(cleanup)

function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/ideas" component={IdeasPage} />
    </MemoryRouter>
  )
}

function chipList() {
  return screen.getByRole('list', { name: 'Kitchen ingredients' })
}

function chips() {
  return within(chipList()).getAllByRole('button', { pressed: false })
}

function ideaCard(name: string) {
  return screen.getByText(name).closest('li')!
}

describe('reaching recipe ideas', () => {
  it('opens from the homepage card with chips sorted expiring first', async () => {
    const user = userEvent.setup()
    renderApp('/home')

    await user.click(
      screen.getByRole('button', { name: /What should we use\?/ })
    )

    expect(
      screen.getByRole('heading', { name: 'What should we use?' })
    ).toBeInTheDocument()
    expect(chips().map((chip) => chip.textContent)).toEqual([
      'Spinach2d',
      'Yogurt4d',
      'Salt',
    ])
  })

  it('reveals the rest of the kitchen behind the more chip', async () => {
    for (let index = 1; index <= 6; index += 1) {
      useKitchenStore.getState().addIngredient(`Extra ${index}`)
    }
    const user = userEvent.setup()
    renderApp('/ideas')

    expect(chips()).toHaveLength(8)

    await user.click(screen.getByRole('button', { name: '+ 1 more…' }))

    expect(chips()).toHaveLength(9)
    expect(
      screen.queryByRole('button', { name: /more…/ })
    ).not.toBeInTheDocument()
  })
})

describe('exploring ideas', () => {
  it('suggests recipes for the selected ingredients', async () => {
    const user = userEvent.setup()
    renderApp('/ideas')

    await user.click(screen.getByRole('button', { name: /Spinach/ }))
    await user.click(screen.getByRole('button', { name: /Yogurt/ }))

    expect(await screen.findByText('Saag-style greens')).toBeInTheDocument()
    expect(vi.mocked(fetchRecipeIdeas)).toHaveBeenLastCalledWith(
      ['Spinach', 'Yogurt'],
      ['Spinach', 'Yogurt', 'Salt']
    )
    expect(
      screen.getByText('Ideas with Spinach + Yogurt')
    ).toBeInTheDocument()
    expect(screen.getByText('uses 2 from your kitchen')).toBeInTheDocument()
    expect(screen.getByText('1 to buy')).toBeInTheDocument()
  })

  it('recovers from a failed request', async () => {
    vi.mocked(fetchRecipeIdeas).mockRejectedValueOnce(new Error('offline'))
    const user = userEvent.setup()
    renderApp('/ideas')

    await user.click(screen.getByRole('button', { name: /Spinach/ }))
    expect(
      await screen.findByText('Couldn’t get ideas right now.')
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('Saag-style greens')).toBeInTheDocument()
  })
})

describe('already planned recipes', () => {
  it('points at an existing recipe using a selected ingredient and plans it', async () => {
    const kitchen = useKitchenStore.getState()
    const spinach = kitchen.ingredients.find(
      (entry) => entry.name === 'Spinach'
    )!
    const frittata = kitchen.addRecipe('Sat. frittata')
    kitchen.addRecipeIngredient(
      frittata.id,
      { kind: 'kitchen', ingredientId: spinach.id },
      { amount: 1, unit: 'unit' }
    )
    const user = userEvent.setup()
    renderApp('/ideas')

    await user.click(screen.getByRole('button', { name: /Spinach/ }))
    await screen.findByText('Saag-style greens')

    expect(
      screen.getByText('Or: your Sat. frittata already uses Spinach')
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add to this week' }))

    expect(
      screen.getByText('Already planned for this week')
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Add to this week' })
    ).not.toBeInTheDocument()
    expect(
      useKitchenStore
        .getState()
        .recipes.find((entry) => entry.id === frittata.id)?.cookingThisWeek
    ).toBe(true)
  })
})

describe('adding an idea', () => {
  it('puts the recipe on this week and its extras on the shopping list', async () => {
    const user = userEvent.setup()
    renderApp('/ideas')

    await user.click(screen.getByRole('button', { name: /Yogurt/ }))
    await screen.findByText('Yogurt flatbreads')

    await user.click(
      within(ideaCard('Yogurt flatbreads')).getByRole('button', {
        name: 'Add to recipes',
      })
    )

    expect(
      within(ideaCard('Yogurt flatbreads')).getByRole('button', {
        name: 'Added',
      })
    ).toBeDisabled()

    cleanup()
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: /Yogurt flatbreads/ })
    ).toBeInTheDocument()
    expect(screen.getByText('flour', { selector: 'p' })).toBeInTheDocument()
  })
})
