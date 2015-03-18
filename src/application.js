// 外部依赖

var Promise = require('promise');
var _ = require('lodash');

var Carrier = require('./carrier');
var User = require('./user');
var UrlUtil = require('./urlutil');
var Parser = require('./parser');
var Course = require('./course');


// 构造方法

function Application() {
    this._users_ = {};
    this._courses_ = {};
    this._people_ = {};
    this._notices_ = {};
    this._current_ = null;
    this._carrier_ = Carrier;
}

module.exports = Application;


// 实例方法

Application.prototype.identify = function (number, password, wait) {
    var self = this;
    var user, promise;

    if (this._users_[number]) {
        user = this._users_[number];
    }
    else {
        user = new User(number, password);
        this._users_[user._number_] = user;
    }

    if (user._status_ != User._status_.loginSuccess) {
        var meta = UrlUtil.getUserLoginMeta(number, password);
        meta.jar = user._jar_;
        promise = user.__login__(meta).then(function () {
            self._current_ = user;
            return user;
        });
    }

    return wait ? promise : user;
};

Application.prototype.reset = function () {
    this._users_ = {};
    this._current_ = null;
};

Application.prototype.searchForCourses = function (options) {
    var self = this;
    return self.__searchForCoursesOnline__(options).then(null, function (err) {
        return self.__searchForCoursesOffline__(options);
    });
};

Application.prototype.searchForPeople = function (term, limit) {
    var self = this;
    if(!limit || limit <= 0) {
        limit = 10;
    }
    return self.__searchForPeopleOnline__(term, limit).then(null, function (err) {
        return self.__searchForPeopleOffline__(term, limit);
    });
};


// 私用方法

Application.prototype.__broke__ = function (number, password) {
    var self = this;

    var meta = UrlUtil.getUserLoginMeta(number, password);
    var user = new User(number, password);
    meta.jar = user._jar_;
    return user.__login__(meta).then(function () {
        self._current_ = user;
        return user;
    });
};

Application.prototype.__searchForCoursesOffline__ = function (options) {
    var courses = [];
    _.forEach(this._courses_, function (course) {
        var flag = true;
        _.forEach(options, function (val, key) {
            if (!val || _.startsWith(key, '_')) {
                return;
            }
            if (course[key].indexOf(val) < 0) {
                flag = false;
            }
        });
        if (flag) {
            courses.push(course);
        }
    });
    return Promise.resolve(courses);
};

Application.prototype.__searchForCoursesOnline__ = function (options) {
    var self = this;
    var getMeta = UrlUtil.getAppSearchCoursesPreMeta(this._current_);
    var postMeta = UrlUtil.getAppSearchCoursesMeta(this._current_, options);
    return self._current_.__ensureLogin__().then(function () {
        return Carrier.get(getMeta).then(function (getRes) {
            return Carrier.post(postMeta).then(function (postRes) {
                return Parser.get$(postRes.body);
            }).then(function ($) {
                var lines = $('table.gridtable > tbody > tr');
                return _.map(lines, function (line) {
                    var id = $(line.children[1]).text();
                    var course = self._courses_[id] || new Course(id);
                    course.__setField__('title', $(line.children[2]).text());
                    course.__setField__('type', $(line.children[3]).text());
                    course.__setField__('department', $(line.children[4]).text());
                    course.__setField__('instructor', _.trim($(line.children[5]).text()));
                    course.__setField__('grade', $(line.children[7]).text());
                    if (!self._courses_[id]) {
                        self._courses_[id] = course;
                    }
                    return course;
                });
            });
        });
    });
};

Application.prototype.__searchForPeopleOffline__ = function (term, limit) {
    var people = [];
    _.forEach(this._people_, function (person) {
        var flag = false;
        _.forEach(person, function (val, key) {
            if (!val) {
                return;
            }
            if (people.length <= limit && !_.startsWith(key, '_') && val.indexOf(term) >= 0) {
                flag = true;
            }
        });
        if (flag) {
            people.push(person);
        }
    });
    return Promise.resolve(people);
};

Application.prototype.__searchForPeopleOnline__ = function (term, limit) {
    var self = this;
    var preMeta = UrlUtil.getAppSearchPeoplePreMeta(this._current_);
    var meta = UrlUtil.getAppSearchPeopleMeta(this._current_, term, limit);
    return self._current_.__ensureLogin__().then(function () {
        return Carrier.post(preMeta).then(function (preRes) {
            return Carrier.post(meta).then(function (res) {
                return JSON.parse(res.body).principals;
            });
        });
    });
};
