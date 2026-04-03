import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToolCard } from './ToolCard'
import type { Item } from '../types/domain'

const baseItem: Item = {
  id: 'item-1',
  name: 'Перфоратор Bosch',
  sku: 'PERF-001',
  unit: 'pcs',
  status: 'available',
  createdAt: '2025-12-01T10:00:00.000Z',
}

function makeItem(overrides: Partial<Item> = {}): Item {
  return { ...baseItem, ...overrides }
}

describe('ToolCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders tool name', () => {
      render(<ToolCard item={baseItem} />)

      expect(screen.getByText('Перфоратор Bosch')).toBeInTheDocument()
    })

    it('renders SKU prefixed with #', () => {
      render(<ToolCard item={baseItem} />)

      expect(screen.getByText('#PERF-001')).toBeInTheDocument()
    })

    it('renders the unit chip', () => {
      render(<ToolCard item={baseItem} />)

      expect(screen.getByText('pcs')).toBeInTheDocument()
    })

    it('renders Передать, Сервис, Журнал action buttons', () => {
      render(<ToolCard item={baseItem} />)

      expect(screen.getByRole('button', { name: 'Передать' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Сервис' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Журнал' })).toBeInTheDocument()
    })
  })

  describe('status chip', () => {
    it('shows "Активен" for available status', () => {
      render(<ToolCard item={makeItem({ status: 'available' })} />)

      expect(screen.getByText('Активен')).toBeInTheDocument()
    })

    it('shows "В пути" for in_use status', () => {
      render(<ToolCard item={makeItem({ status: 'in_use' })} />)

      expect(screen.getByText('В пути')).toBeInTheDocument()
    })

    it('shows "На списании" for maintenance status', () => {
      render(<ToolCard item={makeItem({ status: 'maintenance' })} />)

      expect(screen.getByText('На списании')).toBeInTheDocument()
    })

    it('shows "Утилизирован" for written_off status', () => {
      render(<ToolCard item={makeItem({ status: 'written_off' })} />)

      expect(screen.getByText('Утилизирован')).toBeInTheDocument()
    })
  })

  describe('written_off styling', () => {
    it('applies line-through class to tool name when status is written_off', () => {
      render(<ToolCard item={makeItem({ status: 'written_off' })} />)

      const heading = screen.getByRole('heading', { name: 'Перфоратор Bosch' })
      expect(heading).toHaveClass('line-through')
    })

    it('does not apply line-through class when status is not written_off', () => {
      render(<ToolCard item={makeItem({ status: 'available' })} />)

      const heading = screen.getByRole('heading', { name: 'Перфоратор Bosch' })
      expect(heading).not.toHaveClass('line-through')
    })
  })

  describe('callbacks', () => {
    it('calls onTransfer with the item when Передать is clicked', async () => {
      const user = userEvent.setup()
      const onTransfer = vi.fn()

      render(<ToolCard item={baseItem} onTransfer={onTransfer} />)

      await user.click(screen.getByRole('button', { name: 'Передать' }))

      expect(onTransfer).toHaveBeenCalledTimes(1)
      expect(onTransfer).toHaveBeenCalledWith(baseItem)
    })

    it('calls onService with the item when Сервис is clicked', async () => {
      const user = userEvent.setup()
      const onService = vi.fn()

      render(<ToolCard item={baseItem} onService={onService} />)

      await user.click(screen.getByRole('button', { name: 'Сервис' }))

      expect(onService).toHaveBeenCalledTimes(1)
      expect(onService).toHaveBeenCalledWith(baseItem)
    })

    it('calls onLog with the item when Журнал is clicked', async () => {
      const user = userEvent.setup()
      const onLog = vi.fn()

      render(<ToolCard item={baseItem} onLog={onLog} />)

      await user.click(screen.getByRole('button', { name: 'Журнал' }))

      expect(onLog).toHaveBeenCalledTimes(1)
      expect(onLog).toHaveBeenCalledWith(baseItem)
    })

    it('calls onClick with the item when the card body is clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      render(<ToolCard item={baseItem} onClick={onClick} />)

      await user.click(screen.getByRole('button', { name: 'Перфоратор Bosch' }))

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(baseItem)
    })

    it('does not call onClick when Передать is clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const onTransfer = vi.fn()

      render(<ToolCard item={baseItem} onClick={onClick} onTransfer={onTransfer} />)

      await user.click(screen.getByRole('button', { name: 'Передать' }))

      expect(onClick).not.toHaveBeenCalled()
      expect(onTransfer).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when Сервис is clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const onService = vi.fn()

      render(<ToolCard item={baseItem} onClick={onClick} onService={onService} />)

      await user.click(screen.getByRole('button', { name: 'Сервис' }))

      expect(onClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when Журнал is clicked', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const onLog = vi.fn()

      render(<ToolCard item={baseItem} onClick={onClick} onLog={onLog} />)

      await user.click(screen.getByRole('button', { name: 'Журнал' }))

      expect(onClick).not.toHaveBeenCalled()
    })

    it('does not throw when optional callbacks are not provided and buttons are clicked', async () => {
      const user = userEvent.setup()

      render(<ToolCard item={baseItem} />)

      await expect(user.click(screen.getByRole('button', { name: 'Передать' }))).resolves.not.toThrow()
      await expect(user.click(screen.getByRole('button', { name: 'Сервис' }))).resolves.not.toThrow()
      await expect(user.click(screen.getByRole('button', { name: 'Журнал' }))).resolves.not.toThrow()
    })
  })

  describe('accessibility', () => {
    it('has role="button" on the card when onClick is provided', () => {
      const onClick = vi.fn()
      render(<ToolCard item={baseItem} onClick={onClick} />)

      expect(screen.getByRole('button', { name: 'Перфоратор Bosch' })).toBeInTheDocument()
    })

    it('does not have role="button" on the card when onClick is not provided', () => {
      render(<ToolCard item={baseItem} />)

      const article = document.querySelector('article')
      expect(article).not.toHaveAttribute('role', 'button')
    })

    it('triggers onClick via Enter key on the card', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      render(<ToolCard item={baseItem} onClick={onClick} />)

      const card = screen.getByRole('button', { name: 'Перфоратор Bosch' })
      card.focus()
      await user.keyboard('{Enter}')

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(baseItem)
    })

    it('triggers onClick via Space key on the card', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()

      render(<ToolCard item={baseItem} onClick={onClick} />)

      const card = screen.getByRole('button', { name: 'Перфоратор Bosch' })
      card.focus()
      await user.keyboard(' ')

      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick).toHaveBeenCalledWith(baseItem)
    })
  })
})
