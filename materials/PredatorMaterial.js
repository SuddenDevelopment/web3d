import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CSM from 'three-custom-shader-material'
import { easing } from 'maath'
// SOURCE + CREDIT = https://bit.ly/3Z0viKh https://andersonmancini.dev/
export default function PredatorCloakMaterial({ originalMaterial, gridWidth, gridHeight, iridescence, color, hover }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0.0 },
      gridWidth: { value: gridWidth },
      gridHeight: { value: gridHeight }
    }),
    [gridHeight, gridWidth]
  )
  const Vert = ` 
    varying vec2 vUv;
    varying vec3 csm_vPosition;
    
    void main() {
      vUv = uv;
      csm_vPosition = position;
    }
    `;
  const frag = ` 
  // based on: https://www.shadertoy.com/view/wlKfzc
  
  float fadeTimer = 0.0;
  uniform float gridWidth;
  uniform float gridHeight;
  uniform float uTime;
  uniform float uProgress;
  varying vec3 csm_vPosition;
  varying vec2 vUv;
  
                
  void main() {
  
    fadeTimer = 1.3 * uProgress;
  
    vec4 outcol;
    
    vec2 posI =  vec2(vUv.x * gridWidth * 3.0, vUv.y * gridHeight * 3.0);
    
    vec2 finalPos = mod(posI,2.) - vec2(1.0,2.0);
    float size;
    
    posI = vec2(floor(posI.x/2.0)/gridWidth,floor(posI.y/2.0)/gridHeight);
    
    size = clamp(pow(fadeTimer + posI.y ,3.5), 0.0, 20.5);
  
    size = abs(size * uProgress);
    
    outcol = csm_DiffuseColor;
    
    if(abs(finalPos.x + 0.25) + abs(finalPos.y ) < size){
        outcol =  vec4(0.9);
        csm_Roughness =  max(pow(sin(uProgress * 15. + uTime * 2.0 + dot(vNormal.y, 10.5 )), 2.), .6);
        csm_Metalness = 0.003;
    }
  
    vec4 finalColor = mix(csm_DiffuseColor, outcol , 1.0);
    csm_DiffuseColor = vec4(finalColor.rgb, 1.0);
  }
  
  `;

  const baseMaterialCustom = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: color ? new THREE.Color(color) : null,
      map: originalMaterial ? originalMaterial.map : null,
      roughness: 0.4,
      metalness: 0.4,
      normalMap: originalMaterial ? originalMaterial.normalMap : null,
      normalScale: new THREE.Vector2(0.9, -0.5),
      ior: 1.1,
      thickness: 1.9,
      transmission: 1,
      iridescence: iridescence ? iridescence : null
    })
  }, [])

  useFrame((state, dt) => {
    uniforms.uTime.value += dt
    easing.damp(uniforms.uProgress, 'value', hover ? 1.0 : 0.0, 1.2, dt)
  })

  return <CSM baseMaterial={baseMaterialCustom} uniforms={uniforms} vertexShader={Vert} fragmentShader={frag} silent envMapIntensity={6} />
}
