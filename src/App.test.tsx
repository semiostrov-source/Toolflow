/**
 * Example test file — demonstrates project conventions for the test-writer agent.
 *
 * Real tests will follow this same structure:
 *   - `*.test.tsx` for React components, `*.test.ts` for pure logic
 *   - Co-located next to the source file
 *   - Imports from 'vitest' (describe, it, expect, vi, beforeEach)
 *   - Uses @testing-library/react for component rendering
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Minimal inline component to keep the example self-contained ---
function Counter({ onReset }: { onReset?: () => void }) {
  const [count, setCount] = React.useState(0)
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      {onReset && <button onClick={onReset}>Reset</button>}
    </div>
  )
}

import React from 'react'

describe('Counter', () => {
  it('starts at zero', () => {
    render(<Counter />)
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('increments on button click', () => {
    render(<Counter />)
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('calls onReset callback when reset button is clicked', () => {
    const handleReset = vi.fn()
    render(<Counter onReset={handleReset} />)
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(handleReset).toHaveBeenCalledOnce()
  })
})

// --- Pure function example ---
function add(a: number, b: number): number {
  return a + b
}

describe('add', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the sum of two numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('handles negative numbers', () => {
    expect(add(-1, 1)).toBe(0)
  })

  it('handles zero', () => {
    expect(add(0, 0)).toBe(0)
  })
})
