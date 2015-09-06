///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { TakenCourse } from '../models/course';

import { Fetcher } from '../helpers/fetcher';
import { Injector } from '../helpers/injector';

var $injector: Injector;

export class User {

    static fetcher: Fetcher;
        
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
    
    confirm (): Observable<User> {
        return 
    }
    
    getCourses (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        return null;
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



