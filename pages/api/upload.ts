import {NextRequest, NextResponse} from "next/server";
import fs from "fs"
import path from "path"
import {execFile} from "node:child_process";

const UPLOAD_DIR = process.cwd() + "public/images"

export const config = {
    api: {
        bodyParser: false
    }
}
type Data = {
    msg?: string
}

const checkEdited = (file: File) => {
    const loadImage = require("blueimp-load-image")
    loadImage.parseMetaData(file, (data: any) => {
        console.log(data)
        console.log("Exif data: ", data.exif)
        if ("Software" in data.exif) {
            return true
        }
    })
    return false
}

export default async function handler(
    req: NextRequest,
) {
    const formData = await req.formData()
    const body = Object.fromEntries(formData)
    const file = (body.file as Blob) || null
    const nowDate: string = new Date().toString()
    const userFilename = (body.file as File).name
    const userFilename_encoded = Buffer.from(userFilename, 'utf-8').toString("base64")

    if (file) {
        const filename: string = checkEdited(body.file as File) ? "EDITED-" + nowDate + userFilename_encoded : nowDate + userFilename_encoded
        const buffer = Buffer.from(await file.arrayBuffer())
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR)
        }
        fs.writeFileSync(
            path.resolve(UPLOAD_DIR, filename),
            buffer
        )
        const script = path.join(process.cwd(), "script", "imgModify.py")
        execFile("python3", [script, path.resolve(UPLOAD_DIR, filename)], (error, stdout, stderr) => {
            if (error) {
                console.error("ERROR!SCRIPT FAILED")
                return NextResponse.json({
                    success: false,
                    name: ""
                })
            }
        })
        return NextResponse.json({
            success: true,
            name: filename
        })
    } else {
        return NextResponse.json({
            success: false,
            name: ""
        })
    }

}