///<reference path="../../typings/es6-promise/es6-promise"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Promise } from 'es6-promise';
import { Observable } from 'rx';

export class Caller {
    nodifyPromise (promise: Promise<any>, callback: { (error: any, res: any): void; }): void {
        promise.then((res) => {
            callback(null, res);
        }, (error) => {
            callback(error, null);
        });
    }
    
    nodifyObservable (observable: Observable<any>, callback: { (error: any, res: any): void; }): void {
        var res: any[] = [];
        observable.subscribe((item) => {
            res.push(item);
        }, (error) => {
            callback(error, null);
        }, () => {
            callback(null, res);
        });
    }
}