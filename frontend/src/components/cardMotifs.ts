// Canvas 2D motif drawings for 22 Major Arcana card backs
// Each function draws a unique symbol in the center of the card texture
// All motifs use gold (#d4af37) on transparent, caller sets globalAlpha

type Ctx = CanvasRenderingContext2D

const GOLD = '#d4af37'

// Helper: draw a star with n points
function starPath(ctx: Ctx, cx: number, cy: number, outerR: number, innerR: number, points: number) {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const a = (Math.PI * i) / points - Math.PI / 2
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

// Helper: draw a heart shape
function heartPath(ctx: Ctx, cx: number, cy: number, size: number) {
  ctx.beginPath()
  ctx.moveTo(cx, cy + size * 0.4)
  ctx.bezierCurveTo(cx - size * 0.6, cy - size * 0.1, cx - size * 0.6, cy - size * 0.6, cx, cy - size * 0.3)
  ctx.bezierCurveTo(cx + size * 0.6, cy - size * 0.6, cx + size * 0.6, cy - size * 0.1, cx, cy + size * 0.4)
  ctx.closePath()
}

// 0 The Fool — wandering spiral + small flower
function drawFool(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  // Spiral
  ctx.beginPath()
  for (let a = 0; a < Math.PI * 6; a += 0.1) {
    const r = 10 + a * 6
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    if (a === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.globalAlpha = 0.5
  ctx.stroke()
  // Small flower at spiral end
  ctx.globalAlpha = 0.6
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5
    ctx.beginPath()
    ctx.arc(cx + Math.cos(a) * 20, cy - 70 + Math.sin(a) * 20, 8, 0, Math.PI * 2)
    ctx.stroke()
  }
}

// 1 The Magician — infinity symbol (lemniscate)
function drawMagician(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  for (let t = 0; t <= Math.PI * 2; t += 0.02) {
    const scale = 55
    const x = cx + (scale * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t))
    const y = cy + (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t))
    if (t === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()
  // Wand below
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx, cy + 30)
  ctx.lineTo(cx, cy + 75)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, cy + 28, 4, 0, Math.PI * 2)
  ctx.fillStyle = GOLD
  ctx.fill()
}

// 2 The High Priestess — crescent moon + cross
function drawHighPriestess(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  // Crescent moon — draw as two arcs (no destination-out which destroys bg)
  ctx.globalAlpha = 0.55
  ctx.beginPath()
  // Outer arc (left side of crescent)
  ctx.arc(cx, cy - 20, 40, Math.PI * 0.62, Math.PI * 1.88)
  ctx.stroke()
  // Fill the crescent shape between two arcs
  ctx.globalAlpha = 0.35
  ctx.fillStyle = GOLD
  ctx.beginPath()
  ctx.arc(cx, cy - 20, 40, Math.PI * 0.62, Math.PI * 1.88)
  ctx.arc(cx + 16, cy - 20, 35, Math.PI * 1.88, Math.PI * 0.62, true)
  ctx.closePath()
  ctx.fill()
  // Cross below
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx, cy + 20)
  ctx.lineTo(cx, cy + 70)
  ctx.moveTo(cx - 18, cy + 38)
  ctx.lineTo(cx + 18, cy + 38)
  ctx.stroke()
}

// 3 The Empress — lotus / flower bloom
function drawEmpress(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.55
  // Petals (8)
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8
    ctx.beginPath()
    ctx.ellipse(cx + Math.cos(a) * 25, cy + Math.sin(a) * 25, 22, 10, a, 0, Math.PI * 2)
    ctx.stroke()
  }
  // Inner circle
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  ctx.arc(cx, cy, 12, 0, Math.PI * 2)
  ctx.fillStyle = GOLD
  ctx.fill()
}

// 4 The Emperor — shield with cross
function drawEmperor(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.55
  // Shield shape
  ctx.beginPath()
  ctx.moveTo(cx, cy + 55)
  ctx.lineTo(cx - 42, cy + 10)
  ctx.lineTo(cx - 42, cy - 40)
  ctx.lineTo(cx + 42, cy - 40)
  ctx.lineTo(cx + 42, cy + 10)
  ctx.closePath()
  ctx.stroke()
  // Cross inside
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  ctx.moveTo(cx, cy - 30)
  ctx.lineTo(cx, cy + 35)
  ctx.moveTo(cx - 28, cy - 5)
  ctx.lineTo(cx + 28, cy - 5)
  ctx.stroke()
}

