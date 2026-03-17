import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InventoryRowActions } from './InventoryRowActions'

describe('InventoryRowActions', () => {
  it('renders a More action button', () => {
    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    expect(moreButton).toBeInTheDocument()
    expect(moreButton).toHaveAttribute('aria-haspopup', 'menu')
    expect(moreButton).toHaveAttribute('aria-expanded', 'false')
    expect(moreButton).not.toHaveAttribute('aria-controls')
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
    expect(moreButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the overflow menu when Escape is pressed', async () => {
    const user = userEvent.setup()

    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    await user.click(moreButton)

    expect(
      screen.getByRole('menu', { name: 'Inventory row actions' }),
    ).toBeInTheDocument()
    expect(moreButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(document, { key: 'Escape' })

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

  it('closes the overflow menu when clicking outside', async () => {
    const user = userEvent.setup()

    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    await user.click(moreButton)

    expect(
      screen.getByRole('menu', { name: 'Inventory row actions' }),
    ).toBeInTheDocument()
    expect(moreButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.mouseDown(document.body)

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

  it('moves focus into the overflow menu and returns it to More on Escape', async () => {
    const user = userEvent.setup()

    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    moreButton.focus()
    expect(moreButton).toHaveFocus()

    await user.click(moreButton)

    const firstMenuItem = screen.getByRole('menuitem', { name: 'Open details' })
    expect(firstMenuItem).toHaveFocus()

    await user.keyboard('{Escape}')

    expect(
      screen.queryByRole('menu', { name: 'Inventory row actions' }),
    ).not.toBeInTheDocument()
    expect(moreButton).toHaveFocus()
  })

  it('supports ArrowUp and ArrowDown navigation between overflow menu items', async () => {
    const user = userEvent.setup()

    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    await user.click(moreButton)

    const openDetailsItem = screen.getByRole('menuitem', {
      name: 'Open details',
    })
    const editItem = screen.getByRole('menuitem', {
      name: 'Edit item',
    })
    const viewHistoryItem = screen.getByRole('menuitem', {
      name: 'View history',
    })

    // First menu item should have focus initially (from focus-management behavior)
    expect(openDetailsItem).toHaveFocus()

    // ArrowDown: Open details -> Edit item
    await user.keyboard('{ArrowDown}')
    expect(editItem).toHaveFocus()

    // ArrowDown: Edit item -> View history
    await user.keyboard('{ArrowDown}')
    expect(viewHistoryItem).toHaveFocus()

    // ArrowDown: View history -> wraps to Open details
    await user.keyboard('{ArrowDown}')
    expect(openDetailsItem).toHaveFocus()

    // ArrowUp: Open details -> wraps to View history
    await user.keyboard('{ArrowUp}')
    expect(viewHistoryItem).toHaveFocus()

    // ArrowUp: View history -> Edit item
    await user.keyboard('{ArrowUp}')
    expect(editItem).toHaveFocus()
  })

  it('closes the overflow menu when Tab is pressed inside the menu', async () => {
    const user = userEvent.setup()

    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    await user.click(moreButton)

    const openDetailsItem = screen.getByRole('menuitem', {
      name: 'Open details',
    })

    expect(openDetailsItem).toHaveFocus()

    await user.keyboard('{Tab}')

    expect(
      screen.queryByRole('menu', { name: 'Inventory row actions' }),
    ).not.toBeInTheDocument()
    expect(moreButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('links More button to menu via aria-controls when menu is open', async () => {
    const user = userEvent.setup()

    render(<InventoryRowActions />)

    const moreButton = screen.getByRole('button', { name: 'More' })

    await user.click(moreButton)

    const menu = screen.getByRole('menu', { name: 'Inventory row actions' })
    const menuId = menu.id

    expect(menuId).toBeTruthy()
    expect(moreButton).toHaveAttribute('aria-expanded', 'true')
    expect(moreButton).toHaveAttribute('aria-controls', menuId)
  })
})

