import ImageKit from 'imagekit'
import { NextResponse } from 'next/server'

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function POST(request: Request) {
    try {
        // Get the form data from the incoming request
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided in the request' },
                { status: 400 }
            )
        }

        // Convert the Web file object to a Node.js Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload the file Imagekit
        const uploadResponse = await new Promise((resolve, reject) => {
            imageKit.upload(
                {
                    file: buffer,
                    fileName: file.name.replace(/[^a-zA-Z0-9.-]/g, ""),
                    folder: "/product-images",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            )
        })

        // 4. Return the secure URL back to your frontend
        return NextResponse.json({
            url: (uploadResponse as any).url
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred while processing the request' },
            { status: 500 }
        )
    }
}