// 5 The Hierophant — triple cross (papal cross)
function drawHierophant(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.55
  // Vertical staff
  ctx.beginPath()
  ctx.moveTo(cx, cy - 60)
  ctx.lineTo(cx, cy + 60)
  ctx.stroke()
  // Three crossbars (ascending widths)
  const bars: [number, number][] = [[-55, 24], [-40, 14], [-25, 6]]
  for (const [yOff, halfW] of bars) {
    ctx.beginPath()
    ctx.moveTo(cx - halfW, cy + yOff)
    ctx.lineTo(cx + halfW, cy + yOff)
    ctx.stroke()
  }
  // Circle at top
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  ctx.arc(cx, cy - 60, 8, 0, Math.PI * 2)
  ctx.stroke()
}

// 6 The Lovers — overlapping hearts
function drawLovers(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.5
  heartPath(ctx, cx - 15, cy, 55)
  ctx.stroke()
  ctx.globalAlpha = 0.4
  heartPath(ctx, cx + 15, cy, 55)
  ctx.stroke()
  // Small star above
  ctx.globalAlpha = 0.5
  starPath(ctx, cx, cy - 55, 10, 4, 6)
  ctx.fillStyle = GOLD
  ctx.fill()
}

// 7 The Chariot — lightning bolt + star
function drawChariot(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.55
  // Lightning bolt
  ctx.beginPath()
  ctx.moveTo(cx + 5, cy - 55)
  ctx.lineTo(cx - 15, cy - 5)
  ctx.lineTo(cx + 5, cy - 5)
  ctx.lineTo(cx - 10, cy + 55)
  ctx.stroke()
  // Star at top
  ctx.globalAlpha = 0.5
  starPath(ctx, cx + 5, cy - 60, 12, 5, 6)
  ctx.fillStyle = GOLD
  ctx.fill()
}

// 8 Strength — lion head outline
function drawStrength(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.5
  // Head circle
  ctx.beginPath()
  ctx.arc(cx, cy, 28, 0, Math.PI * 2)
  ctx.stroke()
  // Mane arcs
  for (let i = 0; i < 10; i++) {
    const a = Math.PI * 0.3 + (Math.PI * 1.4 * i) / 9
    ctx.beginPath()
    ctx.arc(cx + Math.cos(a) * 38, cy + Math.sin(a) * 38, 14, 0, Math.PI * 2)
    ctx.globalAlpha = 0.25
    ctx.stroke()
  }
  // Eyes
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.arc(cx - 10, cy - 6, 3, 0, Math.PI * 2)
  ctx.arc(cx + 10, cy - 6, 3, 0, Math.PI * 2)
  ctx.fillStyle = GOLD
  ctx.fill()
}

// 9 The Hermit — lantern
function drawHermit(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.55
  // Lantern body
  ctx.beginPath()
  ctx.moveTo(cx - 18, cy - 15)
  ctx.lineTo(cx - 22, cy + 25)
  ctx.lineTo(cx + 22, cy + 25)
  ctx.lineTo(cx + 18, cy - 15)
  ctx.closePath()
  ctx.stroke()
  // Top cap
  ctx.beginPath()
  ctx.moveTo(cx - 18, cy - 15)
  ctx.lineTo(cx, cy - 35)
  ctx.lineTo(cx + 18, cy - 15)
  ctx.stroke()
  // Inner glow (concentric)
  ctx.globalAlpha = 0.35
  ctx.beginPath()
  ctx.arc(cx, cy + 5, 12, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 0.2
  ctx.beginPath()
  ctx.arc(cx, cy + 5, 20, 0, Math.PI * 2)
  ctx.stroke()
  // Light rays
  ctx.globalAlpha = 0.3
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 14, cy + 5 + Math.sin(a) * 14)
    ctx.lineTo(cx + Math.cos(a) * 30, cy + 5 + Math.sin(a) * 30)
    ctx.stroke()
  }
  // Staff
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  ctx.moveTo(cx, cy + 25)
  ctx.lineTo(cx, cy + 65)
  ctx.stroke()
}

