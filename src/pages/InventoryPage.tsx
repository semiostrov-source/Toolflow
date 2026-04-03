import { useState } from 'react'
import { ToolCard, mockItems } from '../features/inventory'

export function InventoryPage() {
  const [search, setSearch] = useState('')

  const filtered = mockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="px-4 pb-4">
      <div className="pt-3 pb-2">
        <h1 className="mb-1 text-xl font-bold text-gray-900">Все инструменты</h1>
        <p className="mb-4 text-sm text-gray-600">Каталог и поиск по складу</p>
      </div>

      <input
        type="search"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm mb-4 outline-none focus:border-indigo-400"
      />

      <div>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Ничего не найдено</p>
        ) : (
          filtered.map((item) => (
            <ToolCard
              key={item.id}
              item={item}
              onTransfer={() => {}}
              onService={() => {}}
              onLog={() => {}}
            />
          ))
        )}
      </div>
    </div>
  )
}
