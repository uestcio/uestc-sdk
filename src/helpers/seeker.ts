///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { Course, TakenCourse } from '../models/course';
import { Exam } from '../models/exam';
import { Person } from '../models/person';

import { IGetUserCoursesOption, ISearchCoursesOption, ISearchPeopleOption } from '../utils/interfaces';


export class Seeker {
    getUserCourses (option: IGetUserCoursesOption) : Observable<TakenCourse[]> {
        return null;
    }
    
    getUserExams (option: IGetUserCoursesOption) : Observable<Exam[]> {
        return null;
    }
    
    searchForCourses (option: ISearchCoursesOption): Observable<Course[]> {
        return null;
    }
    
    searchForPeople (option: ISearchPeopleOption): Observable<Person[]> {
        return null;
    }
}

export const seeker: Seeker = new Seeker();
