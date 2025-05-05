import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('imagefile') as File;

        if (!file) {
            return NextResponse.json({ status: 'fail', error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const filePath = path.join(process.cwd(), 'public/product-image', file.name);

        await fs.promises.writeFile(filePath, buffer);

        return NextResponse.json({
            status: 'success',
            url: `/product-image/${file.name}`,
            name: file.name,  
        });
    } catch (err : any) {
        console.error('Error in file upload:', err);
        return NextResponse.json({ status: 'fail', error: err.message }, { status: 500 });
    }
}
