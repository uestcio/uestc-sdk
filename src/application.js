// 外部依赖

var Promise = require('promise');
var request = require('request');

var User = require('./user');
var UrlUtil = require('./urlutil');


// 构造方法

function Application() {
    this.users = {};
    this.current = null;

    this._request_ = request;
}

module.exports = Application;


// 实例方法

Application.prototype.identify = function (number, password) {
    var self = this;
    var meta = UrlUtil.getUserLoginMeta(number, password);

    var user = new User(number, password);
    meta.jar = user.jar;

    this.users[user.number] = user;

    user.login(meta)
        .then(function () {
            self.current = user;
        });

    return user;
};

Application.prototype.reset = function () {
    this.users = {};
    this.current = null;
};

Application.prototype.searchForCourse = function (options) {
    var getMeta = UrlUtil.getApplicationSearchCoursePrepareMeta(this.current);
    var postMeta = UrlUtil.getApplicationSearchCourseMeta(this.current, options);
    return new Promise(function (fulfill, reject) {
        request.get({url: getMeta.url, jar: getMeta.jar}, function (err, httpResponse, body) {
            //console.log(1, err, httpResponse.statusCode, body);
            request.post({url: postMeta.url, jar: postMeta.jar, form: postMeta.data}, function (err, httpResponse, body) {
                //console.log(2, err, httpResponse.statusCode, body);
                if (err) {reject(err);}
                else {fulfill(body);}
            });
        });
    });
};

Application.prototype.searchForPerson = function (term, limit) {
    limit = limit || 10;
    var meta = UrlUtil.getApplicationSearchPersonMeta(this.current, term, limit);


};


// 私用方法

Application.prototype.__broke__ = function (number, password) {
    var self = this;

    var meta = UrlUtil.getUserLoginMeta(number, password);
    var user = new User(number, password);
    meta.jar = user.jar;
    return user.login(meta)
        .then(function () {
            self.current = user;
            return user;
        });
};
