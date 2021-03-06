// Application类，用于全局性操作

// 外部依赖
var Promise = require('promise');
var _ = require('lodash');

var Caller = require('./helpers/caller');
var Carrier = require('./helpers/carrier');
var User = require('./user');
var Urls = require('./utils/urls');
var Parser = require('./helpers/parser');
var Course = require('./models/course');


// 构造方法
function Application() {
    this._users_ = {};          // 用户实例集合，Key为用户学号，Value为用户实例
    this._courses_ = {};        // 课程缓存集合，Key为课程序号，Value为课程实例
    this._people_ = {};         // 人员缓存集合，Key为人员标识（学号或工号），Value为人员实例
    this._notices_ = {};        // 公告缓存集合，Key为公告序号，Value为公告实例
    this._current_ = null;      // 当前用户实例，用于需要登陆才可进行的全局操作
}

// 模块输出
module.exports = Application;

// 用户登陆
Application.prototype.identify = function (id, password, callback) {
    var self = this;
    var user;

    if (this._users_[id]) {                                 // 若该用户已存在，则从用户集合中直接取出
        user = this._users_[id];
    }
    else {                                                  // 若该用户不存在，则创建该用户
        user = new User(id, password, self);
        this._users_[user._id_] = user;                     // 将该用户添加到用户集合中
    }

    user.__ensureLogin__()                                  // 确保处于登录状态
        .then(function () {
            self._current_ = user;                          // 若登录成功则将该用户设为应用的当前用户
            return user;
        }).nodeify(function (err, res) {                    // 执行回调函数
            _.isFunction(callback) && callback(err, res);
        });

    return user;
};

// 重置应用实例方法
Application.prototype.reset = function () {
    this._users_ = {};
    this._current_ = null;
};



/// ------课程搜索相关------

// 课程搜索方法
Application.prototype.searchForCourses = function (options, callback) {
    var self = this;

    return self.__searchForCoursesOnline__(options)           // 尝试在线获取
        .then(null, function () {
            return self.__searchForCoursesOffline__(options);   // 若在线获取失败则离线获取
        }).nodeify(function (err, res) {                        // 执行回调函数
            _.isFunction(callback) && callback(err, res);
        });
};

// 在线课程搜索方法
// Todo: 还未测试未登录失败情况
Application.prototype.__searchForCoursesOnline__ = function (options) {
    var self = this;

    if(!self._current_) {
        return Caller.rejectForNoLogin();
    }

    var getMeta = Urls.appSearchCoursesPre(this._current_);       // 获取课程搜索准备参数
    var postMeta = Urls.appSearchCourses(this._current_, options);// 获取课程搜索参数
    return self._current_.__ensureLogin__()                                 // 确保登录状态
        .then(function () {
            return Carrier.get(getMeta);                                    // 发送课程搜索准备请求
        }).then(function () {
            return Carrier.post(postMeta);                                  // 发送课程搜索请求
        }).then(function (postRes) {
            return Parser.getAppCourses(postRes.body);                      // 解析响应内容
        }).then(function (courses) {
            return self.__cacheCourses__(courses);                          // 缓存课程列表
        });
};

// 离线课程搜索方法
Application.prototype.__searchForCoursesOffline__ = function (options) {
    var courses = [];
    _.forEach(this._courses_, function (course) {   // 遍历课程列表本地缓存
        var flag = true;
        _.forEach(options, function (val, key) {    // 遍历搜索参数
            if (!val || _.startsWith(key, '_')) {   // 排除私有字段
                return;
            }
            if (course[key].indexOf(val) < 0) {     // 判断当前参数是否符合
                flag = false;
            }
        });
        if (flag) {                                 // 若所有参数符合则加入该课程
            courses.push(course);
        }
    });
    return Promise.resolve(courses);
};

// 课程缓存方法
Application.prototype.__cacheCourses__ = function (courses) {
    var self = this;
    for (var i in courses) {                            // 遍历新课程列表
        var id = courses[i].id;
        if (self._courses_[id]) {                       // 若该课程已存在，则进行更新
            self._courses_[id].__merge__(courses[i]);
            courses[i] = self._courses_[id];
        }
        else {                                          // 若该课程不存在，则添加该课程
            self._courses_[id] = courses[i];
        }
    }
    return courses;
};



/// ------人员搜索相关------

// 人员搜索方法
Application.prototype.searchForPeople = function (term, limit, callback) {
    var self = this;
    if (!limit || limit <= 0) {                                     // 若限制参数为空则设为10
        limit = 10;
    }
    return self.__searchForPeopleOnline__(term, limit)
        .then(null, function () {                                   // 尝试在线获取
            return self.__searchForPeopleOffline__(term, limit);    // 若在线获取失败则离线获取
        }).nodeify(function (err, res) {                            // 执行回调函数
            _.isFunction(callback) && callback(err, res);
        });
};

// 离线人员搜索方法
Application.prototype.__searchForPeopleOffline__ = function (term, limit) {
    var people = [];
    for(var id in this._people_) {
        var person = this._people_[id];
        var flag = false;
        for(var key in person) {            // 遍历人员参数
            var val = person[key];
            if (val &&
                people.length <= limit &&   // 确保数量上限
                !_.startsWith(key, '_') &&  // 排除私有字段
                val.indexOf(term) >= 0) {   // 判断当前参数是否符合
                flag = true;
            }
        }
        if (flag) {                         // 若某个参数符合则加入该人员
            people.push(person);
        }
    }
    return Promise.resolve(people);
};

// 在线人员搜索方法
Application.prototype.__searchForPeopleOnline__ = function (term, limit) {
    var self = this;
    var preMeta = Urls.appSearchPeoplePre(this._current_);        // 获取人员搜索准备参数
    var meta = Urls.appSearchPeople(this._current_, term, limit); // 获取人员搜索参数
    return self._current_.__ensureLogin__()                                 // 确保登录状态
        .then(function () {
            return Carrier.post(preMeta);                                   // 发送人员搜索准备请求
        }).then(function () {
            return Carrier.post(meta);                                      // 发送人员搜索请求
        }).then(function (res) {
            return JSON.parse(res.body).principals;                         // 解析响应内容
        }).then(function (people) {
            return self.__cachePeople__(people);
        });
};

// 人员缓存方法
// Todo: 还未测试
Application.prototype.__cachePeople__ = function (people) {
    var self = this;
    for (var i in people) {                            // 遍历新人员列表
        var id = people[i].id;
        if (self._people_[id]) {                       // 若该人员已存在，则进行更新
            self._people_[id].__merge__(people[i]);
            people[i] = self._people_[id];
        }
        else {                                          // 若该人员不存在，则添加该人员
            self._people_[id] = people[i];
        }
    }
    return people;
};



// ----其他私有方法----


// 轻量级登陆方法，用于测试等操作
Application.prototype.__broke__ = function (number, password) {
    var self = this;
    var user = new User(number, password);
    return user.__login__()                 // 登录用户
        .then(function () {
            self._current_ = user;
            return user;
        });
};


