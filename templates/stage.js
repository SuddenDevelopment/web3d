import {Setup} from "../components/setup.js";
import {Model} from "../models/{model}.js";
import '../app/global.css';
import { Stage, Float } from "@react-three/drei";
import { Toolbox } from "@/components/toolbox.js";

export default function R3fScene() {
    return(
        <>
        <Setup 
          orbitControls={{orbitControls}}
          ambientLight={{ambientLight}}
          shadows={{shadows}}
          toneMappingExposure={{toneMappingExposure}}
          >
            <Stage environment="city" adjustCamera>
                <Float>
                    <Model/>
                </Float>
            </Stage>
        </Setup>
        { process.env.NODE_ENV === 'development' &&
            <Toolbox/>
        }
        </>
    );
}