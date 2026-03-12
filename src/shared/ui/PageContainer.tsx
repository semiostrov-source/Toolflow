import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

/**
 * Wraps page content with consistent max-width and padding.
 */
export function PageContainer({ children }: PageContainerProps) {
  return <div className="page-container">{children}</div>
}
