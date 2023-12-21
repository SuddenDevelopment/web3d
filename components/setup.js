import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Stage, Float } from "@react-three/drei";
// import { Model, Instances} from "./Model.jsx";
// Instances

export function Setup({
    children,
    orbitControls = true,
    ambientLight = 1,
    shadows = false,
    toneMappingExposure = 0.1,
    ...props
}) {

    return (
        <Canvas shadows gl={{ toneMappingExposure }} >
            { orbitControls &&
                <OrbitControls />
            }
            <Suspense fallback={null}>
                        {children}
            </Suspense>
            <ambientLight intensity={ambientLight}/>
        </Canvas>
    );
}