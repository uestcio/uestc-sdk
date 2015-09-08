///<reference path="../../typings/request/request"/>


import * as Request from 'request';


export class Procedure {
    url: string = null;
    method: string = null;
    jar: Request.CookieJar = null;
    queryData: { [id: string]: string } = {};
    formData: { [id: string]: string } = {};
    
    constructor (url: string, method: string, jar?: Request.CookieJar) {
        this.url = url;
        this.method = method;
        this.jar = jar || Request.jar();
    }
}

export class AppSearchCoursesPreProcedure extends Procedure {
    constructor (jar?: Request.CookieJar) {
        super('http://eams.uestc.edu.cn/eams/publicSearch.action', 'GET', jar);
        
    }
}
