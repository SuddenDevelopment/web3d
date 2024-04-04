import {Setup} from "../components/setup.js";
import {Model} from "../models/instances.js";
//import { Toolbox } from "@/components/toolbox.js";

import '../app/global.css';

export default function R3fScene() {

    return(
        <>
        <Setup 
          orbitControls={true}
          ambientLight={100}
          shadows={false}
          toneMappingExposure={1}
          >
            <Model  />
        </Setup>
        </>
    );
}