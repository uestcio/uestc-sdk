///<reference path="../../typings/request/request"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>


import * as Request from 'request';
import { Observable } from 'rx';


export interface IProcedureResult {
    response: any,
    body: string
}

export interface IUserLoginResult extends IProcedureResult {
    result: boolean
}


export class Procedure {
    url: string = null;
    method: string = null;
    jar: Request.CookieJar = null;
    queryData: { [id: string]: string } = null;
    formData: { [id: string]: string } = null;
    
    constructor (url: string, method: string, jar: Request.CookieJar) {
        this.url = url;
        this.method = method;
        this.jar = jar || Request.jar();
    }
    
    form (formData: { [id: string]: string }): void {
        this.formData = formData;
    }
    
    run (): Observable<IProcedureResult> {
        return Observable.create<IProcedureResult>((observer) => {
            Request({
                uri: this.url,
                method: this.method,
                qs: this.queryData,
                form: this.formData,
                jar: this.jar
            }, (error, response, body) => {
                if (error) {
                    observer.onError(error);
                }
                else {
                    observer.onNext({ response: response, body: body });
                    observer.onCompleted();
                }
            });
        });
    }
}

export class AppSearchCoursesPreProcedure extends Procedure {
    constructor (jar: Request.CookieJar) {
        super('http://eams.uestc.edu.cn/eams/publicSearch.action', 'GET', jar);
    }
    
    run (): Observable<any> {
        // Todo
        return super.run();
    }
}

export class AppSearchCoursesProcedure extends Procedure {
    constructor (jar: Request.CookieJar) {
        super('http://eams.uestc.edu.cn/eams/publicSearch!search.action', 'POST', jar);
    }
    
    run (): Observable<any> {
        // Todo
        return super.run();
    }
}

export class UserEnsureLoginProcedure extends Procedure {
    constructor (jar: Request.CookieJar) {
        // Todo
        super('', '', jar);
    }
    
    run (): Observable<any> {
        // Todo
        return super.run();
    }
}

export class UserLoginProcedure extends Procedure {
    constructor (id: string, password: string, jar: Request.CookieJar) {
        super('https://uis.uestc.edu.cn/amserver/UI/Login', 'POST', jar);
        this.form({
            'IDToken0': '',
            'IDToken1': id,
            'IDToken2': password,
            'IDButton': 'Submit',
            'goto': 'aHR0cDovL3BvcnRhbC51ZXN0Yy5lZHUuY24vbG9naW4ucG9ydGFs',
            'encoded': 'true',
            'gx_charset': 'UTF-8'
        });
    }
    
    run (): Observable<IUserLoginResult> {
        return super.run().map((x) => {
            return {
                body: x.body,
                response: x.response,
                result: x.response.statusCode === 302
            }
        });
    }
}
