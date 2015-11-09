///<reference path="../../typings/request/request"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>


import * as Request from 'request';
import { Observable } from 'rx';

import { Course, TakenCourse } from '../models/course';
import { Exam } from '../models/exam';
import { Person } from '../models/person';

import { defaultUserLoginProcedureFactory, defaultUserEnsureLoginProcedureFactory, defaultAppSearchCoursesPreProcedureFactory, defaultAppSearchCoursesProcedureFactory, defaultAppSearchPeopleProcedureFactory } from '../models/procedure';

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
        return defaultUserEnsureLoginProcedureFactory.create().config(user).run().flatMapLatest((x) => {
            return defaultUserLoginProcedureFactory.create().config(user).run().map((res) => res.result);
        });
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
    
    /**
     * @description The method of procedures to get the details of a user.
     * @param user The user login interface.
     * @returns The Observable instance of fetch result.
     */
    getUserDetail(user: IUserLogin): Observable<IUserDetail> {
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
        return defaultUserEnsureLoginProcedureFactory.create().config(user).run().flatMapLatest((x) => {
            return defaultAppSearchCoursesPreProcedureFactory.create().config(user).run().map((res) => res.result);
        }).flatMapLatest((x) => {
            return defaultAppSearchCoursesProcedureFactory.create().config(option, user).run().map((res) => res.result);
        });
    }
    
    /**
     * @description The method of procedures to get the people accord with option.
     * @param option The option for search.
     * @param forever Whether auto refresh.
     * @param user The user login interface.
     * @returns The Observable instance of fetch result.
     */
    searchForPeople(option: ISearchPeopleOption, user: IUserLogin): Observable<Person[]> {
        return defaultUserEnsureLoginProcedureFactory.create().config(user).run().flatMapLatest((x) => {
            return defaultAppSearchPeopleProcedureFactory.create().config(option.term, user).run().map((res) => res.result);
        });
    }
}

export const defaultFetcher: Fetcher = new Fetcher();
