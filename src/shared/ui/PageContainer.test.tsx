import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageContainer } from './PageContainer'

describe('PageContainer', () => {
  it('renders children in the document', () => {
    render(
      <PageContainer>
        <span>Page content</span>
      </PageContainer>,
    )
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('wraps children in element with page-container class', () => {
    const { container } = render(
      <PageContainer>
        <span>Content</span>
      </PageContainer>,
    )
    const wrapper = container.querySelector('.page-container')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toContainElement(screen.getByText('Content'))
  })
})
