'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Event } from '@/types/crm'

interface Props {
  events: (Event & { client?: { name: string }; project?: { name: string } })[]
  onDayClick?: (dateStr: string) => void
  onEventEdit?: (event: Event & { client?: { name: string }; project?: { name: string } }) => void
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export default function Calendar({ events, onDayClick, onEventEdit }: Props) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null) }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null) }

  function eventsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter((e) => e.start_at.startsWith(dateStr))
  }

  function handleDayClick(day: number) {
    setSelectedDay(day === selectedDay ? null : day)
    if (onDayClick) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      onDayClick(dateStr)
    }
  }

  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : []

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendar grid */}
      <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button type="button" aria-label="Mois précédent" onClick={prevMonth} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-faint)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-faint)' }}>
            <ChevronLeft size={18} />
          </button>
          <h2 style={{ fontFamily: 'var(--font-syne-var), sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>
            {MONTHS[month]} {year}
          </h2>
          <button type="button" aria-label="Mois suivant" onClick={nextMonth} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-faint)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-faint)' }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium py-2" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-ghost)' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />
            const dayEvents = eventsForDay(day)
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const isSelected = day === selectedDay
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDayClick(day)}
                className="relative aspect-square rounded-xl flex flex-col items-center justify-start p-1 pt-1.5 transition-all"
                style={{
                  fontFamily: 'var(--font-dm-var), sans-serif',
                  fontSize: '12px',
                  fontWeight: isToday ? 700 : 400,
                  background: isSelected ? 'rgba(123,167,188,0.2)' : isToday ? 'rgba(123,167,188,0.1)' : 'transparent',
                  border: isSelected ? '1px solid rgba(123,167,188,0.3)' : isToday ? '1px solid rgba(123,167,188,0.2)' : '1px solid transparent',
                  color: isToday || isSelected ? 'var(--accent)' : 'rgba(var(--text-rgb), 0.7)',
                }}
              >
                <span>{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full" style={{ background: 'var(--accent)' }} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Events panel */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
        <h3 className="mb-4" style={{ fontFamily: 'var(--font-syne-var), sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>
          {selectedDay ? `${selectedDay} ${MONTHS[month]}` : 'Sélectionner un jour'}
        </h3>

        {selectedDay ? (
          selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-primary)' }}>{event.title}</p>
                    {onEventEdit && (
                      <button
                        type="button"
                        onClick={() => onEventEdit(event)}
                        className="text-xs px-2 py-0.5 rounded-md shrink-0 transition-colors"
                        style={{
                          fontFamily: 'var(--font-dm-var), sans-serif',
                          color: 'var(--accent)',
                          border: '1px solid rgba(123,167,188,0.3)',
                          background: 'rgba(123,167,188,0.08)',
                        }}
                      >
                        Modifier
                      </button>
                    )}
                  </div>
                  {event.client && <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-faint)' }}>{event.client.name}</p>}
                  <p className="text-xs mt-1" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--accent)' }}>
                    {new Date(event.start_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    {event.end_at && ` → ${new Date(event.end_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                  {event.description && <p className="text-xs mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-faint)' }}>{event.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-center py-8" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-ghost)' }}>Aucun événement ce jour</p>
          )
        ) : (
          <p className="text-sm text-center py-8" style={{ fontFamily: 'var(--font-dm-var), sans-serif', color: 'var(--text-ghost)' }}>Cliquez sur un jour pour voir ses événements</p>
        )}
      </div>
    </div>
  )
}
