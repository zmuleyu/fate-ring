import { useEffect, useRef, useState, useCallback } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

/** Discrete gestures (pinch / open only — swipe replaced by continuous wristX) */
export type GestureType = 'pinch' | 'open' | null

export interface HandGestureState {
  gesture: GestureType
  /** Mirrored wrist X, 0=left 1=right (null when no hand detected) */
  wristX: number | null
  isHandDetected: boolean
  landmarks: { x: number; y: number; z: number }[][]
  cameraReady: boolean
  cameraError: string | null
  isEnabled: boolean
  enable: () => void
  disable: () => void
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

// Landmark indices
const WRIST = 0
const THUMB_TIP = 4
const INDEX_TIP = 8
const MIDDLE_TIP = 12
const RING_TIP = 16
const PINKY_TIP = 20
const INDEX_MCP = 5
const MIDDLE_MCP = 9
const RING_MCP = 13
const PINKY_MCP = 17

const PINCH_THRESHOLD = 0.07
const OPEN_THRESHOLD  = 0.08
const GESTURE_COOLDOWN = 700  // ms

function dist2d(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}
function fingerUp(tip: { y: number }, mcp: { y: number }) {
  return tip.y < mcp.y - OPEN_THRESHOLD
}

export function useHandGesture(): HandGestureState {
  const videoRef  = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const rafRef    = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastGestureTime = useRef<Record<string, number>>({})

  const [isEnabled, setIsEnabled]       = useState(false)
  const [cameraReady, setCameraReady]   = useState(false)
  const [cameraError, setCameraError]   = useState<string | null>(null)
  const [gesture, setGesture]           = useState<GestureType>(null)
  const [wristX, setWristX]             = useState<number | null>(null)
  const [isHandDetected, setIsHandDetected] = useState(false)
  const [landmarks, setLandmarks]       = useState<{ x: number; y: number; z: number }[][]>([])

  const fireGesture = useCallback((g: GestureType) => {
    if (!g) return
    const now = Date.now()
    if (now - (lastGestureTime.current[g] ?? 0) < GESTURE_COOLDOWN) return
    lastGestureTime.current[g] = now
    setGesture(g)
    setTimeout(() => setGesture(null), 350)
  }, [])

  const processHand = useCallback((lms: { x: number; y: number; z: number }[]) => {
    const thumbTip  = lms[THUMB_TIP]
    const indexTip  = lms[INDEX_TIP]
    const middleTip = lms[MIDDLE_TIP]
    const ringTip   = lms[RING_TIP]
    const pinkyTip  = lms[PINKY_TIP]
    const indexMcp  = lms[INDEX_MCP]
    const middleMcp = lms[MIDDLE_MCP]
    const ringMcp   = lms[RING_MCP]
    const pinkyMcp  = lms[PINKY_MCP]

    // Pinch: thumb+index tip close
    if (dist2d(thumbTip, indexTip) < PINCH_THRESHOLD) {
      fireGesture('pinch')
      return
    }

    // Open hand: all 4 fingers extended
    if (
      fingerUp(indexTip,  indexMcp)  &&
      fingerUp(middleTip, middleMcp) &&
      fingerUp(ringTip,   ringMcp)   &&
      fingerUp(pinkyTip,  pinkyMcp)
    ) {
      fireGesture('open')
    }

    // Continuous wrist tracking — mirror x so right=right for user
    setWristX(1 - lms[WRIST].x)
  }, [fireGesture])

  const startDetectionLoop = useCallback(() => {
    const landmarker = landmarkerRef.current
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!landmarker || !video || !canvas) return

    const ctx = canvas.getContext('2d')!

    const CONNECTIONS: [number, number][] = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17],
    ]

    const loop = () => {
      try {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          rafRef.current = requestAnimationFrame(loop)
          return
        }

        const result = landmarker.detectForVideo(video, performance.now())
        canvas.width  = video.videoWidth
        canvas.height = video.videoHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const allLandmarks: { x: number; y: number; z: number }[][] = []
        const handDetected = result.landmarks.length > 0

        for (const hand of result.landmarks) {
          allLandmarks.push(hand)
          processHand(hand)

          // Draw skeleton
          ctx.strokeStyle = 'rgba(212,175,55,0.85)'
          ctx.lineWidth = 2
          for (const [a, b] of CONNECTIONS) {
            ctx.beginPath()
            ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height)
            ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height)
            ctx.stroke()
          }
          // Draw joints
          for (const lm of hand) {
            ctx.beginPath()
            ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 3, 0, Math.PI * 2)
            ctx.fillStyle = '#d4af37'
            ctx.fill()
          }
        }

        if (!handDetected) setWristX(null)
        setIsHandDetected(handDetected)
        setLandmarks(allLandmarks)
      } catch {
        // One bad frame shouldn't kill the detection loop
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
  }, [processHand])

  const enable = useCallback(async () => {
    setCameraError(null)
    setIsEnabled(true)
    try {
      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        })
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadeddata = () => {
          if (!videoRef.current) return
          videoRef.current.play()
          setCameraReady(true)
          startDetectionLoop()
        }
      }
    } catch (err) {
      setCameraError(err instanceof Error ? err.message : 'Camera unavailable')
      setIsEnabled(false)
    }
  }, [startDetectionLoop])

  const disable = useCallback(() => {
    setIsEnabled(false)
    setCameraReady(false)
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setWristX(null)
    setIsHandDetected(false)
    setLandmarks([])
    setGesture(null)
  }, [])

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  return {
    gesture, wristX, isHandDetected,
    landmarks, cameraReady, cameraError,
    isEnabled, enable, disable,
    videoRef, canvasRef,
  }
}
