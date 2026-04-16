import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

export default function StarsCanvas() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 1], fov: 75 }}
      gl={{ alpha: false }}
    >
      <color attach="background" args={['#0a0020']} />
      <Stars
        radius={80}
        depth={60}
        count={6000}
        factor={5}
        fade
        speed={0.8}
      />
    </Canvas>
  )
}
