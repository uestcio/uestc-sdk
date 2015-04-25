// Application类，用于全局性操作

// 外部依赖
var Promise = require('promise');
var _ = require('lodash');

var Carrier = require('./helpers/carrier');
var User = require('./user');
var UrlUtil = require('./helpers/urlutil');
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

    if (this._users_[id]) {                             // 若该用户已存在，则从用户集合中直接取出
        user = this._users_[id];
    }
    else {                                              // 若该用户不存在，则创建该用户
        user = new User(id, password, self);
        this._users_[user._id_] = user;                 // 将该用户添加到用户集合中
    }

    user.__ensureLogin__().then(function () {           // 确保处于登录状态
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

// 课程搜索方法
Application.prototype.searchForCourses = function (options, callback) {
    var self = this;
    return self.__searchForCoursesOnline__(options).then(null, function (err) { // 尝试在线获取
        return self.__searchForCoursesOffline__(options);                       // 若在线获取失败则离线获取
    }).nodeify(function (err, res) {                                            // 执行回调函数
        _.isFunction(callback) && callback(err, res);
    });
};

// 人员搜索方法
Application.prototype.searchForPeople = function (term, limit, callback) {
    var self = this;
    if (!limit || limit <= 0) {     // 若限制参数为空则设为10
        limit = 10;
    }
    return self.__searchForPeopleOnline__(term, limit).then(null, function (err) {  // 尝试在线获取
        return self.__searchForPeopleOffline__(term, limit);                        // 若在线获取失败则离线获取
    }).nodeify(function (err, res) {                                                // 执行回调函数
        _.isFunction(callback) && callback(err, res);
    });
};


// ----私有方法分界线----


// 轻量级登陆方法，用于测试等操作
Application.prototype.__broke__ = function (number, password) {
    var self = this;
    var user = new User(number, password);
    return user.__login__().then(function () {  // 登录用户
        self._current_ = user;
        return user;
    });
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

// 在线课程搜索方法
Application.prototype.__searchForCoursesOnline__ = function (options) {
    var self = this;
    var getMeta = UrlUtil.getAppSearchCoursesPreMeta(this._current_);       // 获取课程搜索准备参数
    var postMeta = UrlUtil.getAppSearchCoursesMeta(this._current_, options);// 获取课程搜索参数
    return self._current_.__ensureLogin__().then(function () {              // 确保登录状态
        return Carrier.get(getMeta).then(function (getRes) {                // 发送课程搜索准备请求
            return Carrier.post(postMeta).then(function (postRes) {         // 发送课程搜索请求
                return Parser.getAppCourses(postRes.body);                  // 解析响应内容
            }).then(self.__cacheCourses__);                                 // 缓存课程列表
        });
    });
};

// 离线人员搜索方法
Application.prototype.__searchForPeopleOffline__ = function (term, limit) {
    var people = [];
    _.forEach(this._people_, function (person) {    // 遍历人员列表本地缓存
        var flag = false;
        _.forEach(person, function (val, key) {     // 遍历人员参数
            if (val &&
                people.length <= limit &&           // 确保数量上限
                !_.startsWith(key, '_') &&          // 排除私有字段
                val.indexOf(term) >= 0) {           // 判断当前参数是否符合
                    flag = true;
            }
        });
        if (flag) {                                 // 若某个参数符合则加入该人员
            people.push(person);
        }
    });
    return Promise.resolve(people);
};

// 在线人员搜索方法
Application.prototype.__searchForPeopleOnline__ = function (term, limit) {
    var self = this;
    var preMeta = UrlUtil.getAppSearchPeoplePreMeta(this._current_);        // 获取人员搜索准备参数
    var meta = UrlUtil.getAppSearchPeopleMeta(this._current_, term, limit); // 获取人员搜索参数
    return self._current_.__ensureLogin__().then(function () {              // 确保登录状态
        return Carrier.post(preMeta);                                       // 发送人员搜索准备请求
    }).then(function () {
        return Carrier.post(meta);                                          // 发送人员搜索请求
    }).then(function (res) {
        return JSON.parse(res.body).principals;                             // 解析响应内容
    });
};
