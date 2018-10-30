import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp } from 'typegoose';
import { DbModels } from '../core/db.connection';

export class Image extends Typegoose {
    @prop()
    name?: string;

    @prop()
    data?: any;

    @prop({ required: true })
    src: string;

    @prop({ required: true, default: 0 })
    order: number;

    @prop()
    imageId: string;
}
DbModels.registerModel(Image);