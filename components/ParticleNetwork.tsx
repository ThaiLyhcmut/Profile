"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const count = 1000

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50

      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }

    return { positions, velocities }
  }, [count])

  useFrame((state) => {
    if (!ref.current) return

    const time = state.clock.getElapsedTime()
    ref.current.rotation.x = time * 0.05
    ref.current.rotation.y = time * 0.075

    const positions = ref.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Flowing motion
      positions[i3] += particles.velocities[i3]
      positions[i3 + 1] += particles.velocities[i3 + 1]
      positions[i3 + 2] += particles.velocities[i3 + 2]

      // Boundary wrapping
      if (Math.abs(positions[i3]) > 25) particles.velocities[i3] *= -1
      if (Math.abs(positions[i3 + 1]) > 25) particles.velocities[i3 + 1] *= -1
      if (Math.abs(positions[i3 + 2]) > 25) particles.velocities[i3 + 2] *= -1
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={ref} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4aa"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null!)
  const count = 50

  const lines = useMemo(() => {
    const positions = new Float32Array(count * 6) // 2 points per line

    for (let i = 0; i < count; i++) {
      // Start point
      positions[i * 6] = (Math.random() - 0.5) * 40
      positions[i * 6 + 1] = (Math.random() - 0.5) * 40
      positions[i * 6 + 2] = (Math.random() - 0.5) * 40

      // End point
      positions[i * 6 + 3] = (Math.random() - 0.5) * 40
      positions[i * 6 + 4] = (Math.random() - 0.5) * 40
      positions[i * 6 + 5] = (Math.random() - 0.5) * 40
    }

    return positions
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.getElapsedTime()
    ref.current.rotation.y = time * 0.03
  })

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count * 2}
          array={lines}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#00d4aa"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

export default function ParticleNetwork() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField />
        <ConnectionLines />
      </Canvas>
    </div>
  )
}
