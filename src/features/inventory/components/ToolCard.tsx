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

export function ToolCard({ item, onTransfer, onService, onLog, onClick }: ToolCardProps) {
  const statusLabel = STATUS_LABELS[item.status]
  const statusChipClass = STATUS_CHIP_CLASSES[item.status]
  const isWrittenOff = item.status === 'written_off'

  return (
    <article
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-3"
      onClick={() => onClick?.(item)}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? item.name : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(item) } : undefined}
    >
      {/* Photo area */}
      <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
        <span className="text-5xl select-none" aria-hidden="true">🔧</span>

        {/* Chips overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 truncate max-w-[60%]">
            {item.unit}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusChipClass}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-4">
        <h3
          className={`text-lg font-bold text-gray-900 leading-tight mb-0.5 ${isWrittenOff ? 'line-through' : ''}`}
        >
          {item.name}
        </h3>
        <p className="text-sm font-mono text-gray-400 mb-3">#{item.sku}</p>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 py-2 text-sm font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            onClick={(e) => { e.stopPropagation(); onTransfer?.(item) }}
          >
            Передать
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-sm font-semibold rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={(e) => { e.stopPropagation(); onService?.(item) }}
          >
            Сервис
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-sm font-semibold rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={(e) => { e.stopPropagation(); onLog?.(item) }}
          >
            Журнал
          </button>
        </div>
      </div>
    </article>
  )
}
