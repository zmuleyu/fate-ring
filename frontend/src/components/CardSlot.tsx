import { useState, useEffect } from 'react'
import type { SelectedCard, CardPosition } from '../data/tarot-deck'
import './CardSlot.css'

const POSITION_LABELS: Record<CardPosition, string> = {
  past: '过去',
  present: '现在',
  future: '未来',
}

interface CardSlotProps {
  position: CardPosition
  card: SelectedCard | null
  revealed: boolean
  autoReveal?: boolean
  size?: 'normal' | 'large'
}

export default function CardSlot({ position, card, revealed, autoReveal, size = 'normal' }: CardSlotProps) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (autoReveal && card) {
      // Auto-flip shortly after card appears in slot
      const t = setTimeout(() => setFlipped(true), 250)
      return () => clearTimeout(t)
    } else if (revealed && card) {
      const t = setTimeout(() => setFlipped(true), 300)
      return () => clearTimeout(t)
    } else if (!card) {
      setFlipped(false)
    }
  }, [revealed, card, autoReveal])

  const tarotCard = card?.card ?? null

  return (
    <div className={`card-slot ${size === 'large' ? 'card-slot--large' : ''}`}>
      <div className="card-slot-label">{POSITION_LABELS[position]}</div>
      <div className={`card-slot-card ${tarotCard ? 'card-slot-card--filled' : ''}`}>
        {tarotCard ? (
          <div className={`card-flip-inner ${flipped ? 'card-flip-inner--flipped' : ''}`}>
            {/* Back face */}
            <div className="card-face card-face--back">
              <img src="/cards/card_back.svg" alt="card back" />
            </div>
            {/* Front face */}
            <div className={`card-face card-face--front ${card?.reversed ? 'card-face--reversed' : ''}`}>
              <img
                src={`/cards/${tarotCard.image}`}
                alt={tarotCard.nameCn}
              />
              <div className="card-face-name">{tarotCard.nameCn}</div>
            </div>
          </div>
        ) : (
          <div className="card-slot-empty">
            <span className="card-slot-empty-icon">✦</span>
          </div>
        )}
      </div>
      {tarotCard && flipped && (
        <div className="card-slot-card-name">
          {tarotCard.name}
          {card?.reversed && <span className="card-slot-reversed"> · 逆位</span>}
        </div>
      )}
    </div>
  )
}
