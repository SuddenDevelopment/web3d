import React, {useEffect, useState, useImperativeHandle, forwardRef, useUpdate} from 'react';
// https://www.npmjs.com/package/fastnoise-lite
import FastNoiseLite from "fastnoise-lite";
import { Vector3, MathUtils } from 'three';
/* 
TODO:
- optional plane from noiseMap, apply material to it

*/
/*
noiseMap={[
        { noiseMin: 0, noiseMax: 0.5, probability: 0.5, meshComponent: Box, rotation: [0,0,0]},
        { noiseMin: 0.5, noiseMax: 1, probability: 1, meshComponent: Sphere, scale: 0.5, noiseHeight:1 }
      ]}
*/

const GridGen = forwardRef(({
  noiseMap, 
  newRange = { x:[0,100], y:[0,100], z:[0,100]},
  groundPlane = false,
  noiseSettings = {
    NoiseType: FastNoiseLite.NoiseType.Perlin, 
    Seed: 0, 
    Frequency: 0.01
  }}, ref) => {
  const noise = new FastNoiseLite();
  
  const setNoise = () => {
    //apply all of the noise settings given
    for (const strSetting of Object.keys(noiseSettings)) {
      const methodName = `Set${strSetting}`;
      if (typeof noise[methodName] === 'function') {
        noise[methodName](noiseSettings[strSetting]);
      } else {
        console.warn(`No method ${methodName} on noise object`);
      }
    }
  }
  const testProbability=function(fltProbabiltiy) {
    return Math.random() <= fltProbabiltiy;
  }
  const degreesToRadians=function(degrees) {
    return degrees * (Math.PI / 180);
  }
  const getRotation=function(intRotate) {
    if (intRotate === 0) return 0;
    const intRotateMax = 360/intRotate;
    const intRandom = Math.floor(Math.random() * intRotateMax);
    return degreesToRadians(intRandom * intRotate);
  }
  const getScale=function(fltScale) {
    if (!fltScale) return 1;
    // get a random number between 1-fltscale and 1+fltscale
    const fltRandom = Math.random() * fltScale;
    return 1-fltRandom;
  }

  const addRange = function(objRange){
    //{ x:[0,100], y:[0,100], z:[0,100]}
    setInstances(prevInstances => [...prevInstances, ...getInstances(objRange)]);
  }

  const removeRange = function(objRange){
    //{ x:[0,100], y:[0,100], z:[0,100]}
    setInstances(prevInstances => prevInstances.filter((instance) => {
      return !(
        instance.position.x >= objRange.x[0] && instance.position.x <= objRange.x[1] &&
        instance.position.y >= objRange.y[0] && instance.position.y <= objRange.y[1] &&
        instance.position.z >= objRange.z[0] && instance.position.z <= objRange.z[1]
      );
    }));
  }

  const getInstances = (objRange) => {
    let arrNewInstances = [];
    for (let x = objRange['x'][0]; x < objRange['x'][1]; x++) {
      for (let z = objRange['z'][0]; z < objRange['z'][1]; z++) {
        //const height = noiseData[i * 100 + j];
        const noiseValue = noise.GetNoise(x*10, z*10);
        for (const range of noiseMap) {
          if (range.probability && !testProbability(range.probability)) {
            continue;
          }
          const intNoiseHeight = range.noiseHeight ? range.noiseHeight : 10;
          if (noiseValue >= range.noiseMin && noiseValue <= range.noiseMax) {
            if(!range.rotation) range.rotation = 0;
            const uuid = MathUtils.generateUUID();
            arrNewInstances.push({
              id: uuid,
              meshComponent: range.meshComponent, 
              position: new Vector3(x, noiseValue * intNoiseHeight, z ),
              rotation: [0,getRotation(range.rotation),0],
              scale: getScale(range.scale)
            });
          }
        }
      }
    }
    return arrNewInstances;
  }
GridGen.displayName = 'GridGen';
   
  const [arrInstances,setInstances] = useState([]);

  useEffect(() => {
    // update the instances map anytime the inputs change
    // it can be used to create the first instances then update the genRange to add new instances
    setNoise();
    setInstances(prevInstances => [...prevInstances, ...getInstances(newRange)]);
  },[]);
  useImperativeHandle(ref, () => ({
    addRange, removeRange, noise
  }));
  return (
    <>
      {arrInstances.map((instance) => {
        const MeshComponent = instance.meshComponent;
        return (
          <>
          <MeshComponent 
            key={instance.id} 
            position={instance.position} 
            rotation={instance.rotation} 
            scale={[instance.scale,instance.scale,instance.scale]}/>
          </>
        );
      })}
    </>
  );
});
export default GridGen;