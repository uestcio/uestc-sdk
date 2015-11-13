/// <reference path="../../typings/request/request"/>
/// <reference path="../../typings/rx/rx"/> 


import * as Request from 'request';
import { Observable } from 'rx';

import { Parser, defaultParser } from '../helpers/parser';
import { Course } from '../models/course';

import { ISearchCoursesOption, IGetSemesterCoursesOption } from '../utils/course_util';
import { ISearchPeopleOption } from '../utils/person_util';
import { IUserLogin } from '../utils/user_util';

import { Person } from '../models/person';


export interface IProcedureResult {
    response: any,
    body: string
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

    constructor() {
    }

    init(url: string, method: string, user: IUserLogin): Procedure {
        this.url = url;
        this.method = method;
        this.user = user;

        return this;
    }

    query(queryData: IQuery): void {
        this.queryData = queryData;
    }

    form(formData: IQuery): void {
        this.formData = formData;
    }

    run(): Observable<IProcedureResult> {
        return Observable.create<IProcedureResult>((observer) => {
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
                    observer.onNext({ response: response, body: body });
                    observer.onCompleted();
                }
            });
        }).retry(100).catch((error) => {
            return Observable.throw<IProcedureResult>(new Error('000: Network is not available.'));
        });
    }
}

export class AppSearchCoursesPreProcedure extends Procedure {
    constructor() {
        super();
    }

    config(user: IUserLogin): AppSearchCoursesPreProcedure {
        this.init('http://eams.uestc.edu.cn/eams/publicSearch.action', 'GET', user);

        return this;
    }
}

export class AppSearchCoursesPreProcedureFactory {
    constructor() {
    }

    create(user: IUserLogin): AppSearchCoursesPreProcedure {
        return new AppSearchCoursesPreProcedure().config(user);
    }
}

export const defaultAppSearchCoursesPreProcedureFactory = new AppSearchCoursesPreProcedureFactory();


export class AppSearchCoursesProcedure extends Procedure {
    constructor(private parser: Parser) {
        super();
    }

    config(option: ISearchCoursesOption, user: IUserLogin): AppSearchCoursesProcedure {
        this.init('http://eams.uestc.edu.cn/eams/publicSearch!search.action', 'POST', user);

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

        return this;
    }
}

export class AppSearchCoursesProcedureFactory {
    constructor(private parser: Parser) {
    }

    create(option: ISearchCoursesOption, user: IUserLogin): AppSearchCoursesProcedure {
        return new AppSearchCoursesProcedure(this.parser).config(option, user);
    }
}

export const defaultAppSearchCoursesProcedureFactory = new AppSearchCoursesProcedureFactory(defaultParser);


export class AppSearchPeopleProcedure extends Procedure {
    constructor(private parser: Parser) {
        super();
    }

    config(option: ISearchPeopleOption, user: IUserLogin): AppSearchPeopleProcedure {
        this.init('http://portal.uestc.edu.cn/pnull.portal', 'POST', user);

        this.query({
            'action': 'fetchUsers',
            '.ia': 'false',
            '.pmn': 'view',
            '.pen': 'personnelGroupmanager'
        });

        this.form({
            'limit': '10',
            'oper_type': 'normal_user',
            'term': option.term
        });

        return this;
    }
}

export class AppSearchPeopleProcedureFactory {
    constructor(private parser: Parser) {
    }

    create(option: ISearchPeopleOption, user: IUserLogin): AppSearchPeopleProcedure {
        return new AppSearchPeopleProcedure(this.parser).config(option, user);
    }
}

export const defaultAppSearchPeopleProcedureFactory = new AppSearchPeopleProcedureFactory(defaultParser);


export class UserEnsureLoginProcedure extends Procedure {
    constructor() {
        super();
    }

    config(user: IUserLogin): UserEnsureLoginProcedure {
        this.init('http://portal.uestc.edu.cn/login.portal', 'GET', user);

        this.tmpData.user = user;
        this.followRedirect = false;

        return this;
    }
}

export class UserEnsureLoginProcedureFactory {
    constructor() {
    }

    create(user: IUserLogin): UserEnsureLoginProcedure {
        return new UserEnsureLoginProcedure().config(user);
    }
}

export const defaultUserEnsureLoginProcedureFactory = new UserEnsureLoginProcedureFactory();


export class UserGetIdsProcedure extends Procedure {
    constructor(protected parser: Parser) {
        super();
    }

    config(user: IUserLogin): UserGetIdsProcedure {
        this.init('http://eams.uestc.edu.cn/eams/courseTableForStd.action', 'GET', user);

        return this;
    }
}

export class UserGetIdsProcedureFactory {
    constructor(protected parser: Parser) {
        
    }
    
    create(user: IUserLogin): UserGetIdsProcedure {
        return new UserGetIdsProcedure(this.parser).config(user);
    }
}

export const defaultUserGetIdsProcedureFactory = new UserGetIdsProcedureFactory(defaultParser);


export class UserGetSemesterCoursesProcedure extends Procedure {
    constructor(protected parser: Parser) {
        super();
    }

    config(option: IGetSemesterCoursesOption, user: IUserLogin): UserGetSemesterCoursesProcedure {
        this.init('http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action', 'POST', user);

        this.form({
            'ignoreHead': '1',
            'setting.kind': 'std',
            'startWeek': '1',
            'project.id': '1',
            'semester.id': option.semester,
            'ids': user.ids
        });

        return this;
    }
}

export class UserGetSemesterCoursesProcedureFactory {
    constructor(protected parser: Parser) {
        
    }
    
    create(option: IGetSemesterCoursesOption, user: IUserLogin): UserGetSemesterCoursesProcedure {
        return new UserGetSemesterCoursesProcedure(this.parser).config(option, user);
    }
}

export const defaultUserGetSemesterCoursesProcedureFactory = new UserGetSemesterCoursesProcedureFactory(defaultParser);


export class UserLoginProcedure extends Procedure {
    constructor() {
        super();
    }

    config(user: IUserLogin): UserLoginProcedure {
        this.init('https://uis.uestc.edu.cn/amserver/UI/Login', 'POST', user);

        this.form({
            'IDToken0': '',
            'IDToken1': user.id,
            'IDToken2': user.password,
            'IDButton': 'Submit',
            'goto': 'aHR0cDovL3BvcnRhbC51ZXN0Yy5lZHUuY24vbG9naW4ucG9ydGFs',
            'encoded': 'true',
            'gx_charset': 'UTF-8'
        });

        return this;
    }
}

export class UserLoginProcedureFactory {
    constructor() {
    }

    create(user: IUserLogin): UserLoginProcedure {
        return new UserLoginProcedure().config(user);
    }
}

export const defaultUserLoginProcedureFactory = new UserLoginProcedureFactory();
