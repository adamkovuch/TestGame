import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp } from 'typegoose';
import { DbModels } from '../core/db.connection';

export class AdminUser extends Typegoose {
    @prop({ required: true, unique: true })
    login: string;

    @prop()
    email?: string;

    @prop({ required: true })
    name: string;

    @prop({ required: true })
    hash: string;

    @prop({ required: true })
    salt: string;
}

DbModels.registerModel(AdminUser);
