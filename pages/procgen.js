
'use client'
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, PerspectiveCamera } from '@react-three/drei';
import  GridGen  from '../components/gridGen.js';
//import { GridGen } from 'react-three-generator';
import { OrbitControls } from '@react-three/drei';
import '../app/global.css';
import { BoxGeometry, SphereGeometry } from 'three';

function MovingCamera() {
    const cameraRef = useRef();
    
    // Define a state to control camera position
    const initialPosition = { x: 0, y: 0, z: 3 };
    const speed = 0.01;
    const [position, setPosition] = React.useState(initialPosition);
  
    // Move the camera forward slowly
    useFrame(() => {
      setPosition(prev => ({
        x: prev.x,
        y: prev.y,
        z: prev.z - speed
      }));
    });
  
    return (
      <PerspectiveCamera makeDefault ref={cameraRef} position={[position.x, position.y, position.z]} rotation={[0,10,0]} />
    );
  }

function R3fScene() {
    return (
        <Canvas style={{height:'100%',width:'100%'}}>
            <ambientLight />
            <MovingCamera />
            <pointLight position={[10, 10, 10]} />
            <GridGen
                noiseMap={[
                    { noiseMin: 0, noiseMax: 0.5, meshComponent: Box, meshGeometry: new BoxGeometry(), meshProps:{} },
                    { noiseMin: 0.5, noiseMax: 1, meshComponent: Sphere, meshGeometry: new SphereGeometry(), meshProps:{} },
                ]}
                />
        </Canvas>
    );
}

export default R3fScene;