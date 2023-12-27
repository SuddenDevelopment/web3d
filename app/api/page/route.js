import fs from 'fs';
import path from 'path';
//delete the page, model, thumbnail and data

const deleteFiles = (arrFiles) => {
    arrFiles.forEach(strFile => {
        if (fs.existsSync(strFile)) {
            fs.unlinkSync(strFile);
        }
    });
};

export async function DELETE(req) {
    if(process.env.NODE_ENV !== 'development') {
        return new Response('This is only for local development');
    }
    const arrFiles = [];
    //get the regular request body params
    const objParams = await req.json();
    //console.log('DELETE PARAMS', objParams);
    //find the record in data.json
    const strDataFile = path.resolve('./public/data.json');
    const strData = fs.readFileSync(strDataFile, 'utf8');
    const objData = JSON.parse(strData);
    let objPage = objData.pages.find(obj => obj.id === objParams.page);
    //delete the page file
    arrFiles.push( path.resolve('./pages/r3f_'+objPage.name+'.js') );
    //delete the scene file
    arrFiles.push( path.resolve('./models/r3f_'+objPage.name+'.js') );
    //delete the model files
    const strExtension = objPage.glb.split('.').pop();
    arrFiles.push( path.resolve('./public/models/r3f_'+objPage.name+'.'+strExtension) );
    arrFiles.push( path.resolve('./public/models/r3f_'+objPage.name+'-transformed.'+strExtension) );
    //delete the thumbnail file
    arrFiles.push( path.resolve('./public/thumbnails/'+objPage.thumbnail) );
    //delete the data.json record
    objData.pages = objData.pages.filter(obj => obj.id !== objParams.page);
    fs.writeFileSync(strDataFile, JSON.stringify(objData, null, 4));
    deleteFiles(arrFiles);
    return new Response('deleted');
}