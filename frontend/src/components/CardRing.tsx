import { useRef, useCallback } from 'react'
import type { TarotCard, SelectedCard } from '../data/tarot-deck'
import './CardRing.css'

interface CardRingProps {
  cards: TarotCard[]
  rotation: number
  activeIndex: number
  selectedCards: SelectedCard[]
  onDragStart: (x: number) => void
  onDragMove: (x: number) => void
  onDragEnd: () => void
  onSelectCard: (card: TarotCard) => void
}

const CARD_COUNT = 22
const RADIUS = 380 // px — ring radius
const CARD_W = 110
const CARD_H = 190

export default function CardRing({
  cards,
  rotation,
  activeIndex,
  selectedCards,
  onDragStart,
  onDragMove,
  onDragEnd,
  onSelectCard,
}: CardRingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const activeIndexAtDownRef = useRef(activeIndex)

  const stepAngle = 360 / CARD_COUNT

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true
    dragStartXRef.current = e.clientX
    activeIndexAtDownRef.current = activeIndex  // snapshot before inertia
    containerRef.current?.setPointerCapture(e.pointerId)
    onDragStart(e.clientX)
  }, [onDragStart, activeIndex])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    onDragMove(e.clientX)
  }, [onDragMove])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    const dx = Math.abs(e.clientX - dragStartXRef.current)
    isDraggingRef.current = false
    onDragEnd()

    // Treat as click if barely moved (20px tolerance for fast clicks)
    if (dx < 20) {
      const snappedIndex = activeIndexAtDownRef.current
      if (selectedCards.length < 3) {
        onSelectCard(cards[snappedIndex])
      }
    }
  }, [onDragEnd, activeIndex, selectedCards, onSelectCard, cards])

  return (
    <div
      ref={containerRef}
      className="card-ring-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="card-ring-stage">
        {cards.map((card, i) => {
          const angle = i * stepAngle + rotation
          const rad = (angle * Math.PI) / 180
          // Project 3D ring onto 2D: x and z determine position
          const x = Math.sin(rad) * RADIUS
          const z = Math.cos(rad) * RADIUS
          // Scale based on z depth (perspective simulation)
          const scale = (z + RADIUS) / (RADIUS * 2) * 0.6 + 0.4
          const opacity = scale * 0.9 + 0.1
          const isActive = i === activeIndex
          const isSelected = selectedCards.some(s => s.card.id === card.id)

          return (
            <div
              key={card.id}
              data-card-index={i}
              className={`ring-card ${isActive ? 'ring-card--active' : ''} ${isSelected ? 'ring-card--selected' : ''}`}
              style={{
                transform: `translateX(${x}px) scale(${scale})`,
                zIndex: Math.round(z + RADIUS),
                opacity,
                width: CARD_W,
                height: CARD_H,
              }}
              onClick={isActive && !isSelected && selectedCards.length < 3
                ? () => onSelectCard(card)
                : undefined}
            >
              <div className="ring-card-inner">
                {/* Card back always shown in ring */}
                <img
                  src="/cards/card_back.svg"
                  alt={card.nameCn}
                  draggable={false}
                  className="ring-card-img"
                />
                {isActive && (
                  <div className="ring-card-label">
                    <span className="ring-card-cn">{card.nameCn}</span>
                    {!isSelected && selectedCards.length < 3 && (
                      <span className="ring-card-hint">点击选牌</span>
                    )}
                    {isSelected && (
                      <span className="ring-card-selected-badge">已选</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Center glow indicator */}
      <div className="ring-center-indicator" />
    </div>
  )
}
