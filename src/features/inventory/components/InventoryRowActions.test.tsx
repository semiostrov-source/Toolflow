import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InventoryRowActions } from './InventoryRowActions'

describe('InventoryRowActions', () => {
  it('renders a More action button', () => {
    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    expect(moreButton).toBeInTheDocument()
    expect(moreButton).toHaveAttribute('aria-haspopup', 'menu')
    expect(moreButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles the overflow menu and menu items when clicking More', async () => {
    const user = userEvent.setup()

    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    expect(
      screen.queryByRole('menu', { name: 'Inventory row actions' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('menuitem', { name: 'Open details' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('menuitem', { name: 'Edit item' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('menuitem', { name: 'View history' }),
    ).not.toBeInTheDocument()

    await user.click(moreButton)

    expect(
      screen.getByRole('menu', { name: 'Inventory row actions' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: 'Open details' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: 'Edit item' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: 'View history' }),
    ).toBeInTheDocument()
    expect(moreButton).toHaveAttribute('aria-expanded', 'true')

    await user.click(moreButton)

    expect(
      screen.queryByRole('menu', { name: 'Inventory row actions' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('menuitem', { name: 'Open details' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('menuitem', { name: 'Edit item' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('menuitem', { name: 'View history' }),
    ).not.toBeInTheDocument()
    expect(moreButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the overflow menu when a menu item is clicked', async () => {
    const user = userEvent.setup()

    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    await user.click(moreButton)

    const openDetailsItem = screen.getByRole('menuitem', {
      name: 'Open details',
    })

    await user.click(openDetailsItem)

    expect(
      screen.queryByRole('menu', { name: 'Inventory row actions' }),
    ).not.toBeInTheDocument()
  })
})