// 10 Wheel of Fortune — gear/wheel with spokes
function drawWheel(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.5
  // Outer ring
  ctx.beginPath()
  ctx.arc(cx, cy, 50, 0, Math.PI * 2)
  ctx.stroke()
  // Inner ring
  ctx.globalAlpha = 0.35
  ctx.beginPath()
  ctx.arc(cx, cy, 30, 0, Math.PI * 2)
  ctx.stroke()
  // 8 spokes
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 1.5
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15)
    ctx.lineTo(cx + Math.cos(a) * 50, cy + Math.sin(a) * 50)
    ctx.stroke()
  }
  // Center dot
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.arc(cx, cy, 5, 0, Math.PI * 2)
  ctx.fillStyle = GOLD
  ctx.fill()
  // Gear teeth on outer ring
  ctx.globalAlpha = 0.3
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 * i) / 16
    ctx.beginPath()
    ctx.arc(cx + Math.cos(a) * 52, cy + Math.sin(a) * 52, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 11 Justice — scales / balance
function drawJustice(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.55
  // Vertical post
  ctx.beginPath()
  ctx.moveTo(cx, cy - 50)
  ctx.lineTo(cx, cy + 50)
  ctx.stroke()
  // Horizontal beam
  ctx.beginPath()
  ctx.moveTo(cx - 50, cy - 35)
  ctx.lineTo(cx + 50, cy - 35)
  ctx.stroke()
  // Left pan (arc)
  ctx.globalAlpha = 0.45
  ctx.beginPath()
  ctx.arc(cx - 50, cy - 15, 22, 0, Math.PI)
  ctx.stroke()
  // Right pan
  ctx.beginPath()
  ctx.arc(cx + 50, cy - 15, 22, 0, Math.PI)
  ctx.stroke()
  // Chains
  ctx.globalAlpha = 0.3
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - 50, cy - 35)
  ctx.lineTo(cx - 50, cy - 15)
  ctx.moveTo(cx + 50, cy - 35)
  ctx.lineTo(cx + 50, cy - 15)
  ctx.stroke()
  // Base triangle
  ctx.globalAlpha = 0.35
  ctx.beginPath()
  ctx.moveTo(cx - 15, cy + 50)
  ctx.lineTo(cx + 15, cy + 50)
  ctx.lineTo(cx, cy + 35)
  ctx.closePath()
  ctx.stroke()
}

// 12 The Hanged Man — inverted triangle + circle
function drawHangedMan(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.5
  // Inverted triangle
  ctx.beginPath()
  ctx.moveTo(cx, cy + 45)
  ctx.lineTo(cx - 40, cy - 30)
  ctx.lineTo(cx + 40, cy - 30)
  ctx.closePath()
  ctx.stroke()
  // Circle at bottom vertex
  ctx.globalAlpha = 0.45
  ctx.beginPath()
  ctx.arc(cx, cy + 45, 14, 0, Math.PI * 2)
  ctx.stroke()
  // Horizontal bar at top
  ctx.globalAlpha = 0.35
  ctx.beginPath()
  ctx.moveTo(cx - 50, cy - 50)
  ctx.lineTo(cx + 50, cy - 50)
  ctx.stroke()
  // Rope lines
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx, cy - 50)
  ctx.lineTo(cx, cy - 30)
  ctx.stroke()
}

// 13 Death — scythe
function drawDeath(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.55
  // Handle
  ctx.beginPath()
  ctx.moveTo(cx + 25, cy + 55)
  ctx.lineTo(cx - 15, cy - 35)
  ctx.stroke()
  // Blade arc
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.arc(cx - 15, cy - 55, 40, Math.PI * 0.5, Math.PI * 1.1)
  ctx.stroke()
  // Blade tip connection
  ctx.beginPath()
  ctx.moveTo(cx - 15, cy - 35)
  ctx.quadraticCurveTo(cx - 35, cy - 50, cx - 50, cy - 35)
  ctx.stroke()
  // Small rose at base
  ctx.globalAlpha = 0.35
  ctx.beginPath()
  ctx.arc(cx + 25, cy + 58, 6, 0, Math.PI * 2)
  ctx.stroke()
}

