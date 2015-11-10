/// <reference path="../../typings/node/node"/>
/// <reference path="../../typings/expect.js/expect.js.d.ts"/>
/// <reference path="../../typings/rx/rx"/>
/// <reference path="../../typings/mocha/mocha"/>


import assert = require('assert');
import expect = require('expect.js');
import rx = require('rx');

import { TakenCourse } from '../../src/models/course';
import {} from '../../src/models/exam';
import {} from '../../src/helpers/fetcher';
import {} from '../../src/helpers/seeker';
import { User, UserFactory, defaultUserFactory } from '../../src/models/user';

import { MockCaller } from '../mocks/helpers/mock_caller';
import { MockFetcher } from '../mocks/helpers/mock_fetcher';
import { MockSeeker } from '../mocks/helpers/mock_seeker';
import { defaultMockTakenCourseFactory } from '../mocks/models/mock_course';

var noCallFun = (error?: any) => {
    throw error;
}

describe('User module: ', () => {

    it('should have an `User` class.', () => {
        expect(User).to.be.a(Function);
    });

    it('should have an `UserFactory` class.', () => {
        expect(UserFactory).to.be.a(Function);
    });

    it('should have a `defaultUserFactory` variable', () => {

    });

    describe('mock tests for instance of User: ', () => {
        var user: User;
        var fetcher: MockFetcher;
        var seeker: MockSeeker;

        beforeEach(() => {
            fetcher = new MockFetcher();
            seeker = new MockSeeker();
            user = new UserFactory(new MockCaller(), fetcher, seeker).create('2012019050031', '******');
        });

        describe('should have proper properties and methods: ', () => {
            it('should have exact properties: ', () => {
                expect(user).to.have.property('administrationClass');
                expect(user.administrationClass).to.be(null);

                expect(user).to.have.property('administrationCollege');
                expect(user.administrationCollege).to.be(null);

                expect(user).to.have.property('campus');
                expect(user.campus).to.be(null);

                expect(user).to.have.property('college');
                expect(user.college).to.be(null);

                expect(user).to.have.property('dateFrom');
                expect(user.dateFrom).to.be(null);

                expect(user).to.have.property('dateTo');
                expect(user.dateTo).to.be(null);

                expect(user).to.have.property('direction');
                expect(user.direction).to.be(null);

                expect(user).to.have.property('educationType');
                expect(user.educationType).to.be(null);

                expect(user).to.have.property('englishName');
                expect(user.englishName).to.be(null);

                expect(user).to.have.property('gender');
                expect(user.gender).to.be(null);

                expect(user).to.have.property('grade');
                expect(user.grade).to.be(null);

                expect(user).to.have.property('id');
                expect(user.id).to.be('2012019050031');

                expect(user).to.have.property('inEnrollment');
                expect(user.inEnrollment).to.be(null);

                expect(user).to.have.property('inSchool');
                expect(user.inSchool).to.be(null);

                expect(user).to.have.property('major');
                expect(user.major).to.be(null);

                expect(user).to.have.property('name');
                expect(user.name).to.be(null);

                expect(user).to.have.property('project');
                expect(user.project).to.be(null);

                expect(user).to.have.property('qualification');
                expect(user.qualification).to.be(null);

                expect(user).to.have.property('schoolingLength');
                expect(user.schoolingLength).to.be(null);

                expect(user).to.have.property('status');
                expect(user.status).to.be(null);

                expect(user).to.have.property('studyType');
                expect(user.studyType).to.be(null);

                expect(user).to.have.property('genre');
                expect(user.genre).to.be(null);

                expect(user).to.have.property('isConfirmed');
                expect(user.isConfirmed).to.be(false);

                expect(user).to.have.property('password');
                expect(user.password).to.be('******');

                expect(user).to.have.property('jar');
                expect(user.jar).not.to.be(null);
            });

            it('should have exact methods.', () => {
                expect(user).to.have.property('confirm');
                expect(user.confirm).to.be.a(Function);

                expect(user).to.have.property('getCourses');
                expect(user.getCourses).to.be.a(Function);

                expect(user).to.have.property('getCoursesForever');
                expect(user.getCoursesForever).to.be.a(Function);

                expect(user).to.have.property('getCoursesInCache');
                expect(user.getCoursesInCache).to.be.a(Function);

                expect(user).to.have.property('getCoursesWithCache');
                expect(user.getCoursesWithCache).to.be.a(Function);

                expect(user).to.have.property('getExams');
                expect(user.getExams).to.be.a(Function);

                expect(user).to.have.property('getExamsForever');
                expect(user.getExamsForever).to.be.a(Function);

                expect(user).to.have.property('getExamsInCache');
                expect(user.getExamsInCache).to.be.a(Function);

                expect(user).to.have.property('getExamsWithCache');
                expect(user.getExamsWithCache).to.be.a(Function);
            });
        });

        describe('should be able to confirm and get info: ', () => {

            it('should not confirm itself if not called.', () => {
                expect(fetcher.confirmCount).to.be(0);
                expect(fetcher.infoCount).to.be(0);
            });

            it('should get info if called confirm and succeed.', (done) => {
                fetcher.confirmResult = true;
                fetcher.infoResult = { id: '2012019050031', name: '秋彤宇' };

                user.confirm().subscribe((res) => {
                    expect(res).to.be(true);
                    expect(fetcher.confirmCount).to.be(1);
                    expect(fetcher.infoCount).to.be(1);
                    done();
                }, noCallFun);
            });

            it('should not get info if confirm failed.', (done) => {
                fetcher.confirmResult = false;

                user.confirm().subscribe((res) => {
                    expect(res).to.be(false);
                    expect(fetcher.confirmCount).to.be(1);
                    expect(fetcher.infoCount).to.be(0);
                    done();
                }, noCallFun);
            })
        });

        describe('should be able to get taken courses: ', () => {

            beforeEach(() => {
                fetcher.courses = [defaultMockTakenCourseFactory.create('0'), defaultMockTakenCourseFactory.create('1')];
                fetcher.infoResult = { id: '2012019050031', name: '秋彤宇' };
                seeker.courses = [defaultMockTakenCourseFactory.create('0')];
            });

            describe('for user#getCourses: ', () => {

                it('should call fetcher#getUserCourses from getCourses if confirmed.', (done) => {
                    fetcher.confirmResult = true;

                    user.getCourses(2012, 1).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(2);
                        expect(courses[0]).to.be.a(TakenCourse);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should not be able to get courses if confirm failed.', (done) => {
                    fetcher.confirmResult = false;

                    user.getCourses(2012, 1).subscribe(noCallFun, (error) => {
                        expect(error).to.be.an(Error);
                        done();
                    });
                });

                it('should not be able to get courses if confirm throws.', (done) => {
                    fetcher.confirmWillThrow = true;

                    user.getCourses(2012, 1).subscribe(noCallFun, (error) => {
                        expect(error).to.be.an(Error);
                        done();
                    });
                });
            });

            describe('for user#getCoursesForever: ', () => {

                it('should call fetcher#getUserCourses if confirmed.', (done) => {
                    fetcher.confirmResult = true;
                    fetcher.courses = [defaultMockTakenCourseFactory.create('0'), defaultMockTakenCourseFactory.create('1'), defaultMockTakenCourseFactory.create('2')];
                    var counter = 0;

                    user.getCoursesForever(2012, 1).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(++counter);
                        expect(courses[counter - 1]).to.be.a(TakenCourse);
                        expect(courses[counter - 1].id).to.be((counter - 1).toString());
                        if (counter === fetcher.courses.length) { done(); };
                    }, noCallFun);
                });

                it('should not be able to get courses if confirm failed.', (done) => {
                    fetcher.confirmResult = false;

                    user.getCoursesForever(2012, 1).subscribe(noCallFun, (error) => {
                        expect(error).to.be.an(Error);
                        done();
                    });
                });

                it('should not be able to get courses if confirm throws.', (done) => {
                    fetcher.confirmWillThrow = true;

                    user.getCoursesForever(2012, 1).subscribe(noCallFun, (error) => {
                        expect(error).to.be.an(Error);
                        done();
                    });
                });
            });

            describe('for user#getCoursesInCache: ', () => {
                it('should call seeker#getUserCourses if confirmed.', (done) => {
                    fetcher.confirmResult = true;

                    user.getCoursesInCache(2012, 1).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0]).to.be.a(TakenCourse);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should call seeker#getUserCourses if confirm failed.', (done) => {
                    fetcher.confirmResult = false;

                    user.getCoursesInCache(2012, 1).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0]).to.be.a(TakenCourse);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should call seeker#getUserCourses if confirm throws.', (done) => {
                    fetcher.confirmWillThrow = true;

                    user.getCoursesInCache(2012, 1).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0]).to.be.a(TakenCourse);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });
            });

            describe('for user#getCoursesWithCache: ', () => {
                it('should call fetcher#getUserCourses if confirmed.', (done) => {
                    fetcher.confirmResult = true;

                    user.getCoursesWithCache(2012, 1).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(2);
                        expect(courses[0]).to.be.a(TakenCourse);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should call seeker#getUserCourses if confirm failed.', (done) => {
                    fetcher.confirmResult = false;

                    user.getCoursesWithCache(2012, 1).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0]).to.be.a(TakenCourse);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should call seeker#getUserCourses if confirm throws.', (done) => {
                    fetcher.confirmWillThrow = true;

                    user.getCoursesWithCache(2012, 1).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0]).to.be.a(TakenCourse);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });
            });
        });

        // describe('should be able to get exams: ', () => {
        //     var confirmObservable, examsObservable, offlineExamsObservable;

        //     describe('for user#getExams: ', () => {
        //         it('should call fetcher#getUserExams from getExams if confirmed.', (done) => {
        //             var exams = [new Exam('0'), new Exam('1')];
        //             confirmObservable = rx.Observable.return(true);
        //             examsObservable = rx.Observable.return(exams);

        //             user.getExams().subscribe((res) => {
        //                 expect(x).to.be(exams);
        //                 done();
        //             }, noCallFun);
        //         });

        //         it('should not be able to get exams if confirm failed.', (done) => {
        //             confirmObservable = rx.Observable.return(false);
        //             examsObservable = rx.Observable.return([new Exam('0'), new Exam('1')]);

        //             user.getExams().subscribe((res) => {
        //                 expect(true).to.be(false);
        //             }, (error) => {
        //                 expect(err).not.to.be(null);
        //                 done();
        //             });
        //         });

        //         it('should not be able to get exams if confirm throws.', (done) => {
        //             confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
        //             examsObservable = rx.Observable.return([new Exam('0'), new Exam('1')])

        //             user.getExams().subscribe((res) => {
        //                 expect(true).to.be(false);
        //             }, (error) => {
        //                 expect(err).not.to.be(null);
        //                 done();
        //             });
        //         });
        //     });

        //     describe('for user#getExamsForever: ', () => {
        //         it('should call fetcher#getUserExams if confirmed.', (done) => {
        //             var examses = [[new Exam('0'), new Exam('1')], [new Exam('2'), new Exam('3')]];
        //             var counter = 0;
        //             confirmObservable = rx.Observable.return(true);
        //             examsObservable = rx.Observable.from(examses);

        //             user.getExamsForever().subscribe((res) => {
        //                 expect(x).to.be(examses[counter++]);
        //                 if (counter === examses.length) { done() };
        //             }, noCallFun);
        //         });

        //         it('should not be able to get exams if confirm failed.', (done) => {
        //             confirmObservable = rx.Observable.return(false);
        //             examsObservable = rx.Observable.return([new Exam('0'), new Exam('1')]);

        //             user.getExamsForever().subscribe((res) => {
        //                 expect(true).to.be(false);
        //             }, (error) => {
        //                 expect(err).not.to.be(null);
        //                 done();
        //             });
        //         });

        //         it('should not be able to get exams if confirm throws.', (done) => {
        //             confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
        //             examsObservable = rx.Observable.return([new Exam('0'), new Exam('1')])

        //             user.getExamsForever().subscribe((res) => {
        //                 expect(true).to.be(false);
        //             }, (error) => {
        //                 expect(err).not.to.be(null);
        //                 done();
        //             });
        //         });
        //     });

        //     describe('for user#getExamsInCache: ', () => {
        //         it('should call seeker#getUserExams if confirmed.', (done) => {
        //             var onlineExams = [new Exam('0'), new Exam('1')];
        //             var offlineExams = [new Exam('2'), new Exam('3')];
        //             confirmObservable = rx.Observable.return(true);
        //             examsObservable = rx.Observable.return(onlineExams);
        //             offlineExamsObservable = rx.Observable.return(offlineExams);

        //             user.getExamsInCache().subscribe((res) => {
        //                 expect(x).to.be(offlineExams);
        //                 done();
        //             }, noCallFun);
        //         });

        //         it('should call seeker#getUserExams if confirm failed.', (done) => {
        //             var onlineExams = [new Exam('0'), new Exam('1')];
        //             var offlineExams = [new Exam('2'), new Exam('3')];
        //             confirmObservable = rx.Observable.return(false);
        //             examsObservable = rx.Observable.return(onlineExams);
        //             offlineExamsObservable = rx.Observable.return(offlineExams);

        //             user.getExamsInCache().subscribe((res) => {
        //                 expect(x).to.be(offlineExams);
        //                 done();
        //             }, noCallFun);
        //         });

        //         it('should call seeker#getUserExams if confirm throws.', (done) => {
        //             var onlineExams = [new Exam('0'), new Exam('1')];
        //             var offlineExams = [new Exam('2'), new Exam('3')];
        //             confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
        //             examsObservable = rx.Observable.return(onlineExams);
        //             offlineExamsObservable = rx.Observable.return(offlineExams);

        //             user.getExamsInCache().subscribe((res) => {
        //                 expect(x).to.be(offlineExams);
        //                 done();
        //             }, noCallFun);
        //         });
        //     });

        //     describe('for user#getExamsWithCache: ', () => {
        //         it('should call fetcher#getUserExams if confirmed.', (done) => {
        //             var onlineExams = [new Exam('0'), new Exam('1')];
        //             var offlineExams = [new Exam('2'), new Exam('3')];
        //             confirmObservable = rx.Observable.return(true);
        //             examsObservable = rx.Observable.return(onlineExams);
        //             offlineExamsObservable = rx.Observable.return(offlineExams);

        //             user.getExamsWithCache().subscribe((res) => {
        //                 expect(x).to.be(onlineExams);
        //                 done();
        //             }, noCallFun);
        //         });

        //         it('should call seeker#getUserExams if confirm failed.', (done) => {
        //             var onlineExams = [new Exam('0'), new Exam('1')];
        //             var offlineExams = [new Exam('2'), new Exam('3')];
        //             confirmObservable = rx.Observable.return(false);
        //             examsObservable = rx.Observable.return(onlineExams);
        //             offlineExamsObservable = rx.Observable.return(offlineExams);

        //             user.getExamsWithCache().subscribe((res) => {
        //                 expect(x).to.be(offlineExams);
        //                 done();
        //             }, noCallFun);
        //         });

        //         it('should call seeker#getUserExams if confirm throws.', (done) => {
        //             var onlineExams = [new Exam('0'), new Exam('1')];
        //             var offlineExams = [new Exam('2'), new Exam('3')];
        //             confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
        //             examsObservable = rx.Observable.return(onlineExams);
        //             offlineExamsObservable = rx.Observable.return(offlineExams);

        //             user.getExamsWithCache().subscribe((res) => {
        //                 expect(x).to.be(offlineExams);
        //                 done();
        //             }, noCallFun);
        //         });
        //     });
        // });
    });
    
    xdescribe('real tests for instance of User: ', () => {
        
    });
});
