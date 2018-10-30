import { prop, Typegoose, instanceMethod, InstanceType } from 'typegoose';
import { inject, injectable } from 'inversify';
import { getLogger } from './logger';

export function lang() {
    return function (target: any, propertyKey: string) {
        Localization.langDecorators.push({ target: target.constructor, propertyKey });
    };
}

@injectable()
export class Localization {
    private static logger = getLogger(Localization);
    lang: string;

    static readonly langDecorators = [];

    constructor(@inject('lang') lang: string) {
        this.lang = lang;
    }

    extract(model: any, entityType) {
        return Localization.extract(model, this.lang, entityType);
    }

    pack(model: any, entityType, oldEntity?: any) {
        if(this.lang !== 'none') {
            return Localization.pack(model, this.lang, entityType, oldEntity);
        }
        return model;
    }

    static extract(model: any, lang: string, entityType) {
        Localization.logger.debug(`Extracting [${lang}] model from '${model}'`);
        const children = new Array();
        let obj: InstanceType<any> = model;
        do {
            for(let i in obj) {
                if(!obj[i]) continue;
                
                if(obj[i][lang]) {
                    obj[i] = obj[i][lang];
                    continue;
                }

                if(Localization.langDecorators.find(elem=>elem.target === entityType && i === elem.propertyKey)) {
                    obj[i] = obj[i]['_def'];
                    continue;
                }

                if(i.charAt(0) == '_' || i.charAt(0) == '$' || !obj[i]) {
                    continue;
                }
    
                if(typeof obj[i] === 'object') {
                    children.push(obj[i]);
                }
            }
            obj = children.pop();
        } while(obj);

        Localization.logger.debug(`Model extracted. Result='${model}'`);
        return model;
    }

    static pack(entity: any, lang: string, entityType: string, oldEntity?: any) {
        Localization.logger.debug(`Model packing. Model='${entity}'`);
        for(let i in entity) {
            if(typeof entity[i] === 'string') {
                if(Localization.langDecorators.find(elem=>elem.target === entityType && i === elem.propertyKey)) {
                    const value: string = entity[i];
                    if(oldEntity) {
                        entity[i] = oldEntity[i];
                    } else {
                        entity[i] = {};
                    }
                    if(!entity[i]["_def"] || entity[i]["_def"] == '') {
                        entity[i]["_def"] = value;
                    }
                    entity[i][lang] = value;
                }
            }
        }
        Localization.logger.debug(`Model packed. Result='${entity}'`);
        return entity;
    }
}