///<reference path="../../typings/request/request"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>


import * as Request from 'request';
import { Observable } from 'rx';

import { defaultParser } from '../helpers/parser';
import { Course, TakenCourse } from '../models/course';
import { Exam } from '../models/exam';
import { Person } from '../models/person';
import { defaultUserLoginProcedureFactory, defaultUserEnsureLoginProcedureFactory, defaultUserGetIdsProcedureFactory, defaultAppSearchCoursesPreProcedureFactory, defaultAppSearchCoursesProcedureFactory, defaultAppSearchPeopleProcedureFactory } from '../models/procedure';

import { IGetUserCoursesOption, ISearchCoursesOption } from '../utils/course_util';
import { ISearchPeopleOption } from '../utils/person_util';
import { IUserDetail, IUserLogin } from '../utils/user_util';


/**
 * @description The helper to deal with online request.
 */
export class Fetcher {

    /**
     * @description The method of procedures to confirm the user identity.
     * @param user The user login interface.
     * @returns The Observable instance of fetch result.
     */
    confirmUser(user: IUserLogin): Observable<boolean> {
        return defaultUserEnsureLoginProcedureFactory.create(user).run()
        .flatMapLatest((x) => {
            if (x.response.statusCode === 302) {
                return Observable.return(true);
            }
            else {
                return defaultUserLoginProcedureFactory.create(user).run()
                .flatMap((x) => Observable.return(x.response.statusCode === 302? true: false));
            }
        })
    }
    
    /**
     * @description The method of procedures to get the taken courses of a user.
     * @param option The option for search.
     * @param forever Whether auto refresh.
     * @param user The user login interface.
     * @returns The Observable instance of fetch result.
     */
    getUserCourses(option: IGetUserCoursesOption, forever: boolean, user: IUserLogin): Observable<TakenCourse[]> {
        return null;
    }
    
    getUserIds(user: IUserLogin): Observable<string> {
        return defaultUserGetIdsProcedureFactory.create(user).run().flatMapLatest((x) => defaultParser.getUserIds(x.body));
    }
    
    /**
     * @description The method of procedures to get the details of a user.
     * @param user The user login interface.
     * @returns The Observable instance of fetch result.
     */
    getUserInfo(user: IUserLogin): Observable<IUserDetail> {
        return null;
    }
    
    /**
     * @description The method of procedures to get the exams of a user.
     * @param option The option for search.
     * @param forever Whether auto refresh.
     * @param user The user login interface.
     * @returns The Observable instance of fetch result.
     */
    getUserExams(option: IGetUserCoursesOption, forever: boolean, user: IUserLogin): Observable<Exam[]> {
        return null;
    }
    
    /**
     * @description The method of procedures to get the courses accord with option.
     * @param option The option for search.
     * @param forever Whether auto refresh.
     * @param user The user login interface.
     * @returns The Observable instance of fetch result.
     */
    searchForCourses(option: ISearchCoursesOption, user: IUserLogin): Observable<Course[]> {
        return defaultAppSearchCoursesPreProcedureFactory.create(user).run()
        .flatMapLatest((x) => defaultAppSearchCoursesProcedureFactory.create(option, user).run())
        .flatMapLatest((x) => defaultParser.getAppCourses(x.body));
    }
    
    /**
     * @description The method of procedures to get the people accord with option.
     * @param option The option for search.
     * @param forever Whether auto refresh.
     * @param user The user login interface.
     * @returns The Observable instance of fetch result.
     */
    searchForPeople(option: ISearchPeopleOption, user: IUserLogin): Observable<Person[]> {
        return defaultAppSearchPeopleProcedureFactory.create(option.term, user).run()
        .flatMapLatest((x) => defaultParser.getAppPeople(x.body));
    }
}

export const defaultFetcher: Fetcher = new Fetcher();
