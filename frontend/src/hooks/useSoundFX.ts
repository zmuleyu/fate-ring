import { useCallback, useRef } from 'react'

export function useSoundFX() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  /** Short ascending two-note chime on card selection */
  const playSelect = useCallback(() => {
    try {
      const ctx  = getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, ctx.currentTime)       // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.18) // G5
      gain.gain.setValueAtTime(0.22, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.45)
    } catch { /* ignore AudioContext errors */ }
  }, [getCtx])

  /** Descending whoosh on selection reset */
  const playReset = useCallback(() => {
    try {
      const ctx  = getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.45)
      gain.gain.setValueAtTime(0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.55)
    } catch { /* ignore */ }
  }, [getCtx])

  /** Rising arpeggio (C–E–G–C) on fate reveal */
  const playReveal = useCallback(() => {
    try {
      const ctx   = getCtx()
      const freqs = [261.63, 329.63, 392.0, 523.25] // C4 E4 G4 C5
      freqs.forEach((freq, i) => {
        const osc  = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        const t = ctx.currentTime + i * 0.16
        gain.gain.setValueAtTime(0.2, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65)
        osc.start(t)
        osc.stop(t + 0.65)
      })
    } catch { /* ignore */ }
  }, [getCtx])

  return { playSelect, playReset, playReveal }
}
