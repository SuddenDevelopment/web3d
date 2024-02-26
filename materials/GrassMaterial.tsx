import { useFrame } from "@react-three/fiber";
// @ts-ignore
import { patchShaders } from "gl-noise/build/glNoise.m";
import { useMemo } from "react";
import * as THREE from "three";
import CSM from "three-custom-shader-material";

export function GrassMaterial({ baseMaterial }: { baseMaterial: any }) {
  const vertexShader = useMemo(
    () =>
      patchShaders(/* glsl */ `
        varying vec3 vInstancedPosition;
        varying vec2 vUv;

        uniform float uTime;

        void main() {
          vUv = uv;

          vec3 pos = position;
          vec4 instancedPosition = instanceMatrix * vec4(vec3(pos.x, pos.y, 0.0), 1.0);
          vInstancedPosition = instancedPosition.xyz;

          float time = uTime * 0.5;

          vec2 noise = vec2(
            gln_perlin(instancedPosition.xyz * 0.1 + time * 0.5 * 0.1),
            gln_simplex(instancedPosition.xyz * 0.1 + time * 0.5 * 0.1)
          );
        
          noise = smoothstep(-1.0, 1.0, noise);
          float swingX = sin(time * 2.0 + noise.x * 2.0 * PI) * pow(pos.z, 2.0);
          float swingY = cos(time * 2.0 + noise.y * 2.0 * PI) * pow(pos.z, 2.0);
        

          pos.x += swingX;
          pos.z += swingY;

          float gradient = smoothstep(-0.2, 0.8, uv.y);
          csm_Position = mix(position, pos, gradient);
        }
    `),
    []
  );

  const fragmentShader = useMemo(
    () =>
      patchShaders(/* glsl */ `
        uniform vec3 uColorB;

        varying vec3 vInstancedPosition;
        varying vec2 vUv;

        void main() {
          float noise = gln_perlin(vInstancedPosition.xyz * 10.0);
          noise = gln_normalize(noise);
          csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, uColorB, noise);
        
          float gradient = smoothstep(-0.2, 1.5, vUv.y);
          csm_DiffuseColor.rgb *= gradient;
        }
    `),
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorB: { value: new THREE.Color("#e2c966") },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <CSM<typeof THREE.MeshStandardMaterial>
      baseMaterial={baseMaterial}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      roughness={0.2}
    />
  );
}
