import React from 'react';
//import { generatePerlinNoise } from 'perlin-noise';
// https://www.npmjs.com/package/fastnoise-lite
import FastNoiseLite from "fastnoise-lite";
import { BoxGeometry, SphereGeometry, Vector3, MathUtils } from 'three';
import { Merged } from '@react-three/drei';


/* noiseMap = [{noiseMin,noiseMax,meshComponent. meshProps}]
noiseMap={[
        { noiseMin: 0, noiseMax: 0.5, meshComponent: Box, meshProps: { args: [1, 1, 1] },
        { noiseMin: 0.5, noiseMax: 1, meshComponent: Sphere, meshGeometry: sphere, noiseHeight: 1, meshProps: { args: [1, 16, 16]},
      ]}
      */
export default function GridGen({ noiseMap }) {
  //const noiseData = generatePerlinNoise(100, 100);
  let noise = new FastNoiseLite();
  noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
  const instancePositions = [];
  const instanceComponents = [];

  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      //const height = noiseData[i * 100 + j];
      const noiseValue = noise.GetNoise(i*10, j*10);
      for (const range of noiseMap) {
        const intNoiseHeight = range.noiseHeight ? range.noiseHeight : 10;
        if (noiseValue >= range.noiseMin && noiseValue <= range.noiseMax) {
          instancePositions.push(new Vector3(i, noiseValue * intNoiseHeight, j ));
          instanceComponents.push(range.meshComponent);
          break;
        }
      }
    }
  }

  return (
    <>
      {instancePositions.map((position, index) => {
        const uuid = MathUtils.generateUUID();
        const MeshComponent = instanceComponents[index];
        return (
          <MeshComponent key={index} position={position} uuid={uuid}/>
        );
      })}
    </>
  );
};