import { useState, useEffect, useRef, useCallback } from 'react'
import ThreeCardRing from './components/ThreeCardRing'
import StarsCanvas from './components/StarsCanvas'
import CardSlot from './components/CardSlot'
import HandTracker from './components/HandTracker'
import { useCardRing } from './hooks/useCardRing'
import { useHandGesture } from './hooks/useHandGesture'
import { useSoundFX } from './hooks/useSoundFX'
import type { CardPosition, TarotCard } from './data/tarot-deck'
import { fetchReading, type ReadingResult } from './services/api'
import './App.css'

const POSITIONS: CardPosition[] = ['past', 'present', 'future']
const POSITION_LABELS: Record<CardPosition, string> = {
  past: '过去',
  present: '现在',
  future: '未来',
}
const POSITION_LABELS_EN: Record<CardPosition, string> = {
  past: 'PAST',
  present: 'PRESENT',
  future: 'FUTURE',
}
const ROMAN = ['Ⅰ', 'Ⅱ', 'Ⅲ']

type AppPhase = 'selection' | 'loading' | 'reading'

export default function App() {
  const {
    rotation,
    activeIndex,
    selectedCards,
    cards,
    onDragStart,
    onDragMove,
    onDragEnd,
    selectCard,
    resetSelection,
  } = useCardRing()

  const gestureState = useHandGesture()
  const { gesture, wristX, isHandDetected } = gestureState
  const { playSelect, playReset, playReveal } = useSoundFX()

  const handleSelectCard = useCallback((card: TarotCard) => {
    const slotIdx = selectedCards.length  // next slot index
    selectCard(card)
    playSelect()
    // Golden arc trail animation
    setArcSlotIndex(slotIdx)
    setTimeout(() => setArcSlotIndex(null), 600)
  }, [selectCard, playSelect, selectedCards.length])

  const [phase, setPhase] = useState<AppPhase>('selection')
  const [revealed, setRevealed] = useState(false)
  const [reading, setReading] = useState<ReadingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [arcSlotIndex, setArcSlotIndex] = useState<number | null>(null)

  const isComplete = selectedCards.length === 3

  // Virtual screen width used to convert normalized wrist pos → drag pixels
  const WRIST_SCALE = 1400  // px: full hand sweep (0→1) ≈ 1400px drag

  const prevWristX  = useRef<number | null>(null)
  const handWasPrev = useRef(false)

  // Continuous wrist → drag (ring rotation)
  useEffect(() => {
    if (phase !== 'selection') return

    if (isHandDetected && wristX !== null) {
      const virtualX = wristX * WRIST_SCALE
      if (!handWasPrev.current) {
        // Hand just appeared — start drag
        onDragStart(virtualX)
      } else {
        onDragMove(virtualX)
      }
      prevWristX.current = wristX
      handWasPrev.current = true
    } else if (handWasPrev.current) {
      // Hand just disappeared — end drag (triggers inertia)
      onDragEnd()
      prevWristX.current = null
      handWasPrev.current = false
    }
  }, [wristX, isHandDetected, phase, onDragStart, onDragMove, onDragEnd])

  // Discrete gestures: pinch → select, open → reset
  useEffect(() => {
    if (phase !== 'selection' || !gesture) return
    if (gesture === 'pinch' && selectedCards.length < 3) {
      selectCard(cards[activeIndex])
      playSelect()
    } else if (gesture === 'open') {
      resetSelection()
      playReset()
    }
  }, [gesture, phase, activeIndex, cards, selectedCards, selectCard, resetSelection])

  const handleReveal = async () => {
    setPhase('loading')
    setError(null)
    playReveal()
    try {
      const result = await fetchReading(selectedCards)
      setReading(result)
      setPhase('reading')
      setTimeout(() => setRevealed(true), 200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 服务暂时不可用')
      setPhase('selection')
    }
  }

  const handleReset = () => {
    setPhase('selection')
    setRevealed(false)
    setReading(null)
    setError(null)
    resetSelection()
    playReset()
  }

  const interpretations: Record<CardPosition, string> = {
    past: reading?.past ?? '',
    present: reading?.present ?? '',
    future: reading?.future ?? '',
  }

  return (
    <div className="app">
      {/* Three.js stars background */}
      <StarsCanvas />

      {/* Hand gesture tracker — always visible */}
      <HandTracker state={gestureState} />

      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">THE FATE RING</h1>
        <p className="app-subtitle">选择三张属于你的命运之牌</p>
      </header>

      {phase === 'selection' && (
        <>
          <ThreeCardRing
            cards={cards}
            rotation={rotation}
            activeIndex={activeIndex}
            selectedCards={selectedCards}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
            onSelectCard={handleSelectCard}
          />

          <div className="slot-area">
            {/* Golden arc trail on card selection */}
            {arcSlotIndex !== null && (
              <div
                className="arc-trail"
                style={{ '--slot-index': arcSlotIndex } as React.CSSProperties}
              />
            )}

            <div className="slot-row">
              {POSITIONS.map((pos, i) => (
                <CardSlot
                  key={pos}
                  position={pos}
                  card={selectedCards[i] ?? null}
                  revealed={false}
                  autoReveal
                />
              ))}
            </div>

            {error && <p className="reading-error">{error}</p>}

            {isComplete ? (
              <button className="btn-reveal btn-reveal--pulse" onClick={handleReveal}>
                揭示命运
              </button>
            ) : (
              <p className="selection-hint">
                拖动旋转牌阵，点击居中的牌选择（{selectedCards.length}/3）
              </p>
            )}
          </div>
        </>
      )}

      {phase === 'loading' && (
        <div className="loading-page">
          <div className="loading-orb" />
          <p className="loading-text">命运之轮正在转动...</p>
          <p className="loading-sub">AI 塔罗师正在解读你的命运</p>
        </div>
      )}

      {phase === 'reading' && (
        <div className="reading-page">
          <h2 className="reading-title">命运解读</h2>
          <p className="reading-subtitle">THE READING</p>

          <div className="reading-cards">
            {POSITIONS.map((pos, i) => (
              <CardSlot
                key={pos}
                position={pos}
                card={selectedCards[i] ?? null}
                revealed={revealed}
                size="large"
              />
            ))}
          </div>

          <div className="reading-interpretations">
            {revealed && POSITIONS.map((pos, i) => {
              const card = selectedCards[i]
              if (!card) return null
              return (
                <div key={pos} className="reading-card-block">
                  <div className="reading-card-header">
                    <span className="reading-card-num">{ROMAN[i]}</span>
                    <span className="reading-card-pos">{POSITION_LABELS[pos]}</span>
                    <span className="reading-card-pos-en">{POSITION_LABELS_EN[pos]}</span>
                    <span className="reading-card-cn">{card.card.nameCn}</span>
                    {card.reversed && <span className="reading-card-reversed">逆位</span>}
                  </div>
                  <p className="reading-card-keywords">
                    {(card.reversed ? card.card.reversedKeywords : card.card.uprightKeywords).join(' · ')}
                  </p>
                  {interpretations[pos] && (
                    <p className="reading-card-text">{interpretations[pos]}</p>
                  )}
                </div>
              )
            })}

            {revealed && reading && (
              <div className="reading-overall">
                <div className="reading-overall-header">◆ 整体解读 · OVERALL</div>
                <p className="reading-overall-text">{reading.overall}</p>
              </div>
            )}
          </div>

          <button className="btn-reset" onClick={handleReset}>
            重新抽牌
          </button>
        </div>
      )}
    </div>
  )
}
