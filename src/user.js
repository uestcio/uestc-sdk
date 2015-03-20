// 外部依赖

var _ = require('lodash');
var Promise = require('promise');

var Carrier = require('./helpers/carrier');
var Course = require('./structure/course');
var Duration = require('./structure/duration');
var Score = require('./structure/score');
var Parser = require('./helpers/parser');
var Encoder = require('./helpers/encoder');
var Peeler = require('./helpers/peeler');
var UrlUtil = require('./helpers/urlutil');
var StdDetail = require('./structure/stddetail');

// 构造方法

function User(number, password) {
    this._number_ = number;
    this._password_ = password;
    this._status_ = User.status.idle;
    this._jar_ = Carrier.jar();
    this._courses_ = {};
    this._detail_ = new StdDetail(number);
    this._carrier_ = Carrier;
}

module.exports = User;


// 静态字段

User.status = {
    idle: 0,
    loginSuccess: 1,
    loginFail: 2
};


// 静态方法


// 实例方法

User.prototype.getCourses = function (grade, semester) {
    var self = this;
    if (grade == 0) {
        return self.__getAllCourses__();
    }
    else {
        var semesterId = Encoder.getSemester(grade, semester);
        return self.__getSemesterCourses__(semesterId);
    }
};

User.prototype.getExams = function (grade, semester) {
    var self = this;
    if (grade == 0) {
        return Promise.resolve([]);
    }
    else {
        var semesterId = Encoder.getSemester(grade, semester);
        return self.__getSemesterExams__(semesterId);
    }
};

User.prototype.getDetail = function () {
    var self = this;
    return self.__getDetailOnline__().then(null, function (err) {
        return self.__getDetailOffline__();
    });
};

User.prototype.getGrade = function () {
    var self = this;
    if (!self._detail_) {
        self._detail_ = new StdDetail(self._number_);
    }
    if (!self._detail_.grade) {
        self._detail_.grade = +(self._number_.substr(0, 4));
    }
    return self._detail_.grade;
};

User.prototype.getScores = function (grade, semester) {
    var self = this;
    if (grade == 0) {
        return self.__getAllScores__();
    }
    else {
        var semesterId = Encoder.getSemester(grade, semester);
        return self.__getSemesterScores__(semesterId);
    }
};


// 非公开方法

User.prototype.__cacheCourses__ = function (courses) {
    var self = this;
    for (var i in courses) {
        var id = courses[i].id;
        if (self._courses_[id]) {
            self._courses_[id].__merge__(courses[i]);
            courses[i] = self._courses_[id];
        }
        else {
            self._courses_[id] = courses[i];
        }
    }
    return courses;
};

User.prototype.__ensureLogin__ = function () {
    var self = this;
    var meta = UrlUtil.getEnsureLoginMeta(self);
    return Carrier.get(meta).then(function (res) {
        if (res.httpResponse.statusCode !== 302) {
            throw new Error('Authentication failed.');
        }
        else {
            return res;
        }
    }).then(null, function (err) {
        return self.__login__();
    });
};

User.prototype.__getAllCourses__ = function () {
    var self = this;
    var semesters = Encoder.getAllSemesters(self);
    return Promise.all(semesters.map(self.__getSemesterCourses__)).then(null, self.__getAllCoursesOffline__);
};

User.prototype.__getAllCoursesOffline__ = function () {
    var self = this;
    return Promise.resolve(_.values(self._courses_));
};

User.prototype.__getAllScores__ = function () {
    var self = this;
    var meta = UrlUtil.getUserAllScoresMeta(self);
    return self.__ensureLogin__().then(function () {
        return Carrier.get(meta).then(function (res) {
            return Parser.getUserAllScores(res.body);
        }).then(function (courses) {
            return self.__cacheCourses__(courses);
        });
    });
};

User.prototype.__getDetailOffline__ = function () {
    var self = this;
    if (self._detail_) {
        return Promise.resolve(self._detail_);
    }
    else {
        return Promise.reject(new Error('There is nothing if detail'))
    }
};

