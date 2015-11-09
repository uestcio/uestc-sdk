///<reference path="../../typings/request/request"/>
///<reference path="../../typings/rx/rx"/>
///<reference path="../../typings/rx/rx-lite"/>


import * as Request from 'request';
import { Observable } from 'rx';

import { TakenCourse } from '../models/course';
import { Exam } from '../models/exam';
import { Caller, defaultCaller } from '../helpers/caller';
import { Fetcher, defaultFetcher } from '../helpers/fetcher';
import { Seeker, defaultSeeker } from '../helpers/seeker';
import { IUserLogin } from '../utils/user_util';


/** 
* @description
* Represents an instance of Student User.
*/
export class User implements IUserLogin {
    /**
    * @description The administration class id. (行政班级)
    * @example '2012010201'
    */
    administrationClass: string = null;
    
    /**
    * @description The administration college name.(行政管理院系)
    * @example '通信与信息工程学院'
    */
    administrationCollege: string = null;
    
    /**
    * @description The campus name. (所属校区)
    * @example '清水河校区'
    */
    campus: string = null;
    
    /**
    * @description The college name. (院系)
    * @example '通信与信息工程学院'
    */
    college: string = null;
    
    /**
    * @description The date of enrollment. (入校时间)
    * @example new Date('2012-09-01')
    */
    dateFrom: Date = null;
    
    /**
    * @description The date of graduation. (应毕业时间)
    * @example new Date('2016-07-01')
    */
    dateTo: Date = null;
    
    /**
    * @description The direction of major. (专业方向)
    * @example null
    */
    direction: string = null;
    
    /**
    * @description The type of education. (教育形式)
    * @example null
    */
    educationType: string = null;
    
    /**
    * @description The english name. (英文名)
    * @example 'Qiu Tongyu'
    */
    englishName: string = null;
    
    /**
    * @description The gender/sex. (性别)
    * @example '男'
    */
    gender: string = null;
    
    /**
    * @description The actual grade of education. (所在年级)
    * @notice It may not be the same number in the student id.
    * @example 2012
    */
    grade: number = null;
    
    /**
    * @description The student/staff id. (学号/工号)
    * @example '2012019050031'
    */
    id: string = null;
    
    /**
    * @description The status of whether in enrollment. (是否在籍)
    * @example true
    */
    inEnrollment: boolean = null;
    
    /**
    * @description The status of whether in school. (是否在校)
    * @example true
    */
    inSchool: boolean = null;
    
    /**
    * @description The major name. (专业)
    * @example '网络工程'
    */
    major: string = null;
    
    /**
    * @description The chinese name. (姓名)
    * @example '秋彤宇'
    */
    name: string = null;
    
    /**
    * @description The project name. (项目)
    * @example '本科'
    */
    project: string = null;
    
    /**
    * @description The qualification of education. (学历层次)
    * @example '本科'
    */
    qualification: string = null;
    
    /**
    * @description The length of years in campus. (学制)
    * @example 4
    */
    schoolingLength: number = null;
    
    /**
    * @description The status of enrollment. (学籍状态)
    * @example '在籍在校'
    */
    status: string = null;
    
    /**
    * @description The type of study. (学习形式)
    * @example '普通全日制'
    */
    studyType: string = null;
    
    /**
    * @description The genre of student. (学生类别)
    * @example '普通本科生'
    */
    genre: string = null;
    
    /**
    * @description The status of whether the given id and password is confirmed.
    * @example true
    */
    isConfirmed: boolean = null;
    
    /**
    * @description The password.
    */
    password: string = null;
    
    /**
    * @description The jar to save the cookies.
    */
    jar: Request.CookieJar = null;
    
    /**
     * @description The constructor of the class.
     * @param id The student/staff id.
     * @param password The password.
     */
    constructor(protected caller: Caller, protected fetcher: Fetcher, protected seeker: Seeker) {
    }

    init(id: string, password: string): User {
        this.id = id;
        this.password = password;
        this.isConfirmed = false;
        this.jar = Request.jar();

        return this;
    }
    
