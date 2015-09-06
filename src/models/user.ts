///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { TakenCourse } from '../models/course';

import { Caller } from '../helpers/caller';
import { Exam } from '../models/exam';
import { Fetcher } from '../helpers/fetcher';
import { Injector, injector } from '../helpers/injector';
import { Seeker } from '../helpers/seeker';

var caller: Caller = injector.get('Caller');
var fetcher: Fetcher = injector.get('Fetcher');
var seeker: Seeker = injector.get('Seeker');

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
    
    confirm (callback?: { (error: Error, res: boolean): void; }): Observable<boolean> {
        var observable = fetcher.confirmUser(this.id, this.password)
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getCourses (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        var observable = fetcher.getUserCourses({ grade: grade, semester: semester }, false);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getCoursesForever (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        var observable = fetcher.getUserCourses({ grade: grade, semester: semester }, true);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getCoursesInCache (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        var observable = seeker.getUserCourses({ grade: grade, semester: semester });
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getCoursesWithCache (grade?: number, semester?: number, callback?: any): Observable<TakenCourse[]> {
        var observable = fetcher.getUserCourses({ grade: grade, semester: semester }, true)
            .catch(seeker.getUserCourses({ grade: grade, semester: semester }));
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getExams (grade?: number, semester?: number, callback?: any): Observable<Exam[]> {
        var observable = fetcher.getUserExams({ grade: grade, semester: semester }, false);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getExamsForever (grade?: number, semester?: number, callback?: any): Observable<Exam[]> {
        var observable = fetcher.getUserExams({ grade: grade, semester: semester }, true);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getExamsInCache (grade?: number, semester?: number, callback?: any): Observable<Exam[]> {
        var observable = seeker.getUserExams({ grade: grade, semester: semester });
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getExamsWithCache (grade?: number, semester?: number, callback?: any): Observable<Exam[]> {
        var observable = fetcher.getUserExams({ grade: grade, semester: semester }, true)
            .catch(seeker.getUserExams({ grade: grade, semester: semester }));
        caller.nodifyObservable(observable, callback);
        return observable;
    }
}

export class UserFactory {    
    $new (id: string, password: string) {
        return new User(id, password);
    }
}



