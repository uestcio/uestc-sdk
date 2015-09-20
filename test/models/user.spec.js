var assert = require('assert');
var expect = require('expect.js');
var rx = require('rx');

var Course = require('../../dist/models/course').Course;
var Exam = require('../../dist/models/exam').Exam;
var Fetcher = require('../../dist/helpers/fetcher').Fetcher;
var Seeker = require('../../dist/helpers/seeker').Seeker;
var userModule = require('../../dist/models/user');

var noCallFun = function (err) {
    throw err;
}

describe('User module: ' , function () {
    var originalFetcherConfirmUser = Fetcher.prototype.comfirmUser;
    var originalFetcherGetUserDetail = Fetcher.prototype.getUserDetail;
    
    after(function () {
        Fetcher.prototype.confirmUser = originalFetcherConfirmUser;
        Fetcher.prototype.getUserDetail = originalFetcherGetUserDetail;
    });
    
    it('should have an `User` class.', function () {
        expect(userModule).to.have.property('User');
        expect(userModule.User).to.be.a('function');
    });
    
    it('should have an `UserFactory` class.', function () {
        expect(userModule).to.have.property('UserFactory');
        expect(userModule.User).to.be.a('function');
    });
    
    describe('instance of User: ', function () {
        var user;
        
        beforeEach(function () {
            user = new userModule.User('2012019050031', '******');
        });
        
        describe('should have proper properties and methods: ', function () {
            it('should have exact properties: ', function () {
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
            
            it('should have exact methods.', function () {
                expect(user).to.have.property('confirm');
                expect(user.confirm).to.be.a('function');
                
                expect(user).to.have.property('getCourses');
                expect(user.getCourses).to.be.a('function');
                
                expect(user).to.have.property('getCoursesForever');
                expect(user.getCoursesForever).to.be.a('function');
                
                expect(user).to.have.property('getCoursesInCache');
                expect(user.getCoursesInCache).to.be.a('function');
                
                expect(user).to.have.property('getCoursesWithCache');
                expect(user.getCoursesWithCache).to.be.a('function');
                
                expect(user).to.have.property('getExams');
                expect(user.getExams).to.be.a('function');
                
                expect(user).to.have.property('getExamsForever');
                expect(user.getExamsForever).to.be.a('function');
                
                expect(user).to.have.property('getExamsInCache');
                expect(user.getExamsInCache).to.be.a('function');
                
                expect(user).to.have.property('getExamsWithCache');
                expect(user.getExamsWithCache).to.be.a('function');
                
                expect(user).to.have.property('getDetail');
                expect(user.getDetail).to.be.a('function');
            });
        });
        
        describe('should be able to confirm and get detail: ', function () {
            var confirmCount, detailCount, confirmResult, detailResult;
            
            before(function () {
                Fetcher.prototype.confirmUser = function () {
                    confirmCount++;
                    return rx.Observable.return(confirmResult);
                };
                
                Fetcher.prototype.getUserDetail = function () {
                    detailCount++;
                    return rx.Observable.return(detailResult);
                };
            });
            
            beforeEach(function () {
                confirmCount = 0;
                detailCount = 0;
            })
            
            it('should not confirm itself if not called.', function () {
                expect(confirmCount).to.be(0);
                expect(detailCount).to.be(0);
            });
            
            it('should get detail if called confirm and succeed.', function (done) {
                confirmResult = true;
                detailResult = { id: '2012019050031' };
                
                user.confirm().subscribe(function (res) {
                    expect(res).to.be(true);
                    expect(confirmCount).to.be(1);
                    expect(detailCount).to.be(1);
                    done();
                }, noCallFun);
            });
            
            it('should not get detail if confirm failed.', function (done) {
                confirmResult = false;
                
                user.confirm().subscribe(function (res) {
                    expect(res).to.be(false);
                    expect(confirmCount).to.be(1);
                    expect(detailCount).to.be(0);
                    done();
                }, noCallFun);
            })
        });
        
        describe('should be able to get taken courses: ', function () {
            var confirmObservable, coursesObservable, offlineCoursesObservable;
            
            before(function () {
                Fetcher.prototype.confirmUser = function () {
                    return confirmObservable;
                };
                                
                Fetcher.prototype.getUserCourses = function () {
                    return coursesObservable;
                };
                
                Fetcher.prototype.getUserDetail = function () {
                    return rx.Observable.return({ id: '2012019050031' });
                };
                
                Seeker.prototype.getUserCourses = function () {
                    return offlineCoursesObservable;
                };
            });
            
            describe('for user#getCourses: ', function () {
                it('should call fetcher#getUserCourses from getCourses if confirmed.', function (done) {
                    var courses = [new Course('0'), new Course('1')];
                    confirmObservable = rx.Observable.return(true);
                    coursesObservable = rx.Observable.return(courses);
                    
                    user.getCourses().subscribe(function (x) {
                        expect(x).to.be(courses);
                        done();
                    }, noCallFun);
                });
                
                it('should not be able to get courses if confirm failed.', function (done) {
                    confirmObservable = rx.Observable.return(false);
                    coursesObservable = rx.Observable.return([new Course('0'), new Course('1')]);
                    
                    user.getCourses().subscribe(function (x) {
                        expect(true).to.be(false);
                    }, function (err) {
                        expect(err).not.to.be(null);
                        done();
                    });
                });
                
                it('should not be able to get courses if confirm throws.', function (done) {
                    confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
                    coursesObservable = rx.Observable.return([new Course('0'), new Course('1')])
                    
                    user.getCourses().subscribe(function (x) {
                        expect(true).to.be(false);
                    }, function (err) {
                        expect(err).not.to.be(null);
                        done();
                    });
                });
            });
            
            describe('for user#getCoursesForever: ', function () {
                it('should call fetcher#getUserCourses if confirmed.', function (done) {
                    var courseses = [[new Course('0'), new Course('1')], [new Course('2'), new Course('3')]];
                    var counter = 0;
                    confirmObservable = rx.Observable.return(true);
                    coursesObservable = rx.Observable.from(courseses);
                    
                    user.getCoursesForever().subscribe(function (x) {
                        expect(x).to.be(courseses[counter++]);
                        if(counter === courseses.length) { done() };
                    }, noCallFun);
                });
                
                it('should not be able to get courses if confirm failed.', function (done) {
                    confirmObservable = rx.Observable.return(false);
                    coursesObservable = rx.Observable.return([new Course('0'), new Course('1')]);
                    
                    user.getCoursesForever().subscribe(function (x) {
                        expect(true).to.be(false);
                    }, function (err) {
                        expect(err).not.to.be(null);
                        done();
                    });
                });
                
                it('should not be able to get courses if confirm throws.', function (done) {
                    confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
                    coursesObservable = rx.Observable.return([new Course('0'), new Course('1')])
                    
                    user.getCoursesForever().subscribe(function (x) {
                        expect(true).to.be(false);
                    }, function (err) {
                        expect(err).not.to.be(null);
                        done();
                    });
                });
            });
            
            describe('for user#getCoursesInCache: ', function () {
                it('should call seeker#getUserCourses if confirmed.', function (done) {
                    var onlineCourses = [new Course('0'), new Course('1')];
                    var offlineCourses = [new Course('2'), new Course('3')];
                    confirmObservable = rx.Observable.return(true);
                    coursesObservable = rx.Observable.return(onlineCourses);
                    offlineCoursesObservable = rx.Observable.return(offlineCourses);
                    
                    user.getCoursesInCache().subscribe(function (x) {
                        expect(x).to.be(offlineCourses);
                        done();
                    }, noCallFun);
                });
                
                it('should call seeker#getUserCourses if confirm failed.', function (done) {
                    var onlineCourses = [new Course('0'), new Course('1')];
                    var offlineCourses = [new Course('2'), new Course('3')];
                    confirmObservable = rx.Observable.return(false);
                    coursesObservable = rx.Observable.return(onlineCourses);
                    offlineCoursesObservable = rx.Observable.return(offlineCourses);
                    
                    user.getCoursesInCache().subscribe(function (x) {
                        expect(x).to.be(offlineCourses);
                        done();
                    }, noCallFun);
                });
                
                it('should call seeker#getUserCourses if confirm throws.', function (done) {
                    var onlineCourses = [new Course('0'), new Course('1')];
                    var offlineCourses = [new Course('2'), new Course('3')];
                    confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
                    coursesObservable = rx.Observable.return(onlineCourses);
                    offlineCoursesObservable = rx.Observable.return(offlineCourses);
                    
                    user.getCoursesInCache().subscribe(function (x) {
                        expect(x).to.be(offlineCourses);
                        done();
                    }, noCallFun);
                });
            });

            describe('for user#getCoursesWithCache: ', function () {
                it('should call fetcher#getUserCourses if confirmed.', function (done) {
                    var onlineCourses = [new Course('0'), new Course('1')];
                    var offlineCourses = [new Course('2'), new Course('3')];
                    confirmObservable = rx.Observable.return(true);
                    coursesObservable = rx.Observable.return(onlineCourses);
                    offlineCoursesObservable = rx.Observable.return(offlineCourses);
                    
                    user.getCoursesWithCache().subscribe(function (x) {
                        expect(x).to.be(onlineCourses);
                        done();
                    }, noCallFun);
                });
                
                it('should call seeker#getUserCourses if confirm failed.', function (done) {
                    var onlineCourses = [new Course('0'), new Course('1')];
                    var offlineCourses = [new Course('2'), new Course('3')];
                    confirmObservable = rx.Observable.return(false);
                    coursesObservable = rx.Observable.return(onlineCourses);
                    offlineCoursesObservable = rx.Observable.return(offlineCourses);
                    
                    user.getCoursesWithCache().subscribe(function (x) {
                        expect(x).to.be(offlineCourses);
                        done();
                    }, noCallFun);
                });
                
                it('should call seeker#getUserCourses if confirm throws.', function (done) {
                    var onlineCourses = [new Course('0'), new Course('1')];
                    var offlineCourses = [new Course('2'), new Course('3')];
                    confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
                    coursesObservable = rx.Observable.return(onlineCourses);
                    offlineCoursesObservable = rx.Observable.return(offlineCourses);
                    
                    user.getCoursesWithCache().subscribe(function (x) {
                        expect(x).to.be(offlineCourses);
                        done();
                    }, noCallFun);
                });
            });
        });
        
        describe('should be able to get exams: ', function () {
            var confirmObservable, examsObservable, offlineExamsObservable;
            
            before(function () {
                Fetcher.prototype.confirmUser = function () {
                    return confirmObservable;
                };
                
                Fetcher.prototype.getUserDetail = function () {
                    return rx.Observable.return({ id: '2012019050031' });
                };
                                                
                Fetcher.prototype.getUserExams = function () {
                    return examsObservable;
                };
                
                Seeker.prototype.getUserExams = function () {
                    return offlineExamsObservable;
                };
            });
            
            describe('for user#getExams: ', function () {
                it('should call fetcher#getUserExams from getExams if confirmed.', function (done) {
                    var exams = [new Exam('0'), new Exam('1')];
                    confirmObservable = rx.Observable.return(true);
                    examsObservable = rx.Observable.return(exams);
                    
                    user.getExams().subscribe(function (x) {
                        expect(x).to.be(exams);
                        done();
                    }, noCallFun);
                });
                
                it('should not be able to get exams if confirm failed.', function (done) {
                    confirmObservable = rx.Observable.return(false);
                    examsObservable = rx.Observable.return([new Exam('0'), new Exam('1')]);
                    
                    user.getExams().subscribe(function (x) {
                        expect(true).to.be(false);
                    }, function (err) {
                        expect(err).not.to.be(null);
                        done();
                    });
                });
                
                it('should not be able to get exams if confirm throws.', function (done) {
                    confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
                    examsObservable = rx.Observable.return([new Exam('0'), new Exam('1')])
                    
                    user.getExams().subscribe(function (x) {
                        expect(true).to.be(false);
                    }, function (err) {
                        expect(err).not.to.be(null);
                        done();
                    });
                });
            });
            
            describe('for user#getExamsForever: ', function () {
                it('should call fetcher#getUserExams if confirmed.', function (done) {
                    var examses = [[new Exam('0'), new Exam('1')], [new Exam('2'), new Exam('3')]];
                    var counter = 0;
                    confirmObservable = rx.Observable.return(true);
                    examsObservable = rx.Observable.from(examses);
                    
                    user.getExamsForever().subscribe(function (x) {
                        expect(x).to.be(examses[counter++]);
                        if(counter === examses.length) { done() };
                    }, noCallFun);
                });
                
                it('should not be able to get exams if confirm failed.', function (done) {
                    confirmObservable = rx.Observable.return(false);
                    examsObservable = rx.Observable.return([new Exam('0'), new Exam('1')]);
                    
                    user.getExamsForever().subscribe(function (x) {
                        expect(true).to.be(false);
                    }, function (err) {
                        expect(err).not.to.be(null);
                        done();
                    });
                });
                
                it('should not be able to get exams if confirm throws.', function (done) {
                    confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
                    examsObservable = rx.Observable.return([new Exam('0'), new Exam('1')])
                    
                    user.getExamsForever().subscribe(function (x) {
                        expect(true).to.be(false);
                    }, function (err) {
                        expect(err).not.to.be(null);
                        done();
                    });
                });
            });
            
            describe('for user#getExamsInCache: ', function () {
                it('should call seeker#getUserExams if confirmed.', function (done) {
                    var onlineExams = [new Exam('0'), new Exam('1')];
                    var offlineExams = [new Exam('2'), new Exam('3')];
                    confirmObservable = rx.Observable.return(true);
                    examsObservable = rx.Observable.return(onlineExams);
                    offlineExamsObservable = rx.Observable.return(offlineExams);
                    
                    user.getExamsInCache().subscribe(function (x) {
                        expect(x).to.be(offlineExams);
                        done();
                    }, noCallFun);
                });
                
                it('should call seeker#getUserExams if confirm failed.', function (done) {
                    var onlineExams = [new Exam('0'), new Exam('1')];
                    var offlineExams = [new Exam('2'), new Exam('3')];
                    confirmObservable = rx.Observable.return(false);
                    examsObservable = rx.Observable.return(onlineExams);
                    offlineExamsObservable = rx.Observable.return(offlineExams);
                    
                    user.getExamsInCache().subscribe(function (x) {
                        expect(x).to.be(offlineExams);
                        done();
                    }, noCallFun);
                });
                
                it('should call seeker#getUserExams if confirm throws.', function (done) {
                    var onlineExams = [new Exam('0'), new Exam('1')];
                    var offlineExams = [new Exam('2'), new Exam('3')];
                    confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
                    examsObservable = rx.Observable.return(onlineExams);
                    offlineExamsObservable = rx.Observable.return(offlineExams);
                    
                    user.getExamsInCache().subscribe(function (x) {
                        expect(x).to.be(offlineExams);
                        done();
                    }, noCallFun);
                });
            });

            describe('for user#getExamsWithCache: ', function () {
                it('should call fetcher#getUserExams if confirmed.', function (done) {
                    var onlineExams = [new Exam('0'), new Exam('1')];
                    var offlineExams = [new Exam('2'), new Exam('3')];
                    confirmObservable = rx.Observable.return(true);
                    examsObservable = rx.Observable.return(onlineExams);
                    offlineExamsObservable = rx.Observable.return(offlineExams);
                    
                    user.getExamsWithCache().subscribe(function (x) {
                        expect(x).to.be(onlineExams);
                        done();
                    }, noCallFun);
                });
                
                it('should call seeker#getUserExams if confirm failed.', function (done) {
                    var onlineExams = [new Exam('0'), new Exam('1')];
                    var offlineExams = [new Exam('2'), new Exam('3')];
                    confirmObservable = rx.Observable.return(false);
                    examsObservable = rx.Observable.return(onlineExams);
                    offlineExamsObservable = rx.Observable.return(offlineExams);
                    
                    user.getExamsWithCache().subscribe(function (x) {
                        expect(x).to.be(offlineExams);
                        done();
                    }, noCallFun);
                });
                
                it('should call seeker#getUserExams if confirm throws.', function (done) {
                    var onlineExams = [new Exam('0'), new Exam('1')];
                    var offlineExams = [new Exam('2'), new Exam('3')];
                    confirmObservable = rx.Observable.throw(new Error('000: Fake error.'));
                    examsObservable = rx.Observable.return(onlineExams);
                    offlineExamsObservable = rx.Observable.return(offlineExams);
                    
                    user.getExamsWithCache().subscribe(function (x) {
                        expect(x).to.be(offlineExams);
                        done();
                    }, noCallFun);
                });
            });
        });
    });
});
