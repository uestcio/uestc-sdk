///<reference path="../../typings/request/request"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>


import * as Request from 'request';
import { Observable } from 'rx';

import { parser } from '../helpers/parser';
import { Course } from '../models/course';
import { Person } from '../models/person';
import { IUserLogin, ISearchCoursesOption } from '../utils/interfaces'


export interface IProcedureResult<TResult> {
    response: any,
    body: string,
    result: TResult
}

export class Procedure {
    url: string = null;
    method: string = null;
    user: IUserLogin = null;
    followRedirect: boolean = true;
    queryData: { [id: string]: string } = null;
    formData: { [id: string]: string } = null;
    tmpData: any = {};
    
    constructor (url: string, method: string, user: IUserLogin) {
        this.url = url;
        this.method = method;
        this.user = user;
    }
    
    form (formData: { [id: string]: string }): void {
        this.formData = formData;
    }
    
    run (): Observable<IProcedureResult<any>> {
        return Observable.create<IProcedureResult<any>>((observer) => {
            Request({
                uri: this.url,
                method: this.method,
                followRedirect: this.followRedirect,
                qs: this.queryData,
                form: this.formData,
                jar: this.user.jar
            }, (error, response, body) => {
                if (error) {
                    observer.onError(error);
                }
                else {
                    observer.onNext({ response: response, body: body , result: null});
                    observer.onCompleted();
                }
            });
        }).retry(3);
    }
}

export class AppSearchCoursesPreProcedure extends Procedure {
    constructor (user: IUserLogin) {
        super('http://eams.uestc.edu.cn/eams/publicSearch.action', 'GET', user);
    }
    
    run (): Observable<IProcedureResult<boolean>> {
        return super.run().map((res) => {
            res.result = true;
            return res;
        });
    }
}

export class AppSearchCoursesProcedure extends Procedure {
    constructor (option: ISearchCoursesOption, user: IUserLogin) {
        super('http://eams.uestc.edu.cn/eams/publicSearch!search.action', 'POST', user);
        this.form({
            'lesson.course.name': option.name || '',
            'teacher.name': option.instructor || '',
            'limitGroup.grade': option.grade || ''
        }); 
    }
    
    run (): Observable<IProcedureResult<Course[]>> {
        return super.run().flatMap((res) => {
            return parser.getAppCourses(res.body).map((courses) => {
                res.result = courses;
                return res;
            });
        });
    }
}

export class AppSearchPeoplePreProcedure extends Procedure {
    constructor (user: IUserLogin) {
        super('http://portal.uestc.edu.cn/pnull.portal?action=globalGroupsTree&.ia=false&.pmn=view&.pen=personnelGroupmanager&groupId&identity=undefined&authorize=undefined', 'GET', user);
    }
    
    run (): Observable<IProcedureResult<boolean>> {
        return super.run().map((res) => {
            res.result = true;
            return res;
        });
    }
}

export class AppSearchPeopleProcedure extends Procedure {
    constructor (term: string, user: IUserLogin) {
        super('http://portal.uestc.edu.cn/pnull.portal?action=fetchUsers&.ia=false&.pmn=view&.pen=personnelGroupmanager', 'POST', user);
        this.form({
            'limit': '10',
            'oper_type': 'normal_user',
            'term': term
        });
    }
    
    run (): Observable<IProcedureResult<Person[]>> {
        return super.run().flatMap((res) => {
            return parser.getAppPeople(res.body).map((people) => {
                res.result = people;
                return res;
            });
        });
    }
}

export class UserEnsureLoginProcedure extends Procedure {
    constructor (user: IUserLogin) {
        super('http://portal.uestc.edu.cn/login.portal', 'GET', user);
        this.tmpData.user = user;
        this.followRedirect = false;
    }
    
    run (): Observable<IProcedureResult<boolean>> {
        return super.run().flatMap((x) => {
            if(x.response.statusCode === 302) {
                x.result = true;
                return Observable.return(x);
            } 
            return new UserLoginProcedure(this.tmpData.user).run().map((x) => {
                return x;
            });
        })
    }
}

export class UserLoginProcedure extends Procedure {
    constructor (user: IUserLogin) {
        super('https://uis.uestc.edu.cn/amserver/UI/Login', 'POST', user);
        this.form({
            'IDToken0': '',
            'IDToken1': user.id,
            'IDToken2': user.password,
            'IDButton': 'Submit',
            'goto': 'aHR0cDovL3BvcnRhbC51ZXN0Yy5lZHUuY24vbG9naW4ucG9ydGFs',
            'encoded': 'true',
            'gx_charset': 'UTF-8'
        });
    }
    
    run (): Observable<IProcedureResult<boolean>> {
        return super.run().map((x) => {
            x.result = (x.response.statusCode === 302);
            return x;
        });
    }
}
