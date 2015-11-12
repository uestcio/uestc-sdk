/// <reference path="../../typings/expect.js/expect.js.d.ts"/>
/// <reference path="../../typings/mocha/mocha"/>



import expect = require('expect.js');
import request = require('request');

import {} from '../../src/helpers/parser';
import { TakenCourse } from '../../src/models/course';
import { Procedure, AppSearchCoursesPreProcedure, AppSearchCoursesProcedure, AppSearchPeopleProcedure, UserEnsureLoginProcedure, UserGetIdsProcedure, UserGetSemesterCoursesProcedure, UserLoginProcedure, defaultAppSearchCoursesPreProcedureFactory, defaultAppSearchCoursesProcedureFactory, defaultAppSearchPeopleProcedureFactory, defaultUserEnsureLoginProcedureFactory, defaultUserGetIdsProcedureFactory, defaultUserGetSemesterCoursesProcedureFactory, defaultUserLoginProcedureFactory } from '../../src/models/procedure';
import { User, defaultUserFactory } from '../../src/models/user';

import { defaultMockUserFactory } from '../mocks/models/mock_user';
import { noCallNextFn, noCallErrorFn } from '../mocks/utils/function_util';


describe('Procedure module: ', () => {
    var correctUser: User;
    var incorrectUser: User;

    var correctLoginProcedure: UserLoginProcedure;
    var incorrectLoginProcedure: UserLoginProcedure;

    beforeEach(() => {
        correctUser = defaultMockUserFactory.create('2012019050020', '811073');
        incorrectUser = defaultMockUserFactory.create('2012019050021', '123456');

        correctLoginProcedure = defaultUserLoginProcedureFactory.create().config(correctUser);
        incorrectLoginProcedure = defaultUserLoginProcedureFactory.create().config(incorrectUser);
    });

    it('should have a `Procedure` class.', () => {
        expect(Procedure).to.be.a(Function);
    });

    it('should have a `AppSearchCoursesPreProcedure` class.', () => {
        expect(AppSearchCoursesPreProcedure).to.be.a(Function);
    });

    it('should have a `AppSearchCoursesProcedure` class.', () => {
        expect(AppSearchCoursesProcedure).to.be.a(Function);
    });

    it('should have a `AppSearchPeopleProcedure` class.', () => {
        expect(AppSearchPeopleProcedure).to.be.a(Function);
    });
    
    it('should have a `UserEnsureLoginProcedure` class.', () => {
        expect(UserEnsureLoginProcedure).to.be.a(Function);
    });
    
    it('should have a `UserGetSemesterCoursesPreProcedure` class.', () => {
        expect(UserGetIdsProcedure).to.be.a(Function);
    });
    
    it('should have a `UserGetSemeterCoursesProcedure` class.', () => {
        expect(UserGetSemesterCoursesProcedure).to.be.a(Function);
    });

    it('should have a `UserLoginProcedure` class.', () => {
        expect(UserLoginProcedure).to.be.a(Function);
    });

    describe('instance of AppSearchCoursesProcedure: ', () => {
        var correctPreProcedure: AppSearchCoursesPreProcedure;
        var incorrectPreProcedure: AppSearchCoursesPreProcedure;
        var correctProcedure: AppSearchCoursesProcedure;
        var incorrectProcedure: AppSearchCoursesProcedure;

        beforeEach(() => {
            correctPreProcedure = defaultAppSearchCoursesPreProcedureFactory.create().config(correctUser);
            incorrectPreProcedure = defaultAppSearchCoursesPreProcedureFactory.create().config(incorrectUser);
            correctProcedure = defaultAppSearchCoursesProcedureFactory.create().config({ instructor: '蒲和平' }, correctUser);
            incorrectProcedure = defaultAppSearchCoursesProcedureFactory.create().config({ instructor: '蒲和平' }, incorrectUser);
        });

        it('should be able to get result with correct login procedure, correct pre procedure and correct procedure.', (done) => {
            correctLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return correctPreProcedure.run();
            }).flatMapLatest((preRes) => {
                expect(preRes.result).to.be(true);
                return correctProcedure.run();
            }).subscribe((res) => {
                expect(res.result).to.be.an(Array);
                expect(res.result.length).to.greaterThan(0);
                expect(res.result[0]).to.have.property('instructors');
                expect(res.result[0].instructors).to.be.a(Array);
                expect(res.result[0].instructors.length).not.to.be(0);
                expect(res.result[0].instructors[0]).to.be('蒲和平');
                done();
            }, noCallErrorFn);
        });

        it('should not be able to get result with correct login procedure, correct pre procedure and incorrect procedure.', (done) => {
            correctLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return correctPreProcedure.run();
            }).flatMapLatest((preRes) => {
                expect(preRes.result).to.be(true);
                return incorrectProcedure.run();
            }).subscribe((res) => {
                expect(res.response.statusCode).to.be(302);
                done();
            }, noCallErrorFn);
        });

        it('should not be able to get result with correct login procedure, incorrect pre procedure and correct procedure.', (done) => {
            correctLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return incorrectPreProcedure.run();
            }).flatMapLatest((preRes) => {
                expect(preRes.result).to.be(true);
                return correctProcedure.run();
            }).subscribe((res) => {
                expect(res.response.statusCode).to.be(500);
                done();
            }, noCallErrorFn);
        });

        it('should not be able to get result with correct login procedure, incorrect pre procedure and incorrect procedure.', (done) => {
            correctLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return incorrectPreProcedure.run();
            }).flatMapLatest((preRes) => {
                expect(preRes.result).to.be(true);
                return incorrectProcedure.run();
            }).subscribe((res) => {
                expect(res.response.statusCode).to.be(302);
                done();
            }, noCallErrorFn);
        });

        it('should be able to get result with incorrect login procedure, correct pre procedure and correct procedure.', (done) => {
            incorrectLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return correctPreProcedure.run();
            }).flatMapLatest((preRes) => {
                expect(preRes.result).to.be(true);
                return correctProcedure.run();
            }).subscribe(noCallNextFn, (error) => {
                expect(error).to.be.an(Error);
                done();
            });
        });

        it('should not be able to get result with incorrect login procedure, correct pre procedure and incorrect procedure.', (done) => {
            incorrectLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return correctPreProcedure.run();
            }).flatMapLatest((preRes) => {
                expect(preRes.result).to.be(true);
                return incorrectProcedure.run();
            }).subscribe(noCallNextFn, (error) => {
                expect(error).to.be.an(Error);
                done();
            });
        });

        it('should not be able to get result with incorrect login procedure, incorrect pre procedure and correct procedure.', (done) => {
            incorrectLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return incorrectPreProcedure.run();
            }).flatMapLatest((preRes) => {
                expect(preRes.result).to.be(true);
                return correctProcedure.run();
            }).subscribe(noCallNextFn, (error) => {
                expect(error).to.be.an(Error);
                done();
            });
        });

        it('should not be able to get result with incorrect login procedure, incorrect pre procedure and incorrect procedure.', (done) => {
            incorrectLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return incorrectPreProcedure.run();
            }).flatMapLatest((preRes) => {
                expect(preRes.result).to.be(true);
                return incorrectProcedure.run();
            }).subscribe(noCallNextFn, (error) => {
                expect(error).to.be.an(Error);
                done();
            });
        });


        it('should not be able to get result without login procedure.', (done) => {
            correctPreProcedure.run().flatMapLatest((preRes) => {
                expect(preRes.result).to.be(true);
                return correctProcedure.run();
            }).subscribe((res) => {
                expect(res.response.statusCode).to.be(302);
                done();
            }, noCallErrorFn);
        });

        it('should not be able to get result without pre procedure.', (done) => {
            correctLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return correctProcedure.run();
            }).subscribe((res) => {
                expect(res.response.statusCode).to.be(500);
                done();
            }, noCallErrorFn);
        });
    });

    describe('instance of AppSearchPeopleProcedure', () => {
        var correctProcedure: AppSearchPeopleProcedure;
        var incorrectProcedure: AppSearchPeopleProcedure;

        beforeEach(() => {
            correctProcedure = defaultAppSearchPeopleProcedureFactory.create().config({ term: '2012019050020' }, correctUser);
            incorrectProcedure = defaultAppSearchPeopleProcedureFactory.create().config({ term: '2012019050020' }, incorrectUser);
        });

        it('should be able to get result with correct login procedure and correct procedure.', (done) => {
            correctLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return correctProcedure.run();
            }).subscribe((res) => {
                expect(res.result).to.be.an(Array);
                expect(res.result.length).not.to.be(0);
                expect(res.result[0]).to.be.an(Object);
                expect(res.result[0]).to.have.property('id');
                expect(res.result[0].id).to.be('2012019050020');
                done();
            }, noCallErrorFn);
        });

        it('should not be able to get result with correct login procedure and incorrect procedure.', (done) => {
            correctLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return incorrectProcedure.run();
            }).subscribe(noCallNextFn, (error) => {
                expect(error).to.be.an(Error);
                done();
            });
        });

        it('should not be able to get result with incorrect login procedure and correct procedure.', (done) => {
            incorrectLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return correctProcedure.run();
            }).subscribe(noCallNextFn, (error) => {
                expect(error).to.be.an(Error);
                done();
            });
        });

        it('should not be able to get result with incorrect login procedure and incorrect procedure.', (done) => {
            incorrectLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return incorrectProcedure.run();
            }).subscribe(noCallNextFn, (error) => {
                expect(error).to.be.an(Error);
                done();
            });
        });

        it('should not be able to call parser#getAppPeople without login procedure', (done) => {
            correctProcedure.run().subscribe(noCallNextFn, function(error) {
                expect(error).to.be.an(Error);
                done();
            });
        });
    });
    
    describe('instance of UserEnsureLoginProcedure: ', () => {
        var correctEnsureLoginProcedure: UserEnsureLoginProcedure;
        var incorrectEnsureLoginProcedure: UserEnsureLoginProcedure;

        beforeEach(() => {
            correctEnsureLoginProcedure = defaultUserLoginProcedureFactory.create().config(correctUser);
            incorrectEnsureLoginProcedure = defaultUserLoginProcedureFactory.create().config(incorrectUser);
        });

        it('should return true with user still in active.', (done) => {
            correctLoginProcedure.run().flatMapLatest((res) => {
                expect(res.result).to.be(true);
                return correctEnsureLoginProcedure.run();
            }).subscribe((res) => {
                expect(res.result).to.be(true);
                done();
            }, noCallErrorFn);
        });

        it('should return true with user not in active and auto login succeed.', (done) => {
            correctEnsureLoginProcedure.run().subscribe(function(outRes) {
                expect(outRes.result).to.be(true);
                done();
            }, noCallErrorFn);
        });
    });
    
    xdescribe('instance of UserGetSemesterCoursesProcedure: ', () => {
        var idsProcedure: UserGetIdsProcedure;
        var correctProcedure: UserGetSemesterCoursesProcedure;
        var incorrectProcedure: UserGetSemesterCoursesProcedure;

        beforeEach(() => {
            correctUser.ids = '97837';
            incorrectUser.ids = '12345';
            
            idsProcedure = defaultUserGetIdsProcedureFactory.create().config(correctUser);
            correctProcedure = defaultUserGetSemesterCoursesProcedureFactory.create().config({ semester: '43' }, correctUser);
            incorrectProcedure = defaultUserGetSemesterCoursesProcedureFactory.create().config({ semester: '43' }, incorrectUser);
        });

        it('should be able to get result with correct login procedure and correct procedure.', (done) => {
            correctLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
            //     return idsProcedure.run();
            // }).flatMapLatest((idsRes) => {
            //     expect(idsRes.result).to.be('97837');
                return correctProcedure.run();
            }).subscribe((res) => {
                console.log(res.result);
                console.log(res.response.statusCode);
                console.log(res.body);
                expect(res.result).to.be.an(Array);
                expect(res.result.length).to.be(12);
                expect(res.result[0]).to.be.a(TakenCourse);
                expect(res.result[0].id).to.be('B1600360.31');
                done();
            }, noCallErrorFn);
        });

        it('should not be able to get result with correct login procedure and incorrect procedure.', (done) => {
            correctLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return idsProcedure.run();
            }).flatMapLatest((idsRes) => {
                expect(idsRes.result).to.be('97837');
                return incorrectProcedure.run();
            }).subscribe((res) => {
                expect(res.response.statusCode).to.be(302);
                done();
            }, noCallErrorFn);
        });

        it('should be able to get result with incorrect login procedure and correct procedure.', (done) => {
            incorrectLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return idsProcedure.run();
            }).flatMapLatest((idsRes) => {
                expect(idsRes.result).to.be('97837');
                correctUser.ids = idsRes.result;
                return correctProcedure.run();
            }).subscribe(noCallNextFn, (error) => {
                expect(error).to.be.an(Error);
                done();
            });
        });

        it('should not be able to get result with incorrect login procedure and incorrect procedure.', (done) => {
            incorrectLoginProcedure.run().flatMapLatest((loginRes) => {
                expect(loginRes.result).to.be(true);
                return idsProcedure.run();
            }).flatMapLatest((idsRes) => {
                expect(idsRes.result).to.be('97837');
                correctUser.ids = idsRes.result;
                return incorrectProcedure.run();
            }).subscribe(noCallNextFn, (error) => {
                expect(error).to.be.an(Error);
                done();
            });
        });
    });

    describe('instance of UserLoginProcedure: ', () => {

        it('should return true with correct id and password.', (done) => {
            correctLoginProcedure.run().subscribe((res) => {
                expect(res.result).to.be(true);
                done();
            }, noCallErrorFn);
        });

        it('should return false with incorrect id and password.', (done) => {
            incorrectLoginProcedure.run().subscribe((res) => {
                expect(res.result).to.be(false);
                done();
            }, noCallErrorFn);
        });
    });

    

});
