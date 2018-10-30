import { injectable } from "inversify";
import { getLogger } from "../logger";

export interface RepositoryObserver {
    onDataChanged(entity_type: any, entity: any, event: ObserverEventType);
}

export enum ObserverEventType {
    Added = 'added',
    Modified = 'modified',
    Removed = 'removed'
}

@injectable()
export class ObserverListener {
    private logger = getLogger(ObserverListener);
    private lastObservers: RepositoryObserver[];
    constructor() {
        this.logger.debug('ObserverListener created');
    }

    private readonly events: ObserveEvent[] = [];
    addEvent(entity_type: any, entity: any, event: ObserverEventType) {
        this.events.push({entity, entity_type, event});
        this.logger.debug(`Listener added for entity '${entity_type.name}'`);
        this.observe();
    }

    observe(observers: RepositoryObserver[] = this.lastObservers) {
        if(!observers) {
            return;
        }
        
        this.lastObservers = observers;
        this.events.forEach(event=>{
            observers.forEach(observer=>{
                this.logger.debug(`Observing handlers for entity '${event.entity_type.name}'`);
                observer.onDataChanged(event.entity_type, event.entity, event.event);
            });
        });

        this.events.splice(0);
    }
}

interface ObserveEvent {
    entity_type: any;
    entity: any;
    event: ObserverEventType;
}