import * as mongoose from 'mongoose';
import { Typegoose } from 'typegoose';

export function getid(entity): mongoose.Types.ObjectId {
    if(entity)
        return (<any>entity)._id;
    return null;
}
