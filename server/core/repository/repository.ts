import { Typegoose, InstanceType } from "typegoose";
import * as mongoose from 'mongoose';

export interface Repository<T extends Typegoose> {
    Get(expression?: expressionCallback<T>): Promise<T[]>;
    GetById(id: any, expression?: expressionCallback<T>): Promise<T>;
    Add(entity: T);
    Update(id: any, entity: T);
    Delete(id: any);
}

export interface expressionCallback<T>
{
    (fn: mongoose.Model<InstanceType<T> & T>): 
        mongoose.DocumentQuery<InstanceType<T>[], InstanceType<T>>;
}