///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { TakenCourse } from '../models/course';

import { Caller } from '../helpers/caller';
import { Exam } from '../models/exam';
import { Fetcher } from '../helpers/fetcher';
import { Injector, injector } from '../helpers/injector';
import { Seeker } from '../helpers/seeker';


/** @unaccessible Dependency instance. */
var caller: Caller = injector.get('Caller');
/** @unaccessible Dependency instance. */
var fetcher: Fetcher = injector.get('Fetcher');
/** @unaccessible Dependency instance. */
var seeker: Seeker = injector.get('Seeker');

/** 
* @description
* Represents an instance of Student User.
*/
export class User {
    /**
    * @description
    * The administration class id.
    */
    administrationClass: string;
    
    /**
    * @description
    * The administration college name.
    */
    administrationCollege: string;
    
    /**
    * @description
    * The campus name.
    */
    campus: string;
    
    /**
    * @description
    * The college name.
    */
    college: string;
    
    /**
    * @description
    * The date of enrollment.
    */
    dateFrom: Date;
    
    /**
    * @description
    * The date of graduation.
    */
    dateTo: Date;
    
    /**
    * @description
    * The administration class id.
    */
    direction: string;
    
    /**
    * @description
    * The administration class id.
    */
    educationType: string;
    
    /**
    * @description
    * The administration class id.
    */
    englishName: string;
    
    /**
    * @description
    * The administration class id.
    */
    gender: string;
    
    /**
    * @description
    * The administration class id.
    */
    grade: number;
    
    /**
    * @description
    * The administration class id.
    */
    id: string;
    
    /**
    * @description
    * The administration class id.
    */
    inEnrollment: boolean;
    
    /**
    * @description
    * The administration class id.
    */
    inSchool: boolean;
    
    /**
    * @description
    * The administration class id.
    */
    major: string;
    
    /**
    * @description
    * The administration class id.
    */
    name: string;
    
    /**
    * @description
    * The administration class id.
    */
    project: string;
    
    /**
    * @description
    * The administration class id.
    */
    qualification: string;
    
    /**
    * @description
    * The administration class id.
    */
    schoolingLength: number;
    
    /**
    * @description
    * The administration class id.
    */
    status: string;
    
    /**
    * @description
    * The administration class id.
    */
    studyType: string;
    
    /**
    * @description
    * The administration class id.
    */
    type: string;
    
    /**
    * @description
    * The administration class id.
    */
    isConfirmed: boolean;
    
    /**
    * @description
    * The administration class id.
    */
    private password: string;
    
    /**
    * @description
    * The administration class id.
    */
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
