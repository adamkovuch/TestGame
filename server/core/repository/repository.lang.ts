import { RepositoryData } from "./repository.data";
import { Typegoose } from "typegoose";
import { expressionCallback } from "./repository";
import { Localization } from "../localization";
import { inject } from "inversify";

export class RepositoryLang<T extends Typegoose> extends RepositoryData<T> {
    static of(modelType) {
        if(modelType.name) {
            return 'langrep_'+modelType.name;
        }
        return 'langrep_'+modelType;
    }

    constructor(@inject('entityType') entityType, @inject(Localization) private localization: Localization) {
        super(entityType);
    }

    async Get(expression?: expressionCallback<T>) {
        let res = await super.Get(expression);
        res = this.localization.extract(res, this.entityType);
        return res;
    }
    
    async GetById(id: any, expression?: expressionCallback<T>) {
        let res = await super.GetById(id, expression);
        res = this.localization.extract(res, this.entityType);
        return res;
    }

    async Add(entity: T) {
        entity = this.localization.pack(entity, this.entityType);
        const res = await super.Add(entity); 
        return res;
    }

    async Update(id: any, entity: T) {
        const oldEntity = await super.GetById(id);
        entity = this.localization.pack(entity, this.entityType, oldEntity);
        const res = super.Update(id, entity);
        return res;
    }
    async Delete(id: any) {
        const res = super.Delete(id);
        
        return res;
    }
}