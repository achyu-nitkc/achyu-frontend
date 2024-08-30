import fs from "fs";
import path from "path";
import fomidable, { File, IncomingForm } from "formidable-serverless";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest | File | Date, res: NextApiResponse) {
  const form = new IncomingForm();
  form.uploadDir = "./public/images";
  form.keepExtensions = true;
  form.parse(req, (err, fields, files: { [key: string]: any }) => {
    if (err) {
      res.status(500).json({
        message: "ERROR",
      });
    }
    const file = files.file;
    if (!file) {
      res.status(500).json({
        message: "ERROR",
      });
    }
    const nowDate: string = new Date().toISOString();
    const encodeFilename = Buffer.from(file.name, "utf-8").toString("base64");
    const fileExtension = path.extname(file.name);
    const newPath = path.join(process.cwd(), "public/images", nowDate + encodeFilename + fileExtension);
    fs.rename(file.path, newPath, (err) => {
      if (err) {
        res.status(500).json({
          message: "ERROR",
        });
      }
      res.status(200).json({
        message: "mod-" + nowDate + encodeFilename + fileExtension,
      });
    });
  });
}
