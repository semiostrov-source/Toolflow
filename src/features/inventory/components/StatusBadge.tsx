import type { ItemStatus } from '..'

const STATUS_LABELS: Record<ItemStatus, string> = {
  available: 'Available',
  in_use: 'In use',
  maintenance: 'Maintenance',
  written_off: 'Written off',
}

interface StatusBadgeProps {
  status: ItemStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const modifierClass = `status-badge--${status}`
  const label = STATUS_LABELS[status]

  return (
    <span
      className={`status-badge ${modifierClass}`}
      aria-label={label}
      title={label}
    />
  )
}

