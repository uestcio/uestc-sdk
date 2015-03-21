// 外部依赖

var Promise = require('promise');
var _ = require('lodash');

var Carrier = require('./helpers/carrier');
var User = require('./user');
var UrlUtil = require('./helpers/urlutil');
var Parser = require('./helpers/parser');
var Course = require('./structure/course');


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


// 静态字段


// 静态方法


// 实例方法

Application.prototype.identify = function (id, password, callback) {
    var self = this;
    var user, promise;

    if (this._users_[id]) {
        user = this._users_[id];
    }
    else {
        user = new User(id, password, self);
        this._users_[user._id_] = user;
    }

    user.__login__().then(function () {
        self._current_ = user;
        return user;
    }).nodeify(function (err, res) {
        _.isFunction(callback) && callback(err, res);
    });

    return user;
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
    if (!limit || limit <= 0) {
        limit = 10;
    }
    return self.__searchForPeopleOnline__(term, limit).then(null, function (err) {
        return self.__searchForPeopleOffline__(term, limit);
    });
};


// 私用方法

Application.prototype.__broke__ = function (number, password) {
    var self = this;
    var user = new User(number, password);
    return user.__login__().then(function () {
        self._current_ = user;
        return user;
    });
};

Application.prototype.__cacheCourses__ = function (courses) {
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
                return Parser.getAppCourses(postRes.body);
            }).then(self.__cacheCourses__);
        });
    });
};

Application.prototype.__searchForPeopleOffline__ = function (term, limit) {
    var people = [];
    _.forEach(this._people_, function (person) {
        var flag = false;
        _.forEach(person, function (val, key) {
            if (val && people.length <= limit && !_.startsWith(key, '_') && val.indexOf(term) >= 0) {
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
