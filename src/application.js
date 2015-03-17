// 外部依赖

var Promise = require('promise');
var request = require('request');
var _ = require('lodash');

var User = require('./user');
var UrlUtil = require('./urlutil');
var Parser = require('./parser');
var Course = require('./course');


// 构造方法

function Application() {
    this.users = {};
    this.courses = {};
    this.notices = {};
    this.current = null;

    this._request_ = request;
}

module.exports = Application;


// 实例方法

Application.prototype.identify = function (number, password) {
    var self = this;
    var user;

    if (this.users[number]) {
        user = this.users[number];
    }
    else {
        user = new User(number, password);
        this.users[user.number] = user;
    }

    if (user.status != User.status.loginSuccess) {
        var meta = UrlUtil.getUserLoginMeta(number, password);
        meta.jar = user.jar;
        user.login(meta).then(function () {
            self.current = user;
        });
    }

    return user;
};

Application.prototype.reset = function () {
    this.users = {};
    this.current = null;
};

Application.prototype.searchForCourses = function (options) {
    var getMeta = UrlUtil.getApplicationSearchCoursePrepareMeta(this.current);
    var postMeta = UrlUtil.getApplicationSearchCourseMeta(this.current, options);
    return new Promise(function (fulfill, reject) {
        request.get({url: getMeta.url, jar: getMeta.jar}, function (err, httpResponse, body) {
            request.post({
                url: postMeta.url,
                jar: postMeta.jar,
                form: postMeta.data
            }, function (err, httpResponse, body) {
                if (err) {
                    reject(err);
                }
                else {
                    fulfill(body);
                }
            });
        });
    }).then(Parser.get$).then(function ($) {
            var lines = $('table.gridtable > tbody > tr');
            return _.map(lines, function (line) {
                var course = new Course();
                course.id = $(line.children[1]).text();
                course.title = $(line.children[2]).text();
                //course.type = Course.parseType($(line.children[3]).text());
                course.type = $(line.children[3]).text();
                //course.department = Course.parseDepartment($(line.children[4]).text());
                course.department = $(line.children[4]).text();
                course.instructor = _.trim($(line.children[5]).text());
                course.grade = $(line.children[7]).text();
                return course;
            });
        });
};

//Application.prototype.searchForPeople = function (term, limit) {
//    limit = limit || 10;
//    var meta = UrlUtil.getApplicationSearchPersonMeta(this.current, term, limit);
//};


// 私用方法

Application.prototype.__broke__ = function (number, password) {
    var self = this;

    var meta = UrlUtil.getUserLoginMeta(number, password);
    var user = new User(number, password);
    meta.jar = user.jar;
    return user.login(meta).then(function () {
        self.current = user;
        return user;
    });
};
