declare module "formidable-serverless" {
  import { IncomingForm as OriginalIncomingForm, File } from "formidable";

  export interface IncomingForm extends OriginalIncomingForm {
    uploadDir: string;
    keepExtensions: boolean;
    parse(req: any, callback: (err: any, fields: any, files: { [key: string]: File }) => void): void;
  }

  export interface File {
    size: number;
    path: string;
    name: string;
    type: string;
    hash: string;
    lastModifiedDate?: Date;
    originalFilename: string;
    toJSON: () => string;
  }

  // formidableのIncomingFormを拡張
  export class IncomingForm extends OriginalIncomingForm {
    parse(req: any, callback: (err: any, fields: any, timestamp: any, files: { [key: string]: File }) => void): void;
  }
}
