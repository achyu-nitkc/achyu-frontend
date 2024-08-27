import {NextRequest, NextResponse} from "next/server";
import fs from "fs"
import path from "path"

const UPLOAD_DIR = "~/IdeaProjects/achyu-frontend/public/images"

export const config = {
    api: {
        bodyParser: false
    }
}
type Data = {
    msg?: string
}

const checkEdited = (file:File) => {
    const loadImage = require("blueimp-load-image")
    loadImage.parseMetaData(file,(data:any) => {
        console.log(data)
        console.log("Exif data: ",data.exif)
        if("Software" in data.exif) {
            return true
        }
    })
    return false
}

export default async function handler(
    req:NextRequest,
) {
    const formData = await req.formData()
    const body = Object.fromEntries(formData)
    const file = (body.file as Blob) || null
    const nowDate:string = new Date().toString()
    const filename:string = checkEdited(body.file as File) ? "EDITED-" + nowDate + (body.file as File).name : nowDate + (body.file as File).name

    if(file){
        const buffer = Buffer.from(await file.arrayBuffer())
        if(!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR)
        }
        fs.writeFileSync(
            path.resolve(UPLOAD_DIR, filename),
            buffer
        )
    } else {
        return NextResponse.json({
            success: false,
            name: ""
        })
    }
    return NextResponse.json({
        success: true,
        name: filename
    })
}