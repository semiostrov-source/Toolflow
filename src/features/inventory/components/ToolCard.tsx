import type { Item, ItemStatus } from '../types/domain'

interface ToolCardProps {
  item: Item
  onTransfer?: (item: Item) => void
  onService?: (item: Item) => void
  onLog?: (item: Item) => void
  onClick?: (item: Item) => void
}

const STATUS_LABELS: Record<ItemStatus, string> = {
  available: 'Активен',
  in_use: 'В пути',
  maintenance: 'На списании',
  written_off: 'Утилизирован',
}

const STATUS_CHIP_CLASSES: Record<ItemStatus, string> = {
  available: 'bg-emerald-50 text-emerald-700',
  in_use: 'bg-blue-50 text-blue-700 animate-pulse',
  maintenance: 'bg-orange-50 text-orange-700',
  written_off: 'bg-gray-100 text-gray-500',
}

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const second = parts[1]?.[0] ?? ''
  return (first + second).toUpperCase()
}

export function ToolCard({ item, onTransfer, onService, onLog, onClick }: ToolCardProps) {
  const statusLabel = STATUS_LABELS[item.status]
  const statusChipClass = STATUS_CHIP_CLASSES[item.status]
  const isWrittenOff = item.status === 'written_off'
  const categoryLabel = item.category ?? item.unit
  const ownerName = item.ownerName ?? 'Не назначен'
  const ownerInitials = getInitials(ownerName)

  return (
    <article
      className="relative bg-white rounded-xl shadow-sm border border-[#e4e8ee] overflow-hidden mb-2 mx-[14px]"
      onClick={() => onClick?.(item)}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? item.name : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter') onClick(item)
              if (e.key === ' ') {
                e.preventDefault()
                onClick(item)
              }
            }
          : undefined
      }
    >
      <span
        data-testid="tool-status-chip"
        className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${statusChipClass}`}
      >
        {statusLabel}
      </span>

      <div className="flex items-start gap-3 p-4 pr-12">
        <div
          data-testid="tool-photo"
          className="w-[72px] h-[72px] rounded-[10px] bg-gray-100 flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <span className="text-4xl select-none">🔧</span>
        </div>

        <div className="min-w-0">
          <h3
            className={`text-lg font-bold text-gray-900 leading-tight ${isWrittenOff ? 'line-through' : ''}`}
          >
            {item.name}
          </h3>

          <p className="text-sm text-gray-500 mt-0.5">
            {categoryLabel} · {item.sku}
          </p>

          <div className="mt-2 flex items-center gap-2 min-w-0">
            <span className="text-sm text-gray-500 whitespace-nowrap">Владелец:</span>
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0"
                aria-hidden="true"
              >
                {ownerInitials}
              </div>
              <span className="text-sm text-gray-900 truncate">{ownerName}</span>
            </div>
          </div>
        </div>
      </div>

      <div data-testid="tool-card-divider" className="border-t border-gray-200" />

      <div className="flex gap-2 p-4 pt-3">
        <button
          type="button"
          className="flex-1 py-2 text-sm font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onTransfer?.(item)
          }}
        >
          Передать
        </button>
        <button
          type="button"
          className="flex-1 py-2 text-sm font-semibold rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onService?.(item)
          }}
        >
          Сервис
        </button>
        <button
          type="button"
          className="flex-1 py-2 text-sm font-semibold rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onLog?.(item)
          }}
        >
          Журнал
        </button>
      </div>
    </article>
  )
}