    /**
     * @description Check whether the student id and password is valid of not.
     * @notice If some other accident occurs (i.e. No network), the result would be null, please do check whether the error exists or not.
     * @param callback The callback function to be called with an error or the result of verify for users unfamiliar with Rx. It's deprecated.
     * @returns The Observable instance of the confirm result.
     */
    confirm(callback?: { (error: Error, res: boolean): void; }): Observable<boolean> {
        var observable = this.fetcher.confirmUser(this)
            .do((res) => res && this.getDetail());
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
     * @description Get the courses of the given grade and semester online only once.
     * @param grade The grade of courses, such as 2012, use 0 to mean all grades.
     * @param semester The semester of courses, such as 1, use 0 to mean all semesters.
     * @param callback The callback function to be called with an error or the result of courses for users unfamiliar with Rx. It's deprecated.
     */
    getCourses(grade: number, semester: number, callback?: any): Observable<TakenCourse[]> {
        var observable = this.getCoursesCallByParam(grade, semester, false);
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
     * @description Get the courses of the given grade and semester online anytime it's updated.
     * @param grade The grade of courses, such as 2012, use 0 to mean all grades.
     * @param semester The semester of courses, such as 1, use 0 to mean all semesters.
     * @param callback The callback function to be called with an error or the result of courses for users unfamiliar with Rx. It's deprecated.
     */
    getCoursesForever(grade: number, semester: number, callback?: any): Observable<TakenCourse[]> {
        var observable = this.getCoursesCallByParam(grade, semester, true);
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
     * @description Get the courses of the given grade and semester offline only once.
     * @param grade The grade of courses, such as 2012, use 0 to mean all grades.
     * @param semester The semester of courses, such as 1, use 0 to mean all semesters.
     * @param callback The callback function to be called with an error or the result of courses for users unfamiliar with Rx. It's deprecated.
     */
    getCoursesInCache(grade: number, semester: number, callback?: any): Observable<TakenCourse[]> {
        var observable = this.seeker.getUserCourses({ grade: grade, semester: semester });
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
     * @description Get the courses of the given grade and semester online when possible, offline if necessary only once.
     * @param grade The grade of courses, such as 2012, use 0 to mean all grades.
     * @param semester The semester of courses, such as 1, use 0 to mean all semesters.
     * @param callback The callback function to be called with an error or the result of courses for users unfamiliar with Rx. It's deprecated.
     */
    getCoursesWithCache(grade: number, semester: number, callback?: any): Observable<TakenCourse[]> {
        var observable = this.getCourses(grade, semester)
            .catch(this.getCoursesInCache(grade, semester));
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
     * @description Get the exams of the given grade and semester online only once.
     * @param grade The grade of exams, such as 2012, use 0 to mean all grades.
     * @param semester The semester of exams, such as 1, use 0 to mean all semesters.
     * @param callback The callback function to be called with an error or the result of exams for users unfamiliar with Rx. It's deprecated.
     */
    getExams(grade: number, semester: number, callback?: any): Observable<Exam[]> {
        var observable = this.getExamsCallByParam(grade, semester, false);
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
     * @description Get the exams of the given grade and semester online anytime it's updated.
     * @param grade The grade of exams, such as 2012, use 0 to mean all grades.
     * @param semester The semester of exams, such as 1, use 0 to mean all semesters.
     * @param callback The callback function to be called with an error or the result of exams for users unfamiliar with Rx. It's deprecated.
     */
    getExamsForever(grade: number, semester: number, callback?: any): Observable<Exam[]> {
        var observable = this.getExamsCallByParam(grade, semester, true);
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
     * @description Get the exams of the given grade and semester offline only once.
     * @param grade The grade of exams, such as 2012, use 0 to mean all grades.
     * @param semester The semester of exams, such as 1, use 0 to mean all semesters.
     * @param callback The callback function to be called with an error or the result of exams for users unfamiliar with Rx. It's deprecated.
     */
    getExamsInCache(grade: number, semester: number, callback?: any): Observable<Exam[]> {
        var observable = this.seeker.getUserExams({ grade: grade, semester: semester });
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
    
    /**
     * @description Get the exams of the given grade and semester online when possible, offline if necessary only once.
     * @param grade The grade of exams, such as 2012, use 0 to mean all grades.
     * @param semester The semester of exams, such as 1, use 0 to mean all semesters.
     * @param callback The callback function to be called with an error or the result of exams for users unfamiliar with Rx. It's deprecated.
     */
    getExamsWithCache(grade: number, semester: number, callback?: any): Observable<Exam[]> {
        var observable = this.getExams(grade, semester)
            .catch(this.getExamsInCache(grade, semester));
        this.caller.nodifyObservable(observable, callback);
        return observable;
    }
     
    /**
     * @description The internal method for DRY reason.
     */
    private getCoursesCallByParam(grade: number, semester: number, forever: boolean): Observable<TakenCourse[]> {
        return this.confirm()
            .flatMapLatest((res) => res ?
                this.fetcher.getUserCourses({ grade: grade, semester: semester }, forever, this) :
                Observable.throw<TakenCourse[]>(new Error('401: The user validation failed.')));
    }
    
    /**
     * @description The internal method to get the user details.
     */
    private getDetail(): void {
        this.fetcher.getUserDetail(this).subscribe((detail) => {
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
            this.genre = detail.genre;
        });
    }
    
    /**
     * @description The internal method for DRY reason.
     */
    private getExamsCallByParam(grade: number, semester: number, forever: boolean): Observable<Exam[]> {
        return this.confirm().flatMapLatest((res) => res ?
            this.fetcher.getUserExams({ grade: grade, semester: semester }, forever, this) :
            Observable.throw<Exam[]>(new Error('401: The user validation failed.')));
    }
}

/**
 * @description The factory of User class.
 */
export class UserFactory {
    constructor(private caller: Caller, private fetcher: Fetcher, private seeker: Seeker) {
    }
    /**
     * @description The method to create new user instance.
     * @param id The student/staff id.
     * @param password The password.
     * @returns The user instance of given id and password. (not confirmed)
     */
    create(id: string, password: string) {
        return new User(this.caller, this.fetcher, this.seeker).init(id, password);
    }
}

/**
 * @description The UserFactory instance for access.
 */
export const defaultUserFactory: UserFactory = new UserFactory(defaultCaller, defaultFetcher, defaultSeeker);
