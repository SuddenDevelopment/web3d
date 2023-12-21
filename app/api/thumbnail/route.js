import fs from 'fs';

export async function POST(req) {
    if(process.env.NODE_ENV !== 'development') {
        return new Response('This is only for local development');
    }
    const request_data = await req.formData();
    const objParams = Object.fromEntries(request_data.entries());
    console.log('POST PARAMS', objParams);
    const thumbnail = request_data.get('thumbnail');
    return new Response(strFilename);
}