import { Type } from "../../extensions/type";

export interface Dependency {
    name: string;
    useClass?: Type<any>;
    useValue?: any;
}