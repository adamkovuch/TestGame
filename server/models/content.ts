import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp, plugin, pre } from 'typegoose';
import { Image } from './image';
import { Route } from '../core/models/route';
import { DbModels } from '../core/db.connection';
import { lang } from '../core/localization';

export class Content extends Typegoose {
    @prop({ ref: Route, required: true })
    route: Ref<Route>;
    
    @prop({ required: true })
    @lang()
    title: any;

    @prop({ required: true })
    @lang()
    html: any;
}

DbModels.registerModel(Content);