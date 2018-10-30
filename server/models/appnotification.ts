import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp } from 'typegoose';
import { DbModels } from '../core/db.connection';

export class AppNotification extends Typegoose {
    @prop({ required: true })
    title: string;

    @prop({ required: true })
    text: string;

    @prop({ required: true, default: false })
    isRead: boolean;

    @prop({ required: true, default: Date.now })
    dt: Date;
}

DbModels.registerModel(AppNotification);