// 外部依赖

var Promise = require('promise');

var Carrier = require('./carrier');
var User = require('./user');
var UrlUtil = require('./urlutil');


// 构造方法

function Application() {
    this._carrier_ = Carrier.singleton();
    this.users = {};
    this.current = null;
}

module.exports = Application;


// 实例方法

Application.prototype.identify = function (number, password, callback) {
    var self = this;
    var meta = UrlUtil.getUserLoginMeta(number, password);

    var user = new User(number, password);
    this.users[user.number] = user;

    user.login(meta, this._carrier_.post)
        .then(function () {
            self.current = user;
            callback && callback(user);
        });

    return user;
};

Application.prototype.reset = function () {
    this._carrier_ = null;
    this.users = {};
    this.current = null;
};

Application.prototype.searchForCourse = function (options) {
    var meta = UrlUtil.getApplicationSearchCourseMeta(this.current, options);

    return this._carrier_.post(meta).then(function (meta) {
        if(meta.status == 302) {
            self.status = User.status.loginSuccess;
            self.setCookies(meta.headers['set-cookie']);
            return meta;
        }
        else {
            throw {};
        }
    }, function (err) {
        self.status = User.status.loginFail;
        throw err;
    });
};

Application.prototype.searchForPerson = function (term, limit) {
    limit = limit || 10;
    var meta = UrlUtil.getApplicationSearchPersonMeta(this.current, term, limit);

    return this._carrier_.post(meta).then(function (meta) {
        if(meta.status == 302) {
            self.status = User.status.loginSuccess;
            self.setCookies(meta.headers['set-cookie']);
            return meta;
        }
        else {
            throw {};
        }
    }, function (err) {
        self.status = User.status.loginFail;
        throw err;
    });
};
