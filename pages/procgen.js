import React, { lazy, useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, PerspectiveCamera, Stats, useGLTF, Instances } from '@react-three/drei';
import  GridGen  from '../components/gridGen2.js';
import Trees from '../models/r3f_trees.js';
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
    const initialPosition = { x: 0, y: 0, z: 0 };
    const speed = 0.05;
    const [position, setPosition] = React.useState(initialPosition);
    const [zRow, setZRow] = React.useState(100);
    // Move the camera forward slowly
    const { nodes, materials } = useGLTF('models/r3f_trees-transformed.glb');
    useEffect(() => {
  }, []);
    return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[position.x, position.y, position.z]} rotation={[0,degreesToRadians(180),0]} />
      <pointLight position={[10, 10, 10]} />
      <GridGen
          noiseMap={[
              { noiseMin: 0, noiseMax: 0.5, probability:0.75, geometry: nodes.LP_tree01.geometry, material: materials.pal, rotation: 2  },
              { noiseMin: 0.5, noiseMax: 1, probability:0.5, geometry: nodes.Big_tree01.geometry, material: materials.pal, scale: 0.5 },
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
useGLTF.preload('models/r3f_trees-transformed.glb')