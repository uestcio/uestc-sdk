/// <reference path="../typings/node/node"/>
/// <reference path="../typings/expect.js/expect.js.d.ts"/>
/// <reference path="../typings/rx/rx"/>
/// <reference path="../typings/mocha/mocha"/>

import assert = require('assert');
import expect = require('expect.js');
import rx = require('rx');

import { Application, defaultApplication } from '../src/application';
import {  } from '../src/helpers/cacher';
import {  } from '../src/helpers/caller';
import {  } from '../src/models/course';
import {  } from '../src/helpers/fetcher';
import {  } from '../src/models/person';
import {  } from '../src/helpers/seeker';
import { User } from '../src/models/user';

import { MockCacher } from './mocks/helpers/mock_cacher';
import { MockCaller } from './mocks/helpers/mock_caller';
import { MockFetcher } from './mocks/helpers/mock_fetcher';
import { MockSeeker } from './mocks/helpers/mock_seeker';
import { MockCourseFactory } from './mocks/models/mock_course';
import { MockPersonFactory } from './mocks/models/mock_person';
import { MockUser, MockUserFactory } from './mocks/models/mock_user';

var noCallFun = (error?: any) => {
    throw error;
}

describe('Application module: ', () => {

    it('should have an `app` property.', () => {
        expect(defaultApplication).to.be.a(Application);
    });

    it('should have an `Application` class.', () => {
        expect(Application).to.be.a(Function);
    });

    describe('mock tests for instance of Application: ', () => {
        var application: Application;
        var fetcher: MockFetcher;
        var seeker: MockSeeker;
        var courseFactory: MockCourseFactory;
        var personFactory: MockPersonFactory;
        
        before(() => {
            fetcher = new MockFetcher();
            seeker = new MockSeeker();
            courseFactory = new MockCourseFactory();
            personFactory = new MockPersonFactory();
        })

        beforeEach(() => {
            application = new Application(new MockUserFactory(), new MockCacher(), new MockCaller(), fetcher, seeker);
        });

        describe('should have proper properties and methods: ', () => {
            it('should have exact properties.', () => {
                expect(application).to.have.property('currentUser');
                expect(application.currentUser).to.be(null);
            });

            it('should have exact methods.', () => {
                expect(application).to.have.property('one');
                expect(application.one).to.be.a(Function);

                expect(application).to.have.property('register');
                expect(application.register).to.be.a(Function);

                expect(application).to.have.property('searchForCourses');
                expect(application.searchForCourses).to.be.a(Function);

                expect(application).to.have.property('searchForCoursesInCache');
                expect(application.searchForCoursesInCache).to.be.a(Function);

                expect(application).to.have.property('searchForCoursesWithCache');
                expect(application.searchForCoursesWithCache).to.be.a(Function);

                expect(application).to.have.property('searchForPeople');
                expect(application.searchForPeople).to.be.a(Function);

                expect(application).to.have.property('searchForPeopleInCache');
                expect(application.searchForPeopleInCache).to.be.a(Function);

                expect(application).to.have.property('searchForPeopleWithCache');
                expect(application.searchForPeopleWithCache).to.be.a(Function);
            });
        });

        describe('should be able to register and get user:', () => {

            it('should be able to get the null if the user is not register.', () => {
                expect(application.one('2012019050031')).to.be(null);
            });

            it('should be able to register a user.', () => {
                application.register('2012019050031', '******');
                var user = <MockUser>application.one('2012019050031');
                user.confirmResult = true;

                expect(user).to.be.a(User);
                expect(user.id).to.be('2012019050031');
                expect(user.password).to.be('******');
                expect(user.confirmCount).to.be(1);
                expect(application.currentUser).to.be(user);
                
                application.register('2012019050032', '******');
                var anotherUser = <MockUser>application.one('2012019050032');
                anotherUser.confirmResult = true;
                
                expect(anotherUser.confirmCount).to.be(1);
                expect(anotherUser).to.be.a(User);
                expect(anotherUser.id).to.be('2012019050032');
            });
        });

        describe('should be able to search courses: ', () => {
            beforeEach(() => {
                fetcher.courses = [courseFactory.create('0'), courseFactory.create('1')];
                seeker.courses = [courseFactory.create('0')];
            });

            describe('for app#searchForCourses: ', () => {
                it('should call fetcher#searchForCourses if user exists.', (done) => {
                    application.register('2012019050031', '******');

                    expect(application.currentUser).to.be.an(User);
                    expect(application.currentUser.id).to.be('2012019050031');

                    application.searchForCourses({}).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(2);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should not be able to search if no user is registered.', (done) => {
                    expect(application.currentUser).to.be(null);

                    application.searchForCourses({}).subscribe(noCallFun, (error) => {
                        expect(error).to.be.an(Error);
                        done();
                    });
                });

                it('should be able to use callback without user.', (done) => {
                    application.searchForCourses({}, (err, res) => {
                        expect(err).to.be.an(Error);
                        expect(res).to.be(null);
                        done();
                    });
                });

                it('should be able to use callback with user.', (done) => {
                    application.register('2012019050031', '******');

                    application.searchForCourses({}, (err, courses) => {
                        expect(err).to.be(null);
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(2);
                        expect(courses[0].id).to.be('0');
                        done();
                    });
                });
            });

            describe('for app#searchForCoursesInCache: ', () => {
                it('should call seeker#searchForCourses with a user.', (done) => {
                    application.register('2012019050031', '******');

                    expect(application.currentUser).to.be.an(User);

                    application.searchForCoursesInCache({}).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should call Seeker#searchForCourses without a user.', (done) => {
                    expect(application.currentUser).to.be(null);

                    application.searchForCoursesInCache({}).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should be able to use callback with user.', (done) => {
                    application.register('2012019050031', '******');

                    application.searchForCoursesInCache({}, (err, courses) => {
                        expect(err).to.be(null);
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0].id).to.be('0');
                        done();
                    });
                });

                it('should be able to use callback without user.', (done) => {
                    application.searchForCoursesInCache({}, (err, courses) => {
                        expect(err).to.be(null);
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0].id).to.be('0');
                        done();
                    });
                });
            });

            describe('for app#searchForCoursesWithCache: ', () => {
                it('should call Fetcher#searchForCourses with a user.', (done) => {
                    application.register('2012019050031', '******');

                    expect(application.currentUser).not.to.be(null);

                    application.searchForCoursesWithCache({}).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(2);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should call Seeker#searchForCourses without a user.', (done) => {
                    expect(application.currentUser).to.be(null);

                    application.searchForCoursesWithCache({}).subscribe((courses) => {
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should be able to use callback with user.', (done) => {
                    application.register('2012019050031', '******');

                    application.searchForCoursesWithCache({}, (err, courses) => {
                        expect(err).to.be(null);
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(2);
                        expect(courses[0].id).to.be('0');
                        done();
                    });
                });

                it('should be able to use callback without user.', (done) => {
                    application.searchForCoursesWithCache({}, (err, courses) => {
                        expect(err).to.be(null);
                        expect(courses).to.be.an(Array);
                        expect(courses.length).to.be(1);
                        expect(courses[0].id).to.be('0');
                        done();
                    });
                });
            });
        });

        describe('should be able to search people: ', () => {
            beforeEach(() => {
                fetcher.people = [personFactory.create('0'), personFactory.create('1')];
                seeker.people = [personFactory.create('0')];
            });

            describe('for app#searchForPeople: ', () => {
                it('should call Fetcher#searchForPeople if user exists.', (done) => {
                    application.register('2012019050031', '******');
                    
                    expect(application.currentUser).not.to.be(null);

                    application.searchForPeople({}).subscribe((people) => {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(2);
                        expect(people[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should not be able to search if no user is registered.', (done) => {
                    expect(application.currentUser).to.be(null);

                    application.searchForPeople({}).subscribe(noCallFun, (error) => {
                        expect(error).to.be.an(Error);
                        done();
                    });
                });

                it('should be able to use callback with user.', (done) => {
                    application.register('2012019050031', '******');
                    
                    application.searchForPeople({}, (err, people) => {
                        expect(err).to.be(null);
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(2);
                        expect(people[0].id).to.be('0');
                        done();
                    });
                });

                it('should be able to use callback without user.', (done) => {
                    application.searchForPeople({}, (err, people) => {
                        expect(err).to.be.an(Error);
                        expect(people).to.be(null);
                        done();
                    });
                });
            });

            describe('for app#searchForPeopleInCache: ', () => {
                it('should call Seeker#searchForPeople with a user.', (done) => {
                    application.register('2012019050031', '******');
                    
                    expect(application.currentUser).not.to.be(null);

                    application.searchForPeopleInCache({}).subscribe((people) => {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(1);
                        expect(people[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should call Seeker#searchForPeople without a user.', (done) => {
                    expect(application.currentUser).to.be(null);

                    application.searchForPeopleInCache({}).subscribe((people) => {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(1);
                        expect(people[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should be able to use callback with user.', (done) => {
                    application.register('2012019050031', '******');
                    
                    application.searchForPeopleInCache({}, (err, people) => {
                        expect(err).to.be(null);
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(1);
                        expect(people[0].id).to.be('0');
                        done();
                    });
                });

                it('should be able to use callback without user.', (done) => {
                    application.searchForPeopleInCache({}, (err, people) => {
                        expect(err).to.be(null);
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(1);
                        expect(people[0].id).to.be('0');
                        done();
                    });
                });
            });

            describe('for app#searchForPeopleWithCache: ', () => {
                it('should call Fetcher#searchForPeople with a user.', (done) => {
                    application.register('2012019050031', '******');
                    
                    expect(application.currentUser).to.be.an(User);

                    application.searchForPeopleWithCache({}).subscribe((people) => {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(2);
                        expect(people[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should call Seeker#searchForPeople without a user.', (done) => {
                    expect(application.currentUser).to.be(null);

                    application.searchForPeopleWithCache({}).subscribe((people) => {
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(1);
                        expect(people[0].id).to.be('0');
                        done();
                    }, noCallFun);
                });

                it('should be able to use callback with user.', (done) => {
                    application.register('2012019050031', '******');
                    
                    application.searchForPeopleWithCache({}, (err, people) => {
                        expect(err).to.be(null);
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(2);
                        expect(people[0].id).to.be('0');
                        done();
                    });
                });

                it('should be able to use callback without user.', (done) => {
                    application.searchForPeopleWithCache({}, (err, people) => {
                        expect(err).to.be(null);
                        expect(people).to.be.an(Array);
                        expect(people.length).to.be(1);
                        expect(people[0].id).to.be('0');
                        done();
                    });
                });
            });
        });
    });
    
    xdescribe('real tests for instance of Application: ', () => {
        
    });
});
