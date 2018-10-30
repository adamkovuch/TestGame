import * as mongoose from 'mongoose';
import { InstanceType, Typegoose } from 'typegoose';
import { injectable, inject } from 'inversify';
import { Repository, expressionCallback } from './repository';
import { ObserverListener, ObserverEventType } from './repository.observer';
import { getLogger } from '../logger';
import { getid } from '../../extensions/getid';

@injectable()
export class RepositoryData<T extends Typegoose> implements Repository<T> {
    static of(modelType) {
        if(modelType.name) {
            return 'rep_'+modelType.name;
        }
        return 'rep_'+modelType;
    }

    protected entity:T;

    private logger = getLogger(RepositoryData);

    @inject(ObserverListener)
    private observerListener: ObserverListener;

    constructor(
        @inject('entityType') protected entityType) {
            this.entity = this.create(entityType);
    }

    async Get(expression?: expressionCallback<T>) {
        let res;
        if(expression) {
            res = (await expression(this.entity.getModelForClass(this.entityType)));
        } else {
            res = await this.entity.getModelForClass(this.entityType).find();
        }

        for(let i in res) {
            res[i] = res[i].toObject();
        }
        
        return <T[]> res;
    }
    
    async GetById(id: any, expression?: expressionCallback<T>) {
        let objectid = null
        try {
            objectid = mongoose.Types.ObjectId(id);
        } catch(err) {
            return null;
        }

        let res;
        if(expression) {
            res = (await expression(this.entity.getModelForClass(this.entityType)).findOne({_id: objectid}));
        } else {
            res = await this.entity.getModelForClass(this.entityType).findById(objectid);
        }
        if(res) {
            return <T>res.toObject();
        }
        return null;
    }

    async Add(entity: T) {
        const Model = this.entity.getModelForClass(this.entityType);
        const res = await new Model(entity).save();
        this.logger.debug(`Repository [${this.entityType.name}]: Item '${getid(res)}' added`);
        this.observerListener.addEvent(this.entityType, res, ObserverEventType.Added);
        return res;
    }

    async Update(id: any, entity: T) {
        const Model = this.entity.getModelForClass(this.entityType);
        const res = await Model.findByIdAndUpdate(mongoose.Types.ObjectId(id), entity);
        if (!res) {
            throw new Error('Cannot save content, modified 0');
        }
        this.logger.debug(`Repository [${this.entityType.name}]: Item '${getid(res)}' updated`);
        this.observerListener.addEvent(this.entityType, entity, ObserverEventType.Modified);
        return entity;
    }
    async Delete(id: any) {
        const Model = this.entity.getModelForClass(this.entityType);
        const res = await Model.findByIdAndDelete(mongoose.Types.ObjectId(id));
        if (!res) {
            throw new Error('Cannot delete image, deleted 0');
        }
        this.logger.debug(`Repository [${this.entityType.name}]: Item '${getid(res)}' removed`);
        this.observerListener.addEvent(this.entityType, res, ObserverEventType.Removed);
    }

    private create<T>(type: (new () => T)): T {
        return new type();
    }
}
