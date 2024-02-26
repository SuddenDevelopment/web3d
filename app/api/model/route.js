import { pipeline } from 'stream';
import { promisify } from 'util';
//import { load } from '@loaders.gl/core';
//import { GLTFLoader } from '@loaders.gl/gltf';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';

const pipe = promisify(pipeline);

const replaceTokens = function(strContent, objTokens) {
    let strNewContent = strContent;
    for(let strToken in objTokens) {
        strNewContent = strNewContent.replaceAll('{'+strToken+'}', objTokens[strToken]);
    }
    return strNewContent;
}

const loadModel = async function(strPath) {
    console.log('READING',strPath);
    const data = fs.readFileSync(strPath);
    //const gltfData = await load(data, GLTFLoader);
    //console.log(gltfData);
  }

// create the basic scene and point to the new model
const createPage = async function(strModelPath,strPagePath, objOptions) {
    let strTemplateFile = 'scene.js';
    if (objOptions.template === 'stage') {
        strTemplateFile = 'stage.js';
    }
    const strTemplate = fs.readFileSync(path.resolve(`./templates/${strTemplateFile}`), 'utf8');
    //get the model filename from the path
    const strModelFilename = strModelPath.split('/').pop().split('.')[0];
    console.log(objOptions);
    let strContent = replaceTokens(strTemplate,{model:strModelFilename});
    strContent = replaceTokens(strContent, {
        ambientLight: objOptions.ambient ?? 1,
        toneMappingExposure: objOptions.exposure ?? 0.1,
        shadows: objOptions.shadows ?? false,
        orbitControls: objOptions.orbit ?? false,
        camera: objOptions.camera ?? false,
        instances: objOptions.instances ?? false,
    });
    //load the GTLF/GLB file even if it's compressed with draco

    // add mesh events if the actions are named meshName_event_action_details
    // e.g. leftMesh_click_play_1_1000 playActions = function(actions, arrPlayActions, strBehavior = 'play', intRepeat=0, intDelay = 1000)

    fs.writeFileSync(strPagePath, strContent);

    //update the path in the model file
    const strModelFile = fs.readFileSync(path.resolve('./models/', strModelFilename+'.js'), 'utf8');
    let strNewModelFile = strModelFile.replaceAll(`('/r3f_`, `('models/r3f_`);
    //set camera default to true if in options, can only match the first one it finds
    if(objOptions.camera === 'true') {
        strNewModelFile = strNewModelFile.replace(`Camera makeDefault={false}`, `Camera makeDefault={true}`);
    }
    fs.writeFileSync(path.resolve('./models/', strModelFilename+'.js'), strNewModelFile);

    // Load the GLTF or GLB file and read the action names
    //const gltfData = await load(strModelPath, GLTFLoader);
    //const actionNames = gltfData.animations.map(animation => animation.name);
    //console.log('Action names:', actionNames);
};

export async function POST(req) {
    if(process.env.NODE_ENV !== 'development') {
        return new Response('This is only for local development');
    }
    const request_data = await req.formData();
    const objParams = Object.fromEntries(request_data.entries());
    //console.log('POST PARAMS', objParams);
    const file = request_data.get('model');
    const strExtension = file.name.split('.').pop();
    //basic security filter 
    const strFilename = 'r3f_'+objParams.name.replace(/[^a-zA-Z0-9]/g, '')+'.js';
    if(['glb','gltf'].indexOf(strExtension) === -1) {
        return new Response('File extension not allowed');
    }
    const fileName = `r3f_${objParams.name.replace(/[^a-zA-Z0-9]/g, '')}.${strExtension}`;
    const filePath = path.join(path.resolve('./public/models/'), fileName);
    await pipe(file.stream(), fs.createWriteStream(filePath));

    const strDestinationFile = path.join(path.resolve('./models/'), strFilename);
    //let strCommand = `npx gltfjsx@6.2.13 ${filePath} -o ${strDestinationFile}`;
    let strCommand = `npx gltfjsx@6.2.13 ${filePath} -o ${strDestinationFile}`;
    strCommand += ` -p ${objParams.precision}`;
    if(objParams.instances === 'true') {
        strCommand += ' -i';
    }
    if(objParams.shadows === 'true') {
        strCommand += ' -s';
    }
    if(objParams.transform === 'true') {
        strCommand += ' -T';
    }
    //console.log(strCommand);
        exec(strCommand, {cwd: path.resolve('public/models') },(error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            //console.log(`stdout: ${stdout}`);
            if (fs.existsSync(strDestinationFile)) {
                //console.log(`found it`);
                objParams.glb = fileName;
                //const gltf = loadModel(strDestinationFile);
                createPage(strFilename, path.join(path.resolve('./pages/'), strFilename), objParams);
            }
        });
        //update data.json with new page info
        const strDataFile = path.resolve('./public/data.json');
        const strData = fs.readFileSync(strDataFile, 'utf8');
        const objData = JSON.parse(strData);
        const strId = uuidv4();
        objData.pages.push({
            id: strId,
            name: objParams.name,
            template: objParams.template,
            description: objParams.description,
            glb: file.name,
            thumbnail: null,
            date: new Date().toISOString(),
        });
        fs.writeFileSync(strDataFile, JSON.stringify(objData, null, 4));
    return new Response(strFilename);
}

