///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { Course, TakenCourse } from '../models/course';
import { Exam } from '../models/exam';
import { Person } from '../models/person';

import { IGetUserCoursesOption, ISearchCoursesOption, ISearchPeopleOption, IUserDetail } from 'utils/interfaces';

export class Fetcher {
    confirmUser (id: string, password: string): Observable<boolean> {
        return null;
    }
    
    getUserCourses (option: IGetUserCoursesOption, forever: boolean = false) : Observable<TakenCourse[]> {
        return null;
    }
    
    getUserDetail (): Observable<IUserDetail> {
        return null;
    }
    
    getUserExams (option: IGetUserCoursesOption, forever: boolean = false) : Observable<Exam[]> {
        return null;
    }
    
    searchForCourses (option: ISearchCoursesOption): Observable<Course[]> {
        return null;
    }
    
    searchForPeople (option: ISearchPeopleOption): Observable<Person[]> {
        return null;
    }
}

export const fetcher: Fetcher = new Fetcher();
