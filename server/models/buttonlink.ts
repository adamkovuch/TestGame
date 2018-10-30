import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp, plugin, pre } from 'typegoose';
import { DbModels } from '../core/db.connection';
import { lang } from '../core/localization';
import { Route } from './route';

export class ButtonLink extends Typegoose {
    @prop({ ref: Route, required: true })
    route: Ref<Route>;
    
    @prop({ required: true })
    @lang()
    title: any;

    @prop({ required: true })
    link: string;
}

DbModels.registerModel(ButtonLink);