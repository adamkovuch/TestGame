import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp } from 'typegoose';
import { DbModels } from '../core/db.connection';

export class Setting extends Typegoose {
    @prop({ required: true, unique: true })
    key: string;

    @prop()
    value: any;
}
DbModels.registerModel(Setting);