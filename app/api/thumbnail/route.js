import { pipeline } from 'stream';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const pipe = promisify(pipeline);

export async function POST(req) {
    if(process.env.NODE_ENV !== 'development') {
        return new Response('This is only for local development');
    }
    const request_data = await req.formData();
    const objParams = Object.fromEntries(request_data.entries());
    const thumbnail = request_data.get('thumbnail');
    //find the record in data.json
    const strDataFile = path.resolve('./public/data.json');
    const strData = fs.readFileSync(strDataFile, 'utf8');
    const objData = JSON.parse(strData);
    let objPage = objData.pages.find(obj => obj.id === objParams.page);
    //write the thumbnail file
    const strExtension = thumbnail.name.split('.').pop();
    objPage.thumbnail = `r3f_${objPage.name}.${strExtension}`;
    //update the data.json file
    fs.writeFileSync(strDataFile, JSON.stringify(objData, null, 4));
    const filePath = path.join(path.resolve('./public/thumbnails/'), objPage.thumbnail);
    await pipe(thumbnail.stream(), fs.createWriteStream(filePath));
    return new Response(filePath);
}