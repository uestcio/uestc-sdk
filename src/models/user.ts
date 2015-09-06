///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { TakenCourse } from '../models/course';

import { Caller } from '../helpers/caller';
import { Fetcher } from '../helpers/fetcher';
import { Injector, injector } from '../helpers/injector';

var caller: Caller = injector.get('Caller');
var fetcher: Fetcher = injector.get('Fetcher');

export class User {
    administrationClass: string;
    administrationCollege: string;
    campus: string;
    college: string;
    dateFrom: Date;
    dateTo: Date;
    direction: string;
    educationType: string;
    englishName: string;
    gender: string;
    grade: number;
    id: string;
    inEnrollment: boolean;
    inSchool: boolean;
    major: string;
    name: string;
    project: string;
    qualification: string;
    schoolingLength: number;
    status: string;
    studyType: string;
    type: string;
    
    isConfirmed: boolean;
    
    private password: string;
    private jar: any;
    
    constructor (id: string, password: string) {
        this.id = id;
        this.password = password;
        this.isConfirmed = false;
    }
    
    confirm (): Observable<boolean> {
        var observable = fetcher.confirmUser(this.id, this.password)
        
        return ;
    }
    
    getCourses (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        return fetcher.getUserCourses({ grade: grade, semester: semester }, false);
    }
    
    getCoursesForever (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        return null;
    }
    
    getCoursesInCache (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        return null;
    }
    
    getCoursesWithCache (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        return null;
    }
    
    getExams (grade?: number, semester?: number, callback?: any): Observable<any> {
        return null;
    }
    
    getExamsForever (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        return null;
    }
    
    getExamsInCache (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        return null;
    }
    
    getExamsWithCache (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        return null;
    }
}

export class UserFactory {    
    $new (id: string, password: string) {
        return new User(id, password);
    }
}



