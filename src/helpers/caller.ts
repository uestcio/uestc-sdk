///<reference path="../../typings/lodash/lodash"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import * as _ from 'lodash';
import { Observable } from 'rx';

export class Caller {    
    nodifyObservable (observable: Observable<any>, callback?: { (error: any, res: any): void; }): void {
        if (!_.isFunction(callback)) {
            return;
        }
        
        observable.subscribe((item) => {
            callback(null, item);
        }, (error) => {
            callback(error, null);
        });
    }
}