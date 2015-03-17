// 外部依赖

var _ = require('lodash');
var request = require('request');
var Promise = require('promise');

var Course = require('./course');
var Parser = require('./parser');

// 构造方法

function User(number, password) {
    this._number_ = number;
    this._password_ = password;
    this._status_ = User._status_.idle;
    this._jar_ = request.jar();

    this._courses_ = {};
    this._request_ = request;
}

module.exports = User;


// 静态字段

User._status_ = {
    idle: 0,
    loginSuccess: 1,
    loginFail: 2,
    logout: 3
};


// 静态方法


// 实例方法

User.prototype.getCourses = function (grade, semester) {


};


// 非公开方法

User.prototype.__getSemesterScores__ = function (meta) {
    var self = this;
    return new Promise(function (fulfill, reject) {
        request.get({url: meta.url, jar: meta.jar}, function (err, httpResponse, body) {
            if (err) {
                reject(err);
            }
            else {
                fulfill(body);
            }
        });
    }).then(Parser.get$).then(function ($) {
            var lines = $('table.gridtable > tbody > tr');
            return _.map(lines, function (line) {
                var id = $(line.children[2]).text();
                var course = self._courses_[id] || new Course(id);
                course.__setField__('title', $(line.children[3]).text());
                course.__setField__('type', $(line.children[4]).text());
                course.__setField__('credit', $(line.children[5]).text());
                course.__setField__('department', $(line.children[4]).text());
                course.__setField__('instructor', _.trim($(line.children[5]).text()));
                course.__setField__('grade', $(line.children[7]).text());
                if(!self._courses_[id]) {
                    self._courses_[id] = course;
                }
                var enrollment = course.enrollment || new Enrollment(course, user);
                enrollment.__setField__('semester', $(line.children[0]).text());
                enrollment.__setField__('generalScore', _.trim($(line.children[6]).text()));
                enrollment.__setField__('finallScore', _.trim($(line.children[8]).text()));
                enrollment.__setField__('gpa', _.trim($(line.children[9]).text()));
                if(!course.enrollment) {
                    course.enrollment = enrollment;
                }
                return course;
            });
        });
};


User.prototype.__login__ = function (meta) {
    var self = this;
    return new Promise(function (fulfill, reject) {
        request.post({url: meta.url, jar: meta.jar, form: meta.data}, function (err, httpResponse, body) {
            if (err || httpResponse.statusCode != 302) {
                self._status_ = User._status_.loginFail;
                reject(err || new Error('Authentication failed.'));
            }
            else {
                self._status_ = User._status_.loginSuccess;
                fulfill(httpResponse);
            }
        });
    });
};

