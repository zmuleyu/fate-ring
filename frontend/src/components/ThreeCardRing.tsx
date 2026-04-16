import { useRef, useCallback, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import type { TarotCard, SelectedCard } from '../data/tarot-deck'
import { drawMotif } from './cardMotifs'
import './ThreeCardRing.css'

const CARD_COUNT = 22
const RADIUS = 380
const CARD_W = 110
const CARD_H = 190

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function buildCardBackTexture(cardId: number): THREE.CanvasTexture {
  const W = 440, H = 760   // 2× native size for sharpness
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#0a0020')
  grad.addColorStop(1, '#1a0040')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Tiny star pattern
  ctx.fillStyle = '#d4af37'
  for (let gx = 0; gx < W; gx += 60) {
    for (let gy = 0; gy < H; gy += 60) {
      ctx.globalAlpha = 0.4;  ctx.beginPath(); ctx.arc(gx + 30, gy + 30, 1.6, 0, Math.PI * 2); ctx.fill()
      ctx.globalAlpha = 0.3;  ctx.beginPath(); ctx.arc(gx + 10, gy + 10, 0.8, 0, Math.PI * 2); ctx.fill()
      ctx.globalAlpha = 0.2;  ctx.beginPath(); ctx.arc(gx + 50, gy + 16, 0.6, 0, Math.PI * 2); ctx.fill()
      ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(gx + 16, gy + 44, 0.6, 0, Math.PI * 2); ctx.fill()
    }
  }
  ctx.globalAlpha = 1

  // Outer gold border (ornate double frame)
  ctx.strokeStyle = '#d4af37'
  ctx.lineWidth = 3
  roundRect(ctx, 8, 8, W - 16, H - 16, 20)
  ctx.stroke()

  // Inner gold border
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.4
  roundRect(ctx, 24, 24, W - 48, H - 48, 14)
  ctx.stroke()

  // Corner ornament dots (4 corners, 3-dot cluster each)
  ctx.globalAlpha = 0.5
  ctx.fillStyle = '#d4af37'
  const cps: [number, number][] = [[44, 55], [W - 44, 55], [44, H - 55], [W - 44, H - 55]]
  for (const [ox, oy] of cps) {
    ctx.beginPath(); ctx.arc(ox, oy, 4, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 0.3
    ctx.beginPath(); ctx.arc(ox - 12, oy, 2.5, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(ox + 12, oy, 2.5, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 0.5
  }
  ctx.globalAlpha = 1

  // Concentric circles at centre
  const cx = W / 2, cy = H / 2
  const circles: [number, number][] = [[120, 0.15], [90, 0.1], [60, 0.08]]
  for (const [r, alpha] of circles) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 0.8
    ctx.globalAlpha = alpha
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // Unique motif per card (Canvas 2D path art)
  drawMotif(ctx, cardId, cx, cy)
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}

// ---------- interfaces ----------
interface ThreeCardRingProps {
  cards: TarotCard[]
  rotation: number
  activeIndex: number
  selectedCards: SelectedCard[]
  onDragStart: (x: number) => void
  onDragMove: (x: number) => void
  onDragEnd: () => void
  onSelectCard: (card: TarotCard) => void
}

// ---- inner scene — must live inside <Canvas> ----
function CardRingScene({
  cards,
  rotation,
  activeIndex,
  selectedCards,
  showSparkle,
  showFlash,
}: {
  cards: TarotCard[]
  rotation: number
  activeIndex: number
  selectedCards: SelectedCard[]
  showSparkle: boolean
  showFlash: boolean
}) {
  // 22 unique card back textures — built once per card
  const backTextures = useMemo(
    () => cards.map(c => buildCardBackTexture(c.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const rotationRad = (rotation * Math.PI) / 180

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 250, 700]} intensity={1.5} color="#fff8e7" />

      {/* Ring group — rotation drives carousel */}
      <group rotation={[0, rotationRad, 0]}>
        {cards.map((card, i) => {
          const isSelected = selectedCards.some(s => s.card.id === card.id)
          if (isSelected) return null  // selected cards disappear → visible gap

          const angle    = (i * 2 * Math.PI) / CARD_COUNT
          const x        = Math.sin(angle) * RADIUS
          const z        = Math.cos(angle) * RADIUS
          const isActive = i === activeIndex

          // Flash pulse: all cards glow briefly on selection
          const emissive = showFlash ? 0.25 : (isActive ? 0.45 : 0)

          return (
            <mesh
              key={card.id}
              position={[x, 0, z]}
              rotation={[0, angle, 0]}
            >
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshStandardMaterial
                map={backTextures[i]}
                emissive="#d4af37"
                emissiveIntensity={emissive}
              />
            </mesh>
          )
        })}
      </group>

      {/* Gold sparkle burst on card select */}
      {showSparkle && (
        <Sparkles
          position={[0, 0, RADIUS]}
          count={45}
          scale={[220, 220, 60]}
          size={9}
          speed={0.6}
          color="#d4af37"
        />
      )}
    </>
  )
}

// ---- public component ----
export default function ThreeCardRing({
  cards,
  rotation,
  activeIndex,
  selectedCards,
  onDragStart,
  onDragMove,
  onDragEnd,
  onSelectCard,
}: ThreeCardRingProps) {
  const isDraggingRef         = useRef(false)
  const dragStartXRef         = useRef(0)
  const activeIndexAtDownRef  = useRef(activeIndex)
  const [showSparkle, setShowSparkle] = useState(false)
  const [showFlash, setShowFlash]     = useState(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current        = true
    dragStartXRef.current        = e.clientX
    activeIndexAtDownRef.current = activeIndex
    e.currentTarget.setPointerCapture(e.pointerId)
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

    // Treat as click if barely moved
    if (dx < 20 && selectedCards.length < 3) {
      const card = cards[activeIndexAtDownRef.current]
      if (!card) return // guard against out-of-bounds index
      if (!selectedCards.some(s => s.card.id === card.id)) {
        onSelectCard(card)
        // Sparkle burst + flash pulse
        setShowSparkle(true)
        setShowFlash(true)
        setTimeout(() => setShowSparkle(false), 800)
        setTimeout(() => setShowFlash(false), 300)
      }
    }
  }, [onDragEnd, selectedCards, cards, onSelectCard])

  return (
    <div
      className="three-ring-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, 900], fov: 50, far: 2000 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <CardRingScene
          cards={cards}
          rotation={rotation}
          activeIndex={activeIndex}
          selectedCards={selectedCards}
          showSparkle={showSparkle}
          showFlash={showFlash}
        />
      </Canvas>

      {/* Active card label (HTML overlay at ring bottom centre) */}
      {(() => {
        const active = cards[activeIndex]
        const isSelected = selectedCards.some(s => s.card.id === active.id)
        return (
          <div className="three-ring-label">
            <span className="three-ring-card-cn">{active.nameCn}</span>
            {!isSelected && selectedCards.length < 3 && (
              <span className="three-ring-hint">点击选牌</span>
            )}
            {isSelected && (
              <span className="three-ring-selected">已选</span>
            )}
          </div>
        )
      })()}

      {/* Centre concentric circle indicator */}
      <div className="ring-center-indicator" />
    </div>
  )
}
