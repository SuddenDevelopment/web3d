import { useFrame, useThree } from "@react-three/fiber";
// @ts-ignore
import { patchShaders } from "gl-noise/build/glNoise.m";
import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import CSM from "three-custom-shader-material";

export function MirrorMaterial({
  renderTexture,
  baseMaterial,
}: {
  renderTexture: THREE.WebGLRenderTarget;
  baseMaterial: any;
}) {
  const vertexShader = useMemo(
    () => /* glsl */ `
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vViewVector;
        varying vec3 vCameraPosition;

        void main() {
          vUv = uv;
          vPosition = position;

          vec3 _worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          vViewVector = cameraPosition - _worldPosition;
          vCameraPosition = cameraPosition;
        }
    `,
    []
  );

  const fragmentShader = useMemo(
    () =>
      patchShaders(/* glsl */ `
        #define MAX_RADIUS 3
        #define DOUBLE_HASH 0
        #define HASHSCALE1 .1031
        #define HASHSCALE3 vec3(.1031, .1030, .0973)

        uniform sampler2D uRenderTexture;
        uniform sampler2D uDepthTexture;
        uniform vec2 uCameraNearFar;
        uniform vec2 uResolution;
        uniform float uTime;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vViewVector;
        varying vec3 vCameraPosition;

        vec3 csm_PuddleNormal;
        float csm_PuddleNormalMask;

        float getDepth(vec2 screenPosition) {
          return texture2D( uDepthTexture, screenPosition ).x;
        }

        float getViewZ(float depth) {
          return perspectiveDepthToViewZ(depth, uCameraNearFar.x, uCameraNearFar.y);
        }

        vec3 getWorldSpacePosition(vec2 uv) {
          vec3 viewVector = -vViewVector;
          float screenPositionZ = getViewZ(gl_FragCoord.z);
          float sceneDepthZ = getViewZ(getDepth(uv));

          viewVector = viewVector / screenPositionZ;
          viewVector = viewVector * sceneDepthZ;
          viewVector = viewVector + vCameraPosition;

          return viewVector;
        }
            
        float mapLinear(float x, float a1, float a2, float b1, float b2) {
            return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
        }

        float hash12(vec2 p) {
            vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
            p3 += dot(p3, p3.yzx + 19.19);
            return fract((p3.x + p3.y) * p3.z);
        }

        vec2 hash22(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
            p3 += dot(p3, p3.yzx+19.19);
            return fract((p3.xx+p3.yz)*p3.zy);
        }

        vec3 getRipples(vec2 uv) {
            vec2 p0 = floor(uv);

            float time = uTime * 2.0;

            vec2 circles = vec2(0.);
            for (int j = -MAX_RADIUS; j <= MAX_RADIUS; ++j) {
                for (int i = -MAX_RADIUS; i <= MAX_RADIUS; ++i) {
                vec2 pi = p0 + vec2(i, j);
                #if DOUBLE_HASH
                vec2 hsh = hash22(pi);
                #else
                vec2 hsh = pi;
                #endif
                vec2 p = pi + hash22(hsh);

                float t = fract(0.3*time + hash12(hsh));
                vec2 v = p - uv;
                float d = length(v) - (float(MAX_RADIUS) + 1.)*t;

                float h = 1e-3;
                float d1 = d - h;
                float d2 = d + h;
                float p1 = sin(31.*d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);
                float p2 = sin(31.*d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);
                circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));
                }
            }
            circles /= float((MAX_RADIUS*2+1)*(MAX_RADIUS*2+1));
            float intensity = mix(0.01, 0.15, smoothstep(0.1, 0.6, abs(fract(0.05*time + 0.5)*2.-1.)));
            vec3 n = vec3(circles, 0.0);
            return n;
        }


        float getPuddle(vec2 uv) {
            gln_tFBMOpts puddleNoiseOpts = gln_tFBMOpts(1.0, 0.5, 2.0, 0.5, 1.0, 3, false, false);
            float puddleNoise = gln_sfbm((uv + vec2(3.0, 0.0)) * 0.2, puddleNoiseOpts);
            puddleNoise = gln_normalize(puddleNoise);
            puddleNoise = smoothstep(0.0, 0.7, puddleNoise);
            return puddleNoise;
        }

        vec3 perturbNormal(vec3 inputNormal, vec3 noiseNormal, float strength) {
            vec3 noiseNormalOrthogonal = noiseNormal - (dot(noiseNormal, inputNormal) * inputNormal);
            vec3 noiseNormalProjectedBump = mat3(csm_internal_vModelViewMatrix) * noiseNormalOrthogonal;
            return normalize(inputNormal - (noiseNormalProjectedBump * strength));
        }

        float getFresnel(float power) {
          vec3 normal = vNormal;
          vec3 viewDir = normalize(vViewPosition);

          return pow((1.0 - saturate(dot(normalize(normal), normalize(viewDir)))), power);
        }

        vec3 blendLinearDodge(vec3 base, vec3 blend) {
          return base + blend;
        }

        vec3 rgbToHsv(vec3 c) {
          vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

          float d = q.x - min(q.w, q.y);
          float e = 1.0e-10;
          return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }

        vec3 hsvToRgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        void main() {
          vec2 screenUV = gl_FragCoord.xy / uResolution;
          vec2 worldUV = vPosition.xz;
          worldUV.x += 0.5;
          worldUV.y += 0.5;

          // Puddle
          float puddleMask = getPuddle(worldUV * 4.0);
          float smoothStepPuddleMask = smoothstep(0.7, 1.0, puddleMask);

          // Roughness
          float roughness = smoothstep(0.25, 1.0, 1.0 - smoothStepPuddleMask);
          roughness = clamp(roughness, 0.0, 0.15);
          csm_Roughness = roughness;

          // Normals 
          // Make puddles smooth
          csm_PuddleNormal = vNormal;
          csm_PuddleNormalMask = smoothstep(0.6, 1.0, puddleMask);

          // Add ripples
          vec3 rippleNormals = getRipples(worldUV * 8.0);
          csm_PuddleNormal = perturbNormal(csm_PuddleNormal, rippleNormals, 0.75);

          // Add wind noise
          gln_tFBMOpts noiseNormalNoiseOpts = gln_tFBMOpts(1.0, 0.5, 2.0, 0.5, 1.0, 4, false, false);
          vec3 noiseNormalPosition = vPosition * 40.0;
          noiseNormalPosition.y += uTime * 5.0;
          float windNoiseX = gln_sfbm(noiseNormalPosition, noiseNormalNoiseOpts);
          float windNoiseY = gln_sfbm(noiseNormalPosition + 0.5, noiseNormalNoiseOpts);
          float windNoiseZ = gln_sfbm(noiseNormalPosition + 1.0, noiseNormalNoiseOpts);
          vec3 windNormal = vec3(windNoiseX, windNoiseY, windNoiseZ);
          csm_PuddleNormal = perturbNormal(csm_PuddleNormal, windNormal, 0.05);

          // Color
          // Darken puddles
          vec3 puddleColor = vec3(0.5);
          puddleColor = mix(csm_DiffuseColor.rgb, csm_DiffuseColor.rgb * puddleColor, smoothStepPuddleMask);
          csm_DiffuseColor.rgb = puddleColor;

          // Reflection
          vec2 reflectionUV = screenUV;
          reflectionUV.y = 1.0 - reflectionUV.y;
          reflectionUV += rippleNormals.xy * 0.025;

          vec3 reflectionColor = texture2D(uRenderTexture, reflectionUV).rgb;
          vec3 reflectionColorHsv = rgbToHsv(reflectionColor);
          reflectionColorHsv.b *= 2.0;
          reflectionColor = hsvToRgb(reflectionColorHsv);
          
          vec3 worldSpacePosition = getWorldSpacePosition(reflectionUV);
          float worldSpaceHeight = mapLinear(1.0 - -worldSpacePosition.y, -3.0, 1.0, 0.0, 1.0);
          worldSpaceHeight = clamp(worldSpaceHeight, 0.0, 1.0);
          worldSpaceHeight = smoothstep(0.2, 1.0, worldSpaceHeight);

          float fresnel = getFresnel(1.0);
          float reflectionLowerBound = mapLinear(fresnel, 0.0, 1.0, 0.0, 0.2);

          float reflectionPuddleMask = clamp(smoothStepPuddleMask, reflectionLowerBound, 1.0);
          vec3 fadedReflectionColor = reflectionColor * worldSpaceHeight * reflectionPuddleMask;
          fadedReflectionColor = clamp(fadedReflectionColor, 0.0, 1.0);

          csm_DiffuseColor.rgb = csm_DiffuseColor.rgb + fadedReflectionColor;

          // csm_FragColor.rgb = vec3(worldSpaceHeight);
        }
    `),
    []
  );

  const patchMap = useMemo(
    () => ({
      "*": {
        "#include <normal_fragment_maps>": `
				#include <normal_fragment_maps>
				normal = mix(normal, csm_PuddleNormal, csm_PuddleNormalMask);
			`,
      },
    }),
    []
  );

  const uniforms = useMemo(
    () => ({
      uRenderTexture: { value: null! as THREE.Texture },
      uDepthTexture: { value: null! as THREE.Texture },
      uResolution: { value: new THREE.Vector2() },
      uCameraNearFar: { value: new THREE.Vector2() },
      uTime: { value: 0 },
    }),
    []
  );

  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
    uniforms.uRenderTexture.value = renderTexture.texture;
    uniforms.uDepthTexture.value = renderTexture.depthTexture;
    uniforms.uCameraNearFar.value.set(camera.near, camera.far);
  }, [renderTexture, size, viewport, camera]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <CSM<typeof THREE.MeshStandardMaterial>
      baseMaterial={baseMaterial}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      patchMap={patchMap}
      uniforms={uniforms}
      metalness={0.5}
    />
  );
}
