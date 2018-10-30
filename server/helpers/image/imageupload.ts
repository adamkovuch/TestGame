import { Image } from "../../models/image";

export interface ImageUpload {
    delete(id: any): Promise<any>;
    upload(filename: string):Promise<Image>;
}