// 14 Temperance — two cups with flowing water
function drawTemperance(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.5
  // Left cup
  ctx.beginPath()
  ctx.moveTo(cx - 40, cy - 15)
  ctx.lineTo(cx - 50, cy + 25)
  ctx.lineTo(cx - 20, cy + 25)
  ctx.lineTo(cx - 30, cy - 15)
  ctx.closePath()
  ctx.stroke()
  // Right cup
  ctx.beginPath()
  ctx.moveTo(cx + 30, cy + 5)
  ctx.lineTo(cx + 20, cy + 45)
  ctx.lineTo(cx + 50, cy + 45)
  ctx.lineTo(cx + 40, cy + 5)
  ctx.closePath()
  ctx.stroke()
  // Flowing arc between cups
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(cx - 35, cy - 15)
  ctx.quadraticCurveTo(cx, cy - 30, cx + 35, cy + 5)
  ctx.stroke()
  // Droplets
  ctx.globalAlpha = 0.3
  for (let i = 0; i < 4; i++) {
    const t = 0.2 + i * 0.2
    const px = cx - 35 + t * 70
    const py = cy - 15 + Math.sin(t * Math.PI) * -20 + t * 20
    ctx.beginPath()
    ctx.arc(px, py, 2, 0, Math.PI * 2)
    ctx.fillStyle = GOLD
    ctx.fill()
  }
}

// 15 The Devil — inverted pentagram in circle
function drawDevil(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.8
  // Inverted pentagram (point down): rotate star by PI so one point faces down
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 50 : 20
    // Offset by +PI/2 (instead of -PI/2) to invert
    const a = (Math.PI * i) / 5 + Math.PI / 2
    const x = cx + Math.cos(a) * r
    const y = (cy + 5) + Math.sin(a) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()
  // Outer circle
  ctx.globalAlpha = 0.35
  ctx.beginPath()
  ctx.arc(cx, cy + 5, 55, 0, Math.PI * 2)
  ctx.stroke()
}

// 16 The Tower — tower with lightning crack
function drawTower(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.55
  // Tower body
  ctx.beginPath()
  ctx.moveTo(cx - 18, cy + 55)
  ctx.lineTo(cx - 18, cy - 25)
  ctx.lineTo(cx - 8, cy - 35)
  ctx.lineTo(cx, cy - 55)
  ctx.lineTo(cx + 8, cy - 35)
  ctx.lineTo(cx + 18, cy - 25)
  ctx.lineTo(cx + 18, cy + 55)
  ctx.stroke()
  // Lightning crack through tower
  ctx.globalAlpha = 0.6
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(cx + 30, cy - 50)
  ctx.lineTo(cx + 5, cy - 15)
  ctx.lineTo(cx + 15, cy - 10)
  ctx.lineTo(cx - 5, cy + 20)
  ctx.stroke()
  // Window
  ctx.globalAlpha = 0.35
  ctx.beginPath()
  ctx.arc(cx, cy, 8, 0, Math.PI * 2)
  ctx.stroke()
  // Debris dots
  ctx.globalAlpha = 0.3
  const debris = [[-25, -30], [28, -20], [-20, -5], [25, 10]]
  for (const [dx, dy] of debris) {
    ctx.beginPath()
    ctx.arc(cx + dx, cy + dy, 2, 0, Math.PI * 2)
    ctx.fillStyle = GOLD
    ctx.fill()
  }
}

// 17 The Star — 8-pointed star
function drawStar(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.55
  // Large 8-pointed star
  starPath(ctx, cx, cy, 50, 22, 8)
  ctx.stroke()
  // Inner 8-pointed star (rotated)
  ctx.globalAlpha = 0.35
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(Math.PI / 8)
  ctx.translate(-cx, -cy)
  starPath(ctx, cx, cy, 30, 14, 8)
  ctx.stroke()
  ctx.restore()
  // Center circle
  ctx.globalAlpha = 0.45
  ctx.beginPath()
  ctx.arc(cx, cy, 8, 0, Math.PI * 2)
  ctx.fillStyle = GOLD
  ctx.fill()
}

// 18 The Moon — crescent overlaid on full moon
function drawMoon(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.5
  // Full moon outline
  ctx.beginPath()
  ctx.arc(cx, cy, 42, 0, Math.PI * 2)
  ctx.stroke()
  // Crescent cutout effect (filled darker area)
  ctx.globalAlpha = 0.5
  ctx.fillStyle = GOLD
  ctx.beginPath()
  ctx.arc(cx, cy, 42, Math.PI * 0.65, Math.PI * 1.35, false)
  ctx.arc(cx + 20, cy, 38, Math.PI * 1.35, Math.PI * 0.65, true)
  ctx.closePath()
  ctx.fill()
  // Three phase dots below
  ctx.globalAlpha = 0.4
  const phases = [-30, 0, 30]
  for (const dx of phases) {
    ctx.beginPath()
    ctx.arc(cx + dx, cy + 55, 5, 0, Math.PI * 2)
    ctx.stroke()
  }
}