User.prototype.__getDetailOnline__ = function () {
    var self = this;
    var meta = UrlUtil.getUserDetailMeta(self);
    return self.__ensureLogin__().then(function () {
        return Carrier.get(meta).then(function (res) {
            return Parser.getUserDetail(res.body);
        }).then(function (detail) {
            self._detail_ = detail;
            return detail;
        });
    });
};

User.prototype.__getSemesterCourses__ = function (semester) {
    var self = this;
    return self.__getSemesterCoursesOnline__(semester).then(null, function () {
        return self.__getSemesterCoursesOffline__(semester);
    });
};

User.prototype.__getSemesterCoursesOffline__ = function (semester) {
    var self = this;
    return Promise.resolve(_.chain(self._courses_).values().where({_semester_: semester}).value());
};

User.prototype.__getSemesterCoursesOnline__ = function (semester) {
    var self = this;
    var getMeta = UrlUtil.getUserSemesterCoursesPreMeta(self);
    var postMeta, courses;
    return self.__ensureLogin__().then(function () {
        return Carrier.get(getMeta).then(function (getRes) {
            var raw = getRes.body.match(/bg\.form\.addInput\(form,"ids","\d+"\);/)[0];
            var ids = raw.match(/\d+/)[0];
            postMeta = UrlUtil.getUserSemesterCoursesMeta(self, semester, ids);
            return Carrier.post(postMeta).then(function (postRes) {
                return Parser.getUserSemesterCourses(postRes.body).then(function (coursesRes) {
                    courses = coursesRes;
                    return courses;
                }).then(function () {
                    return Peeler.getUserSemesterCourses(postRes.body);
                    // Todo Add Semeter Info to Courses
                });
            });
        });
    }).then(function (timeTable) {
        courses.forEach(function (course) {
            course.durations = _.map(timeTable[course.id] || [], function (time) {
                var indexes = '';
                _.times(24, function (n) {
                    indexes += ((n >= time.index && n < time.index + time.span)? '1': '0');
                });
                return new Duration(time.weeks, time.day, indexes, time.place);
            });
        });
        return courses;
    }).then(function (coursesWithTime) {
        return self.__cacheCourses__(coursesWithTime);
    });
};

User.prototype.__getSemesterExams__ = function (semester) {
    var self = this;
    var meta = UrlUtil.getUserSemesterExamsMeta(self, semester);
    return self.__ensureLogin__().then(function () {
        return Carrier.get(meta).then(function (res) {
            return Parser.getUserSemesterExams(res.body);
        });
    }).then(function (courses) {
        return self.__cacheCourses__(courses);
    }).then(function (courses) {
        return courses.map(function (course) {
            return course.exam;
        });
    });
};

User.prototype.__getSemesterScores__ = function (semester) {
    var self = this;
    var meta = UrlUtil.getUserSemesterScoresMeta(self, semester);
    return self.__ensureLogin__().then(function () {
        return Carrier.get(meta).then(function (res) {
            return Parser.getUserSemesterScores(res.body);
        });
    }).then(function (courses) {
        return self.__cacheCourses__(courses);
    }).then(function (courses) {
        return courses.map(function (course) {
            return course.score;
        });
    });
};


User.prototype.__login__ = function () {
    var self = this;
    var meta = UrlUtil.getUserLoginMeta(self._number_, self._password_);
    meta.jar = self._jar_;
    return Carrier.post(meta).then(function (res) {
        if (res.httpResponse.statusCode !== 302) {
            self._status_ = User.status.loginFail;
            throw new Error('Authentication failed.');
        }
        else {
            self._status_ = User.status.loginSuccess;
            return self;
        }
    });
};

User.prototype.__reset__ = function () {
    this._status_ = User.status.idle;
    this._jar_ = Carrier.jar();
    this._courses_ = {};
    this._detail_ = new StdDetail(this._number_);
    this._carrier_ = Carrier;
};
