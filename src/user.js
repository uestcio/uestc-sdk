// 外部依赖

var _ = require('lodash');
var Promise = require('promise');

var Carrier = require('./helpers/carrier');
var Course = require('./course');
var Enrollment = require('./enrollment');
var Parser = require('./helpers/parser');
var Encoder = require('./helpers/encoder');
var Peeler = require('./helpers/peeler');
var UrlUtil = require('./urlutil');
var StdDetail = require('./stddetail');

// 构造方法

function User(number, password) {
    this._number_ = number;
    this._password_ = password;
    this._status_ = User._status_.idle;
    this._jar_ = Carrier.jar();
    this._courses_ = {};
    this._detail_ = null;
    this._carrier_ = Carrier;
}

module.exports = User;


// 静态字段

User._status_ = {
    idle: 0,
    loginSuccess: 1,
    loginFail: 2,
};


// 静态方法


// 实例方法

User.prototype.getCourses = function (grade, semester) {
    var self = this;
    var semesterId = Encoder.getSemester(grade, semester);
    if (semesterId == 0) {
        return self.__getAllCourses__().then(
            function () {
                return self.__getAllScores__();
            });
    }
    else {
        return self.__getSemesterCourse__(semesterId).then(function () {
            return self.__getSemesterScores__(semesterId);
        });
    }
};

User.prototype.getDetail = function () {
    var self = this;
    return self.__getDetailOnline__().then(null, function (err) {
        return self.__getDetailOffline__();
    });
};


// 非公开方法

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
        var meta = UrlUtil.getUserLoginMeta(self._number_, self._password_);
        meta.jar = self._jar_;
        return self.__login__(meta);
    });
};

User.prototype.__getAllCourses__ = function () {

};

User.prototype.__getAllScores__ = function () {
    var self = this;
    var meta= UrlUtil.getUserAllScoresMeta(self);
    return self.__ensureLogin__().then(function () {
        return Carrier.get(meta).then(function (res) {
            return Parser.get$(res.body);
        }).then(function ($) {
            var lines = $('div.grid > table.gridtable > tbody > tr');
            return _.map(lines, function (line) {
                var id = $(line.children[2]).text();
                var course = self._courses_[id] || new Course(id);
                course.__setField__('code', $(line.children[1]).text());
                course.__setField__('title', $(line.children[3]).text());
                course.__setField__('type', $(line.children[4]).text());
                course.__setField__('credit', +$(line.children[5]).text());
                if (!self._courses_[id]) {
                    self._courses_[id] = course;
                }
                var enrollment = course.enrollment || new Enrollment(course, self);
                enrollment.__setField__('semester', $(line.children[0]).text());
                enrollment.__setField__('generalScore', _.trim($(line.children[6]).text()));
                enrollment.__setField__('finallScore', _.trim($(line.children[8]).text()));
                enrollment.__setField__('gpa', _.trim($(line.children[9]).text()));
                if (!course.enrollment) {
                    course.enrollment = enrollment;
                }
                return course;
            });
        });
    });
};

User.prototype.__getDetailOffline__ = function () {
    var self = this;
    if(self._detail_) {
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
            return Parser.get$(res.body);
        }).then(function ($) {
            var lines = $('#studentInfoTb > tbody > tr');
            var id = $(lines[1].children[1]).text();
            var detail = self._detail_ || new StdDetail(id);
            detail.__setField__('name', $(lines[1].children[3]).text());
            detail.__setField__('eName', $(lines[2].children[1]).text());
            detail.__setField__('sex', $(lines[2].children[3]).text());
            detail.__setField__('grade', $(lines[3].children[1]).text());
            detail.__setField__('eduLenth', $(lines[3].children[3]).text());
            detail.__setField__('project', $(lines[4].children[1]).text());
            detail.__setField__('qualification', $(lines[4].children[3]).text());
            detail.__setField__('type', $(lines[5].children[1]).text());
            detail.__setField__('school', $(lines[5].children[3]).text());
            detail.__setField__('major', $(lines[6].children[1]).text());
            detail.__setField__('direction', $(lines[6].children[3]).text());
            detail.__setField__('fromDate', $(lines[8].children[1]).text());
            detail.__setField__('toDate', $(lines[8].children[3]).text());
            detail.__setField__('adminSchl', $(lines[9].children[1]).text());
            detail.__setField__('stuForm', $(lines[9].children[3]).text());
            detail.__setField__('EduForm', $(lines[10].children[1]).text());
            detail.__setField__('status', $(lines[10].children[3]).text());
            detail.__setField__('inEdu', $(lines[11].children[1]).text());
            detail.__setField__('inSchl', $(lines[11].children[3]).text());
            detail.__setField__('adminClass', $(lines[12].children[1]).text());
            detail.__setField__('campus', $(lines[12].children[3]).text());
            if (!self._detail_) {
                self._detail_ = detail;
            }
            return detail;
        });
    });
};

