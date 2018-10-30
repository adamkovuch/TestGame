import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp, pre, post } from 'typegoose';
import { Content } from './content';
import { Image } from './image';
import * as mongoose from 'mongoose';
import { DbModels } from '../core/db.connection';
import { lang } from '../core/localization';


@post<Route>('remove', (route) => {
    
})
@pre<Route>('save', (next)=> {
    if(this.isDefault === true) {
        const RouteModel = new Route().getModelForClass(Route);
        RouteModel.update({ 'isDefault': true }, { 'isDefault': false });
    }
    next();
})
export class Route extends Typegoose {
    @prop({ required: true })
    @lang()
    name: any;

    @prop({ required: true, unique: true })
    alias: string;

    @prop({ required: true, default: false })
    isDefault: boolean;

    @prop({ required: true, default: 0 })
    position: number;

    @prop({ required: true, default: true })
    visible: boolean;

    @prop({ required: true })
    component:string;
}
DbModels.registerModel(Route);

