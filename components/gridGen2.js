import React, {useEffect, useState, useImperativeHandle, forwardRef, useUpdate, useMemo, use} from 'react';
// https://www.npmjs.com/package/fastnoise-lite
import FastNoiseLite from "fastnoise-lite";
import * as THREE from 'three';
/*
noiseMap={[
        { noiseMin: 0, noiseMax: 0.5, probability: 0.5, geometry: Box, rotation: [0,0,0]},
        { noiseMin: 0.5, noiseMax: 1, probability: 1, geometry: Sphere, scale: 0.5, noiseHeight:1 }
      ]}
*/
/*
meshes
  instances

features / functions
    add({x:[0,100], y:[0,100], z:[0,100]})
    remove({x:[0,100], y:[0,100], z:[0,100]},index)
    *using a move is cheaper than a remove and add
    move({x:[0,100], y:[0,100], z:[0,100]}, {x:[0,100], y:[0,100], z:[0,100]})
    setNoise(objNoiseConfig)
    getNoise({x:[0,100], y:[0,100], z:[0,100]})
    setInstance(index,objInstanceConfig)
    getInstances({x:[0,100], y:[0,100], z:[0,100]})
    lerpNoise(objNoiseConfig,frames)

meshes
    geometry
    material
    noiseMin
    noiseMax
    probability
    noiseHeight
    scaleType: "none" | "random" | "function" | noise
    scale
    rotationType: "none" | "random" | "increments" | "function" | noise
    rotation
    positionType: "grid" | "random" | "offset" | "function" | noise
    position

mesh instances for the matrix
    position
    rotation
    scale
    color
*/
export default function GridGen({
  noiseMap,
  newRange = { x:[0,100], y:[0,100], z:[0,100]}
}) {
  const noise = new FastNoiseLite();
  const arrMeshes = useMemo(() => {
    const arrMeshes = [];
    const tmpMatrix = new THREE.Matrix4()
    //init the meshes array
    for( let i=0; i<noiseMap.length; i++){
      const objMesh = {
        ...noiseMap[i],
        count: 0,
        positions: []
      };
      arrMeshes.push(objMesh);
    }
    //go through the grid + noiseMap and populate the meshes array
    for (let x = newRange['x'][0]; x < newRange['x'][1]; x++) {
      for (let z = newRange['z'][0]; z < newRange['z'][1]; z++) {
        const noiseValue = noise.GetNoise(x*10, z*10);
        for( let i=0; i<noiseMap.length; i++){
          const range = noiseMap[i];
          const intNoiseHeight = range.noiseHeight ? range.noiseHeight : 10;
          if (noiseValue >= range.noiseMin && noiseValue <= range.noiseMax) {
            if(!range.rotation) range.rotation = 0;
            let objMesh = arrMeshes[i];
            tmpMatrix.makeTranslation(x, noiseValue * intNoiseHeight, z);
            objMesh.positions.splice(objMesh.count * 16, tmpMatrix.elements.length, ...tmpMatrix.elements);
            objMesh.count++;
          }
        }
      }
    }
    console.log(arrMeshes);
    return arrMeshes;
  },[noiseMap]);
    return (
        <>
          { arrMeshes.map((objMesh) => {
            <instancedMesh args={[objMesh.geometry, objMesh.material, objMesh.count]}>
              <instancedBufferAttribute 
                attach="instanceMatrix" 
                count={objMesh.count} 
                array={objMesh.positions} itemSize={16} />
            </instancedMesh>
          })}
        </>
      )
};