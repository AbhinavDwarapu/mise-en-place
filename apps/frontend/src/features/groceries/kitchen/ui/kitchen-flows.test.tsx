import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useKitchenStore } from '../../state/kitchen-store'
import { KitchenScreen } from './kitchen-screen'

beforeEach(() => {
  localStorage.clear()
  useKitchenStore.setState(useKitchenStore.getInitialState(), true)
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

describe('deleting an ingredient', () => {
  it('warns about dependent recipes and substitutes first', async () => {
    const user = userEvent.setup()
    await openDetailSheet(user, /Baby spinach/)

    await user.click(screen.getByRole('button', { name: 'Delete ingredient' }))

    const dialog = await screen.findByRole('alertdialog')
    expect(
      within(dialog).getByText('These recipes will no longer be possible:')
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
