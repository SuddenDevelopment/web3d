import React, {useState} from 'react';
import {Setup} from "../components/setup.js";
import {Model} from "../models/{model}.js";
import '../app/global.css';

export default function R3fScene() {
    const [objData, setObjData] = useState({
        nodes: [],
        actions: []
    });
    return(
        <>
        <Setup 
          orbitControls={{orbitControls}}
          ambientLight={{ambientLight}}
          shadows={{shadows}}
          toneMappingExposure={{toneMappingExposure}}
          >
            <Model setSceneData={setObjData} />
        </Setup>
        </>
    );
}