import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Bvh, CameraControls, OrthographicCamera } from '@react-three/drei'
//import { Overlay } from './components/Overlay'
import React, { useMemo, useRef } from 'react'

export function Model(props) {
  const instanceCount = 1000
  const INSTANCE_COUNT = Math.pow(Math.ceil(Math.sqrt(instanceCount)), 2)
  const instanceData = useMemo(() => {
    const matrices = new Float32Array(INSTANCE_COUNT * 16)
    const colors = new Float32Array(INSTANCE_COUNT * 3)

    const gridSize = Math.sqrt(INSTANCE_COUNT)
    const spacing = 0.2

    const dummyMatrix = new THREE.Matrix4()
    const dummyColor = new THREE.Color()
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const x = (i % gridSize) * spacing - (gridSize * spacing) / 2
      const y = Math.floor(i / gridSize) * spacing - (gridSize * spacing) / 2
      const z = 0

      dummyMatrix.makeTranslation(x, y, z)
      matrices.set(dummyMatrix.elements, i * 16)

      dummyColor.set(`hsl(${Math.random() * 200}, 10%, 50%)`)
      colors.set([dummyColor.r, dummyColor.g, dummyColor.b], i * 3)
    }
    return { matrices, colors }
  }, [])

  return (
    <>
      <instancedMesh args={[null, null, INSTANCE_COUNT]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <instancedBufferAttribute attach="instanceMatrix" count={instanceData.matrices.length / 16} array={instanceData.matrices} itemSize={16} />
        <instancedBufferAttribute attach="instanceColor" count={instanceData.colors.length / 3} array={instanceData.colors} itemSize={3} />
        <meshMatcapMaterial />
      </instancedMesh>

      <CameraControls />
      <OrthographicCamera makeDefault position={[100, 60, 100]} zoom={100} />
    </>
  )
}