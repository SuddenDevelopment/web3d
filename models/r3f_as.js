/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 /Users/anthonyaragues/Documents/lab/web3d/public/models/r3f_as.glb -o /Users/anthonyaragues/Documents/lab/web3d/models/r3f_as.js -p 3 -i -s 
Files: /Users/anthonyaragues/Documents/lab/web3d/public/models/r3f_as.glb [974.18KB] > r3f_as-transformed.glb [106.72KB] (89%)
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('models/r3f_as-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry} material={materials.TexturesCom_BuildingsHighRise0628_2_seamless_S} position={[-18.32, -6.551, -12.665]} scale={[19.07, 0.482, 25.795]} />
      <mesh castShadow receiveShadow geometry={nodes.Object_5.geometry} material={materials['TexturesCom_BuildingsHighRise0628_2_seamless_S.001']} position={[-18.32, -6.551, -12.665]} scale={[19.07, 0.482, 25.795]} />
    </group>
  )
}

useGLTF.preload('models/r3f_as-transformed.glb')
