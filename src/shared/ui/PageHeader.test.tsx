import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders the title text', () => {
    render(<PageHeader title="Inventory" />)

    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })

  it('renders the optional description when provided', () => {
    render(
      <PageHeader
        title="Inventory"
        description="Track stock levels and movements across locations."
      />,
    )

    expect(
      screen.getByText('Track stock levels and movements across locations.'),
    ).toBeInTheDocument()
  })

  it('renders the optional actions content when provided', () => {
    render(
      <PageHeader
        title="Inventory"
        actions={<button type="button">Add item</button>}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Add item' }),
    ).toBeInTheDocument()
  })
})