User.prototype.__getSemesterCourse__ = function (semester) {
    var self = this;
    var getMeta = UrlUtil.getUserSemesterCoursesPreMeta(this._current_);
    var postMeta;
    return self._current_.__ensureLogin__().then(function () {
        return Carrier.get(getMeta).then(function (getRes) {
            var raw = getRes.body.match(/bg\.form\.addInput\(form,"ids","\d+"\);/);
            var ids = raw.match(/\d+/);
            postMeta = UrlUtil.getUserSemesterCoursesMeta(self._current_, semester, ids);
            return Carrier.post(postMeta).then(function (postRes) {
                var raws = postRes.body.match(/var table0[\S\s]*?table0\.marshalTable/);
                raws = raws.replace('table0.marshalTable', '');
                var courses = [];
                var CourseTable = function (year, semester) {
                    this.year = year;
                    this.semester = semester;
                    this.activities = [];
                    _.times(12, function (n) {
                        this.activities[n] = [];
                    },this);
                };
                var TaskActivity = function (uk1, instructor, uk2, titleAndId, uk3, place, weeks) {
                    this.uk1 = uk1;
                    this.instructor = instructor;
                    this.uk2 = uk2;
                    this.titleAndId = titleAndId;
                    this.uk3 = uk3;
                    this.place = place;
                    this.weeks = weeks;
                };
                eval(raws);
                return Peeler.getTable(CourseTable);
            });
        });
    });
};

User.prototype.__getSemesterScores__ = function (semester) {
    var self = this;
    var meta = UrlUtil.getUserSemesterScoresMeta(self, semester);
    return self.__ensureLogin__().then(function () {
        return Carrier.get(meta).then(function (res) {
            return Parser.get$(res.body);
        }).then(function ($) {
            var lines = $('table.gridtable > tbody > tr');
            return _.map(lines, function (line) {
                var id = $(line.children[2]).text();
                var course = self._courses_[id] || new Course(id);
                course.__setField__('code', $(line.children[1]).text());
                course.__setField__('title', $(line.children[3]).text());
                course.__setField__('type', $(line.children[4]).text());
                course.__setField__('credit', +$(line.children[5]).text());
                course.__setField__('grade', $(line.children[7]).text());
                if (!self._courses_[id]) {
                    self._courses_[id] = course;
                }
                var enrollment = course.enrollment || new Enrollment(course, self);
                enrollment.__setField__('semester', $(line.children[0]).text());
                enrollment.__setField__('generalScore', _.trim($(line.children[6]).text()));
                enrollment.__setField__('finallScore', _.trim($(line.children[8]).text()));
                enrollment.__setField__('gpa', _.trim($(line.children[9]).text()));
                if (!course.enrollment) {
                    course.enrollment = enrollment;
                }
                return course;
            });
        });
    });
};


User.prototype.__login__ = function (meta) {
    var self = this;
    return Carrier.post(meta).then(function (res) {
        if (res.httpResponse.statusCode !== 302) {
            self._status_ = User._status_.loginFail;
            throw new Error('Authentication failed.');
        }
        else {
            self._status_ = User._status_.loginSuccess;
            return self;
        }
    });
};

User.prototype.__reset__ = function () {
    this._status_ = User._status_.idle;
    this._jar_ = Carrier.jar();

    this._courses_ = {};
    this._carrier_ = Carrier;
};
