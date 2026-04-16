import { useState, useCallback, useRef } from 'react'
import { MAJOR_ARCANA } from '../data/tarot-deck'
import type { TarotCard, SelectedCard, CardPosition } from '../data/tarot-deck'

const CARD_COUNT = MAJOR_ARCANA.length // 22
const POSITIONS: CardPosition[] = ['past', 'present', 'future']

export interface CardRingState {
  rotation: number        // current ring rotation in degrees
  activeIndex: number     // index of card at front-center
  selectedCards: SelectedCard[]
  isDragging: boolean
}

export function useCardRing() {
  const [rotation, setRotation] = useState(0)
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const isDraggingRef = useRef(false)   // ref for stale-closure-safe checks
  const dragStartX = useRef(0)
  const dragStartRotation = useRef(0)
  const velocityRef = useRef(0)
  const lastXRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  // Keep a ref to selectedCards so the inertia-snap closure can read current value
  const selectedCardsRef = useRef<SelectedCard[]>([])

  const stepAngle = 360 / CARD_COUNT

  // Keep selectedCardsRef in sync so snap closure always has latest value
  selectedCardsRef.current = selectedCards

  // The active (front-facing) card index based on current rotation
  // Apply double modulo to guard against Math.round rounding 21.5→22 (out of bounds)
  const activeIndex = Math.round((-rotation / stepAngle + CARD_COUNT * 100) % CARD_COUNT) % CARD_COUNT

  const stopInertia = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }, [])

  const startInertia = useCallback((initialVelocity: number) => {
    stopInertia()
    let vel = initialVelocity

    const tick = () => {
      vel *= 0.93 // friction
      if (Math.abs(vel) < 0.05) {
        // Snap to nearest *unselected* card position
        setRotation(r => {
          const nearestIdx = Math.round((-r / stepAngle + CARD_COUNT * 100) % CARD_COUNT)
          const selected = selectedCardsRef.current
          // Walk outward from nearestIdx to find an unselected card
          for (let offset = 0; offset < CARD_COUNT; offset++) {
            const a = (nearestIdx + offset) % CARD_COUNT
            if (!selected.some(s => s.card.id === MAJOR_ARCANA[a].id)) {
              return -a * stepAngle
            }
            const b = (nearestIdx - offset + CARD_COUNT) % CARD_COUNT
            if (!selected.some(s => s.card.id === MAJOR_ARCANA[b].id)) {
              return -b * stepAngle
            }
          }
          return Math.round(r / stepAngle) * stepAngle // fallback (all selected)
        })
        return
      }
      setRotation(r => r + vel)
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
  }, [stopInertia, stepAngle])

  const onDragStart = useCallback((clientX: number) => {
    stopInertia()
    isDraggingRef.current = true
    setIsDragging(true)
    dragStartX.current = clientX
    lastXRef.current = clientX
    lastTimeRef.current = Date.now()
    setRotation(r => {
      dragStartRotation.current = r
      return r
    })
    velocityRef.current = 0
  }, [stopInertia])

  const onDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return
    const now = Date.now()
    const dt = now - lastTimeRef.current
    const dx = clientX - lastXRef.current

    if (dt > 0) {
      velocityRef.current = (dx / dt) * 16 // normalize to ~60fps
    }

    lastXRef.current = clientX
    lastTimeRef.current = now

    const totalDx = clientX - dragStartX.current
    setRotation(dragStartRotation.current + totalDx * 0.4)
  }, [])

  const onDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    startInertia(velocityRef.current)
  }, [startInertia])

  const selectCard = useCallback((card: TarotCard) => {
    if (!card) return // guard: activeIndex edge case can yield undefined
    setSelectedCards(prev => {
      if (prev.find(s => s.card.id === card.id)) return prev
      if (prev.length >= 3) return prev
      const position = POSITIONS[prev.length]
      const reversed = Math.random() < 0.3 // 30% chance reversed
      const next = [...prev, { card, position, reversed }]
      // After selecting, advance ring to nearest unselected card
      setRotation(r => {
        const currentIdx = Math.round((-r / stepAngle + CARD_COUNT * 100) % CARD_COUNT)
        for (let offset = 1; offset < CARD_COUNT; offset++) {
          const a = (currentIdx + offset) % CARD_COUNT
          if (!next.some(s => s.card.id === MAJOR_ARCANA[a].id)) {
            return -a * stepAngle
          }
          const b = (currentIdx - offset + CARD_COUNT) % CARD_COUNT
          if (!next.some(s => s.card.id === MAJOR_ARCANA[b].id)) {
            return -b * stepAngle
          }
        }
        return r
      })
      return next
    })
  }, [stepAngle])

  const resetSelection = useCallback(() => {
    setSelectedCards([])
  }, [])

  const rotateToCard = useCallback((index: number) => {
    stopInertia()
    setRotation(-index * stepAngle)
  }, [stopInertia, stepAngle])

  return {
    rotation,
    activeIndex,
    selectedCards,
    isDragging,
    cards: MAJOR_ARCANA,
    onDragStart,
    onDragMove,
    onDragEnd,
    selectCard,
    resetSelection,
    rotateToCard,
  }
}
