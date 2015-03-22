// 外部依赖

var _ = require('lodash');
var later = require('later');
var Promise = require('promise');

var Carrier = require('./helpers/carrier');
var Course = require('./models/course');
var Duration = require('./models/duration');
var Score = require('./models/score');
var Parser = require('./helpers/parser');
var Encoder = require('./helpers/encoder');
var Keeper = require('./helpers/keeper');
var Peeler = require('./helpers/peeler');
var UrlUtil = require('./helpers/urlutil');
var StdDetail = require('./models/stddetail');

// 构造方法

function User(number, password, owner) {
    this._id_ = number;
    this._password_ = password;
    this._owner_ = owner;
    this._jar_ = Carrier.jar();
    this._courses_ = {};
    this._callbacks_ = {};
    this._detail_ = new StdDetail(number);
    this._carrier_ = Carrier;
    this._inNotify_ = false;

    this.id = this._id_;
    this.status = User.status.idle;
}

module.exports = User;


// 静态字段

User.status = {
    idle: '未登录',
    loginSuccess: '登陆成功',
    loginFail: '登录失败'
};


// 静态方法


// 实例方法

User.prototype.getCourses = function (grade, semester, callback) {
    var self = this;
    if (grade == 0) {
        self.__getAllCourses__().nodeify(function (err, res) {
            _.isFunction(callback) && callback(err, res);
        });
    }
    else {
        var semesterId = Encoder.getSemester(grade, semester);
        self.__getSemesterCourses__(semesterId).nodeify(function (err, res) {
            _.isFunction(callback) && callback(err, res);
        });
    }
};

User.prototype.getDetail = function (callback) {
    var self = this;
    self.__getDetailOnline__().then(null, function (err) {
        return self.__getDetailOffline__();
    }).nodeify(function (err, res) {
        _.isFunction(callback) && callback(err, res);
    });
};

User.prototype.getExams = function (grade, semester, callback) {
    var self = this;
    if (grade == 0) {
        self.__getAllExams__().nodeify(function (err, res) {
            _.isFunction(callback) && callback(err, res);
        });
    }
    else {
        var semesterId = Encoder.getSemester(grade, semester);
        self.__getSemesterExams__(semesterId).nodeify(function (err, res) {
            _.isFunction(callback) && callback(err, res);
        });
    }
};

User.prototype.getGrade = function () {
    var self = this;
    if (!self._detail_) {
        self._detail_ = new StdDetail(self._id_);
    }
    if (!self._detail_.grade) {
        self._detail_.grade = +(self._id_.substr(0, 4));
    }
    return self._detail_.grade;
};

User.prototype.getScores = function (grade, semester, callback) {
    var self = this;
    if (grade == 0) {
        self.__getAllScores__().nodeify(function (err, res) {
            _.isFunction(callback) && callback(err, res);
        });
    }
    else {
        var semesterId = Encoder.getSemester(grade, semester);
        self.__getSemesterScores__(semesterId).nodeify(function (err, res) {
            _.isFunction(callback) && callback(err, res);
        });
    }
};

User.prototype.on = function (event, callback) {
    var self = this;
    self._callbacks_[event] = callback;
    var sched = later.parse.recur().every(3 * Keeper.period).minute();
    later.setTimeout(function () {
        self._inNotify_ = true;
    }, sched);
};


// 非公开方法

User.prototype.__cacheCourses__ = function (courses) {
    var self = this;
    for (var i in courses) {
        var id = courses[i].id;
        var newOne = courses[i];
        var oldOne = self._courses_[courses[i].id];
        if (oldOne) {
            self._inNotify_ && self.__checkUpdates__(oldOne, newOne);
            self._courses_[id].__merge__(courses[i]);
            courses[i] = self._courses_[id];
        }
        else {
            self._courses_[id] = courses[i];
        }
    }
    self._owner_.__cacheCourses__(courses.map(function (course) {
        return course.__dummy__();
    }));
    return courses;
};

User.prototype.__checkUpdates__ = function (oldOne, newOne) {
    var self = this;
    if (!oldOne || !newOne) {
        return;
    }
    if (newOne.exam && newOne.exam.date &&
        (!oldOne.exam || !oldOne.exam.date || !_.isEqual(newOne.exam.toString(), oldOne.exam.toString()))) {
        self.__notify__('exam', newOne.exam);
    }
    if (newOne.score && newOne.score.final &&
        (!oldOne.score || !oldOne.score.final || !_.isEqual(newOne.score.toString(), oldOne.score.toString()))) {
        self.__notify__('score', newOne.score);
    }
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
    return Promise.all(semesters.map(function (semester) {
            return self.__getSemesterCourses__(semester);
        }
    )).then(function (coursesArray) {
        return _.chain(coursesArray).flatten().uniq(function (course) {
            return course.id;
        }).value();
    }, function (err) {
        return self.__getAllCoursesOffline__();
    });
};

User.prototype.__getAllCoursesOffline__ = function () {
    var self = this;
    return Promise.resolve(_.values(self._courses_));
};

User.prototype.__getAllExams__ = function () {
    var self = this;
    var semesters = Encoder.getAllSemesters(self);
    return Promise.all(semesters.map(function (semester) {
            return self.__getSemesterExams__(semester);
        }
    )).then(function (examsArray) {
        return _.chain(examsArray).flatten().uniq(function (exam) {
            return exam.course.id;
        }).value();
    }, function (err) {
        return self.__getAllExamsOffline__();
    });
};

User.prototype.__getAllExamsOffline__ = function () {
    var self = this;
    return Promise.resolve(_.filter(self._courses_, 'exam'));
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
    return self.__getSemesterCoursesOnline__(semester).then(function (courses) {
        return _.filter(courses, 'id');
    }, function () {
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
                    indexes += ((n >= time.index && n < time.index + time.span) ? '1' : '0');
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
    var meta = UrlUtil.getUserLoginMeta(self._id_, self._password_);
    meta.jar = self._jar_;
    return Carrier.post(meta).then(function (res) {
        if (res.httpResponse.statusCode !== 302) {
            self.status = User.status.loginFail;
            throw new Error('Authentication failed.');
        }
        else {
            self.status = User.status.loginSuccess;
            return self;
        }
    });
};

User.prototype.__notify__ = function (event, res) {
    var self = this;
    var callback = self._callbacks_[event];
    if(callback && _.isFunction(callback)) {
        callback(null, res);
    }
};

User.prototype.__reset__ = function () {
    this.status = User.status.idle;
    this._jar_ = Carrier.jar();
    this._courses_ = {};
    this._callbacks_ = {};
    this._detail_ = new StdDetail(this._id_);
    this._carrier_ = Carrier;
    this._inNotify_ = false;
};
