// 外部依赖

var Promise = require('promise');

// 构造方法

function User(number, password) {
    this.number = number;
    this.password = password;
    this.status = User.status.idle;
    this.cookies = [];
}

module.exports = User;


// 静态字段

User.status = {
    idle: 0,
    loginSuccess: 1,
    loginFail: 2,
    logout: 3
};


// 静态方法


// 实例方法

User.prototype.login = function (meta, method) {
    var self = this;
    return method(meta.url, meta.data, meta.wait).then(function (meta) {
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

User.prototype.setCookies = function (cookies) {
    for (var i in cookies) {
        this.cookies.push(cookies[i]);
    }
};