// 19 The Sun — sun with rays
function drawSun(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.55
  // Sun circle
  ctx.beginPath()
  ctx.arc(cx, cy, 28, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 0.3
  ctx.fillStyle = GOLD
  ctx.fill()
  // 12 straight rays
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1.5
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 32, cy + Math.sin(a) * 32)
    ctx.lineTo(cx + Math.cos(a) * 55, cy + Math.sin(a) * 55)
    ctx.stroke()
  }
  // 12 wavy rays (between straight ones)
  ctx.globalAlpha = 0.3
  ctx.lineWidth = 1
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * (i + 0.5)) / 12
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 32, cy + Math.sin(a) * 32)
    ctx.lineTo(cx + Math.cos(a) * 42, cy + Math.sin(a) * 42)
    ctx.stroke()
  }
  // Center dot
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.arc(cx, cy, 6, 0, Math.PI * 2)
  ctx.fill()
}

// 20 Judgement — trumpet / horn
function drawJudgement(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.55
  // Trumpet body — tapered tube
  ctx.beginPath()
  ctx.moveTo(cx - 35, cy - 5)
  ctx.lineTo(cx + 20, cy - 12)
  ctx.quadraticCurveTo(cx + 45, cy - 14, cx + 50, cy - 25)
  ctx.lineTo(cx + 55, cy + 25)
  ctx.quadraticCurveTo(cx + 45, cy + 14, cx + 20, cy + 12)
  ctx.lineTo(cx - 35, cy + 5)
  ctx.closePath()
  ctx.stroke()
  // Bell flare
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  ctx.arc(cx + 52, cy, 25, Math.PI * 1.35, Math.PI * 0.65)
  ctx.stroke()
  // Sound waves
  ctx.globalAlpha = 0.3
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath()
    ctx.arc(cx + 55 + i * 12, cy, 10 + i * 5, Math.PI * 1.3, Math.PI * 0.7)
    ctx.stroke()
  }
  // Mouthpiece circle
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  ctx.arc(cx - 38, cy, 6, 0, Math.PI * 2)
  ctx.stroke()
}

// 21 The World — laurel wreath + central circle
function drawWorld(ctx: Ctx, cx: number, cy: number) {
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.45
  // Elliptical wreath
  ctx.beginPath()
  ctx.ellipse(cx, cy, 50, 60, 0, 0, Math.PI * 2)
  ctx.stroke()
  // Leaf marks around wreath
  ctx.globalAlpha = 0.3
  for (let i = 0; i < 20; i++) {
    const a = (Math.PI * 2 * i) / 20
    const rx = 50, ry = 60
    const px = cx + Math.cos(a) * rx
    const py = cy + Math.sin(a) * ry
    ctx.beginPath()
    ctx.ellipse(px, py, 6, 3, a + Math.PI / 2, 0, Math.PI * 2)
    ctx.stroke()
  }
  // Center circle
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.arc(cx, cy, 15, 0, Math.PI * 2)
  ctx.stroke()
  // 4 corner symbols (small stars)
  ctx.globalAlpha = 0.35
  const corners: [number, number][] = [[-55, -55], [55, -55], [-55, 55], [55, 55]]
  for (const [dx, dy] of corners) {
    starPath(ctx, cx + dx, cy + dy, 8, 3, 4)
    ctx.fillStyle = GOLD
    ctx.fill()
  }
}

// Dispatch table
const MOTIF_DRAWERS: Array<(ctx: Ctx, cx: number, cy: number) => void> = [
  drawFool, drawMagician, drawHighPriestess, drawEmpress, drawEmperor,
  drawHierophant, drawLovers, drawChariot, drawStrength, drawHermit,
  drawWheel, drawJustice, drawHangedMan, drawDeath, drawTemperance,
  drawDevil, drawTower, drawStar, drawMoon, drawSun,
  drawJudgement, drawWorld,
]

export function drawMotif(ctx: Ctx, cardId: number, cx: number, cy: number) {
  ctx.save()
  const draw = MOTIF_DRAWERS[cardId % MOTIF_DRAWERS.length]
  draw(ctx, cx, cy)
  ctx.restore()
}
