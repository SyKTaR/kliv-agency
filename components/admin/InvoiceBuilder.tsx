'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { LineItem } from '@/types/crm'

interface Props {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  tva: number
  onTvaChange: (tva: number) => void
}

export default function InvoiceBuilder({ items, onChange, tva, onTvaChange }: Props) {
  function addLine() {
    onChange([...items, { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0 }])
  }

  function updateLine(id: string, key: keyof LineItem, value: string | number) {
    onChange(items.map((item) => item.id === id ? { ...item, [key]: value } : item))
  }

  function removeLine(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  const tvaAmount = subtotal * (tva / 100)
  const total = subtotal + tvaAmount

  return (
    <div className="space-y-4">
      {/* Lines */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-1 text-xs text-[var(--text-ghost)] font-[family-name:var(--font-dm)] font-medium uppercase tracking-wider">
          <div className="col-span-6">Désignation</div>
          <div className="col-span-2 text-right">Qté</div>
          <div className="col-span-3 text-right">Prix unit.</div>
          <div className="col-span-1" />
        </div>

        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-6">
              <input
                value={item.description}
                onChange={(e) => updateLine(item.id, 'description', e.target.value)}
                placeholder="Prestation, description..."
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] placeholder:text-[var(--text-ghost)] outline-none focus:border-[#7BA7BC]/40 transition-colors"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                min="0"
                step="0.5"
                value={item.quantity}
                onChange={(e) => updateLine(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] text-right outline-none focus:border-[#7BA7BC]/40 transition-colors"
              />
            </div>
            <div className="col-span-3">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => updateLine(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 pr-7 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg text-[var(--text-primary)] text-sm font-[family-name:var(--font-dm)] text-right outline-none focus:border-[#7BA7BC]/40 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-ghost)] text-xs font-[family-name:var(--font-dm)]">€</span>
              </div>
            </div>
            <div className="col-span-1 flex justify-center">
              <button
                type="button"
                onClick={() => removeLine(item.id)}
                className="text-[var(--text-ultra-faint)] hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addLine}
          className="flex items-center gap-2 text-[#7BA7BC] text-sm font-[family-name:var(--font-dm)] hover:text-[#7BA7BC]/80 transition-colors mt-2"
        >
          <Plus size={15} />
          Ajouter une ligne
        </button>
      </div>

      {/* Totals */}
      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2">
        <div className="flex justify-between text-sm font-[family-name:var(--font-dm)]">
          <span className="text-[var(--text-muted)]">Sous-total HT</span>
          <span className="text-[var(--text-primary)]">{subtotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-dm)]">TVA</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={tva}
                onChange={(e) => onTvaChange(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg text-[var(--text-primary)] text-xs font-[family-name:var(--font-dm)] text-right outline-none focus:border-[#7BA7BC]/40 transition-colors"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-ghost)] text-xs">%</span>
            </div>
          </div>
          <span className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-dm)]">{tvaAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
        </div>

        <div className="flex justify-between pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-[var(--text-primary)] font-medium font-[family-name:var(--font-dm)]">Total TTC</span>
          <span className="text-[#7BA7BC] font-bold text-lg font-[family-name:var(--font-syne)]">
            {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </span>
        </div>
      </div>
    </div>
  )
}
