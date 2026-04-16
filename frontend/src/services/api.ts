import type { SelectedCard } from '../data/tarot-deck'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface ReadingResult {
  past: string
  present: string
  future: string
  overall: string
  provider: string
}

export async function fetchReading(selected: SelectedCard[]): Promise<ReadingResult> {
  const cards = selected.map((s) => ({
    name: s.card.name,
    name_cn: s.card.nameCn,
    position: s.position,
    reversed: s.reversed,
  }))

  const res = await fetch(`${API_BASE}/api/reading`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cards }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText)
    throw new Error(`API error ${res.status}: ${detail}`)
  }

  return res.json() as Promise<ReadingResult>
}
