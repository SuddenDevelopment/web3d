import fs from 'fs';
import path from 'path';

export async function GET(req) {    
    if(process.env.NODE_ENV !== 'development') {
        return Response('This is only for local development');
    }
    const arrDirFiles = fs.readdirSync(path.resolve('./pages/'));
    // we only want to list the pages that were generated with a r3f prefix
    const arrFiles = arrDirFiles.filter(file => path.extname(file) === ".js" && file.indexOf('r3f_') === 0);
    const arrRenamedFiles = arrFiles.map(file => {
        // Update the file name here
        const updatedName = file.replace('r3f_', '').replace('.js', '');
        return updatedName;
    });
    return Response.json(arrRenamedFiles);
}

