import React, { lazy, useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, PerspectiveCamera, Stats, useGLTF, Instances } from '@react-three/drei';
import  GridGen  from '../components/gridGen.js';
import {Tree1, Tree2} from '../models/r3f_trees.js';
import {TestObject} from "../models/r3f_cylinder.js";
//import { GridGen } from 'react-three-generator';
import '../app/global.css';
//import { BoxGeometry, SphereGeometry } from 'three';
const degreesToRadians=function(degrees) {
  return degrees * (Math.PI / 180);
}
const Scene = function(props){
  const gridRef = useRef();
  const cameraRef = useRef();
  
    // Define a state to control camera position
    const initialPosition = { x: 50, y: 5, z: 0 };
    const speed = 0.05;
    const [position, setPosition] = React.useState(initialPosition);
    const [zRow, setZRow] = React.useState(100);
    // Move the camera forward slowly
    useFrame(() => {
      setPosition(prev => ({
        x: prev.x,
        y: prev.y,
        z: prev.z + speed
      }));
      //for every unit of travel, add a row to the grid on z/depth axis
      if (zRow < position.z+100) {
        gridRef.current.addRange({ x:[0,100], y:[0,100], z:[zRow, Math.floor(position.z+100)]});
        gridRef.current.removeRange({ x:[0,100], y:[0,100], z:[position.z-100,position.z-1]});
        setZRow(Math.floor(position.z+100));
      }
    });
  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[position.x, position.y, position.z]} rotation={[0,degreesToRadians(180),0]} />
      <pointLight position={[10, 10, 10]} />
      <GridGen
          ref={gridRef}
          noiseMap={[
              { noiseMin: 0, noiseMax: 0.5, probability:0.75, meshComponent: Tree1, rotation: 2  },
              { noiseMin: 0.5, noiseMax: 1, probability:0.5, meshComponent: Tree2, scale: 0.5 },
          ]}
          />
    </>
  );
}

export default function R3fScene() {
  
  return (
        <Canvas style={{height:'100%',width:'100%'}}>
            <Stats/>
            <ambientLight />
            <Scene />
        </Canvas>
    );
}