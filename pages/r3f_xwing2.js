import {Setup} from "../components/setup.js";
import {Model} from "../models/r3f_xwing2.js";
//import { Toolbox } from "@/components/toolbox.js";

import '../app/global.css';

export default function R3fScene() {

    return(
        <>
        <Setup 
          orbitControls={true}
          ambientLight={20}
          shadows={false}
          toneMappingExposure={0.1}
          >
            <Model  />
        </Setup>
        </>
    );
}