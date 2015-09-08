///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>

import { Observable } from 'rx';

import { TakenCourse } from '../models/course';
import { Exam } from '../models/exam';

import { caller } from '../helpers/caller';
import { fetcher } from '../helpers/fetcher';
import { seeker } from '../helpers/seeker';


/** 
* @description
* Represents an instance of Student User.
*/
export class User {
    /**
    * @description
    * The administration class id.
    */
    administrationClass: string = null;
    
    /**
    * @description
    * The administration college name.
    */
    administrationCollege: string = null;
    
    /**
    * @description
    * The campus name.
    */
    campus: string = null;
    
    /**
    * @description
    * The college name.
    */
    college: string = null;
    
    /**
    * @description
    * The date of enrollment.
    */
    dateFrom: Date = null;
    
    /**
    * @description
    * The date of graduation.
    */
    dateTo: Date = null;
    
    /**
    * @description
    * The administration class id.
    */
    direction: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    educationType: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    englishName: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    gender: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    grade: number = null;
    
    /**
    * @description
    * The administration class id.
    */
    id: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    inEnrollment: boolean = null;
    
    /**
    * @description
    * The administration class id.
    */
    inSchool: boolean = null;
    
    /**
    * @description
    * The administration class id.
    */
    major: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    name: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    project: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    qualification: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    schoolingLength: number = null;
    
    /**
    * @description
    * The administration class id.
    */
    status: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    studyType: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    type: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    isConfirmed: boolean = null;
    
    /**
    * @description
    * The administration class id.
    */
    private password: string = null;
    
    /**
    * @description
    * The administration class id.
    */
    private jar: any = null;
    
    constructor (id: string, password: string) {
        this.id = id;
        this.password = password;
        this.isConfirmed = false;
    }
    
    confirm (callback?: { (error: Error, res: boolean): void; }): Observable<boolean> {
        var observable = fetcher.confirmUser(this.id, this.password)
            .do((res) => res && this.getDetail());
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getCourses (grade: number, semester: number, callback?: any): Observable<TakenCourse[]> {
        var observable = this.getCoursesCallByParam(grade, semester, false);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getCoursesForever (grade: number, semester: number, callback?: any): Observable<TakenCourse[]> {
        var observable = this.getCoursesCallByParam(grade, semester, true);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getCoursesInCache (grade: number, semester: number, callback?: any): Observable<TakenCourse[]> {
        var observable = seeker.getUserCourses({ grade: grade, semester: semester });
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getCoursesWithCache (grade: number, semester: number, callback?: any): Observable<TakenCourse[]> {
        var observable = fetcher.getUserCourses({ grade: grade, semester: semester }, true)
            .catch(seeker.getUserCourses({ grade: grade, semester: semester }));
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getExams (grade: number, semester: number, callback?: any): Observable<Exam[]> {
        var observable = this.getExamsCallByParam(grade, semester, false);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getExamsForever (grade: number, semester: number, callback?: any): Observable<Exam[]> {
        var observable = this.getExamsCallByParam(grade, semester, true);
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getExamsInCache (grade: number, semester: number, callback?: any): Observable<Exam[]> {
        var observable = seeker.getUserExams({ grade: grade, semester: semester });
        caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    getExamsWithCache (grade: number, semester: number, callback?: any): Observable<Exam[]> {
        var observable = fetcher.getUserExams({ grade: grade, semester: semester }, true)
            .catch(seeker.getUserExams({ grade: grade, semester: semester }));
        caller.nodifyObservable(observable, callback);
        return observable;
    }
     
    private getCoursesCallByParam (grade: number, semester: number, forever: boolean): Observable<TakenCourse[]> {
        return this.confirm()
            .flatMap((res) => res? 
                fetcher.getUserCourses({ grade: grade, semester: semester }, forever): 
                Observable.throw<TakenCourse[]>(new Error('401: The user validation failed.')));
    }
    
    private getDetail (): void {
        fetcher.getUserDetail().subscribe((detail) => {
            if (this.id !== detail.id) {
                throw new Error('The user id is different of the detail one.')
            }
            this.administrationClass = detail.administrationClass;
            this.administrationCollege = detail.administrationCollege;
            this.campus = detail.campus;
            this.college = detail.college;
            this.dateFrom = detail.dateFrom;
            this.dateTo = detail.dateTo;
            this.direction = detail.direction;
            this.educationType = detail.educationType;
            this.englishName = detail.englishName;
            this.gender = detail.gender;
            this.grade = detail.grade;
            this.inEnrollment = detail.inEnrollment;
            this.inSchool = detail.inSchool;
            this.major = detail.major;
            this.project = detail.project;
            this.qualification = detail.qualification;
            this.schoolingLength = detail.schoolingLength;
            this.status = detail.status;
            this.studyType = detail.studyType;
            this.type = detail.type;
        });
    }
    
    private getExamsCallByParam (grade: number, semester: number, forever: boolean): Observable<Exam[]> {
        return this.confirm().flatMap((res) => res? 
            fetcher.getUserExams({ grade: grade, semester: semester }, forever): 
            Observable.throw<Exam[]>(new Error('401: The user validation failed.')));
    }
}

export class UserFactory {    
    $new (id: string, password: string) {
        return new User(id, password);
    }
}

export const userFactory: UserFactory = new UserFactory();
