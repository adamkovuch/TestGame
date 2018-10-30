import { prop, Typegoose, ModelType, InstanceType, Ref, arrayProp, plugin, pre } from 'typegoose';
import { Image } from './image';
import { Route } from '../core/models/route';
import { DbModels } from '../core/db.connection';
import { lang } from '../core/localization';
import { PortfolioContent } from './portfolio.content';

export class PortfolioItem extends Typegoose {
    @prop({ required: true })
    @lang()
    public name: any;

    @prop({ required: true, unique: true })
    public link: any;

    @prop({ required: true })
    @lang()
    public description: any;

    @prop({ ref: Route, required: true })
    public route: Ref<Route>;

    @prop({ ref: Route, required: true })
    public portfolioRoute: Ref<Route>;

    @prop()
    public thumbnail: Image;

    @arrayProp({ itemsRef: PortfolioContent, required: true, default: [] })
    public content: Ref<PortfolioContent>[];

    @prop({required: true, default: 0})
    public order: number;
}

DbModels.registerModel(PortfolioItem);