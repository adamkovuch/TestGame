import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp, plugin, pre } from 'typegoose';
import { Image } from './image';
import { Route } from '../core/models/route';
import { DbModels } from '../core/db.connection';
import { lang } from '../core/localization';

export class PortfolioContent extends Typegoose {
    @prop({ required: true })
    public type: string;

    @prop({ required: true })
    public data: any;

    @prop({ required: true, default: 0 })
    public order: number;
}

DbModels.registerModel(PortfolioContent);