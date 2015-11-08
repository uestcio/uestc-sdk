/// <reference path="../../typings/request/request"/>
/// <reference path="../../typings/rx/rx"/> 


import * as Request from 'request';
import { Observable } from 'rx';

import { parser } from '../helpers/parser';
import { Course } from '../models/course';

import { IGetSemesterCoursesOption, IUserLogin, ISearchCoursesOption } from '../utils/interfaces'

import { Person } from '../models/person';


export interface IProcedureResult<TResult> {
    response: any,
    body: string,
    result: TResult
}

export interface IQuery {
    [id: string]: string
}

export class Procedure {
    url: string = null;
    method: string = null;
    user: IUserLogin = null;
    followRedirect: boolean = true;
    queryData: IQuery = null;
    formData: IQuery = null;
    tmpData: any = {};

    constructor (url: string, method: string, user: IUserLogin) {
        this.url = url;
        this.method = method;
        this.user = user;
    }
    
    query (queryData: IQuery): void {
        this.queryData = queryData;
    }

    form (formData: IQuery): void {
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
                    observer.onNext({ response: response, body: body, result: null });
                    observer.onCompleted();
                }
            });
        }).retry(100);
    }
}

export class AppSearchCoursesPreProcedure extends Procedure {
    constructor(user: IUserLogin) {
        super('http://eams.uestc.edu.cn/eams/publicSearch.action', 'GET', user);
    }

    run(): Observable<IProcedureResult<boolean>> {
        return super.run().map((res) => {
            res.result = true;
            return res;
        });
    }
}

export class AppSearchCoursesProcedure extends Procedure {
    constructor(option: ISearchCoursesOption, user: IUserLogin) {
        super('http://eams.uestc.edu.cn/eams/publicSearch!search.action', 'POST', user);
        this.form({
            'lesson.project.id': '1',
            'lesson.no': '',
            'lesson.course.name': option.name || '',
            'lesson.teachDepart.id': '...',
            'limitGroup.depart.id': '...',
            'teacher.name': option.instructor || '',
            'fake.teacher.null': '...',
            'limitGroup.grade': option.grade || '',
            'fake.weeks': '',
            'startWeekSchedule': '',
            'endWeekSchedule': '',
            'fake.time.weekday': '...',
            'fake.time.unit': '',
            'lesson.campus.id': '...',
            'lesson.courseType.id': '...',
            'examType.id': '...',
            'lesson.semester.id': 'undefined'
        });
    }

    run(): Observable<IProcedureResult<Course[]>> {
        return super.run().flatMap((res) => {
            return parser.getAppCourses(res.body).map((courses) => {
                res.result = courses;
                return res;
            });
        });
    }
}

export class AppSearchPeoplePreProcedure extends Procedure {
    constructor(user: IUserLogin) {
        super('http://portal.uestc.edu.cn/pnull.portal', 'GET', user);
        this.query({
            'action': 'globalGroupsTree',
            '.ia': 'false',
            '.pmn': 'view',
            '.pen': 'personnelGroupmanager',
            'groupId': '',
            'identity': 'undefined',
            'authorize': 'undefined'
        });
    }

    run(): Observable<IProcedureResult<boolean>> {
        return super.run().map((res) => {
            res.result = true;
            return res;
        });
    }
}

export class AppSearchPeopleProcedure extends Procedure {
    constructor(term: string, user: IUserLogin) {
        super('http://portal.uestc.edu.cn/pnull.portal', 'POST', user);
        this.query({
            'action': 'fetchUsers',
            '.ia': 'false',
            '.pmn': 'view',
            '.pen': 'personnelGroupmanager'
        });
        this.form({
            'limit': '10',
            'oper_type': 'normal_user',
            'term': term
        });
    }

    run(): Observable<IProcedureResult<Person[]>> {
        return super.run().flatMap((res) => {
            return parser.getAppPeople(res.body).map((people) => {
                res.result = people;
                return res;
            });
        });
    }
}

export class UserEnsureLoginProcedure extends Procedure {
    constructor(user: IUserLogin) {
        super('http://portal.uestc.edu.cn/login.portal', 'GET', user);
        this.tmpData.user = user;
        this.followRedirect = false;
    }

    run(): Observable<IProcedureResult<boolean>> {
        return super.run().flatMap((x) => {
            if (x.response.statusCode === 302) {
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
    constructor(user: IUserLogin) {
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

    run(): Observable<IProcedureResult<boolean>> {
        return super.run().map((x) => {
            x.result = (x.response.statusCode === 302);
            return x;
        });
    }
}

export class UserGetSemesterCoursesPreProcedure extends Procedure {
    constructor(user: IUserLogin) {
        super('http://eams.uestc.edu.cn/eams/courseTableForStd.action', 'GET', user);
    }

    run(): Observable<IProcedureResult<string>> {
        return super.run().flatMap((res) => {
            return parser.getUserIds(res.body).map((ids) => {
                res.result = ids;
                return res;
            });
        });
    }
}

export class UserGetSemesterCoursesProcedure extends Procedure {
    constructor(option: IGetSemesterCoursesOption, user: IUserLogin) {
        super('http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action', 'POST', user);
        this.form({
            'ignoreHead': '1',
            'setting.kind': 'std',
            'startWeek': '1',
            'project.id': '1',
            'semester.id': option.semester,
            'ids': option.ids
        });
    }

    run(): Observable<IProcedureResult<Course[]>> {
        return super.run().flatMap((res) => {
            return parser.getUserCourses(res.body).map((courses) => {
                res.result = courses;
                return res;
            });
        });
    }
}