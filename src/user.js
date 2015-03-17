// 外部依赖

var request = require('request');
var Promise = require('promise');

// 构造方法

function User(number, password) {
    this.number = number;
    this.password = password;
    this.status = User.status.idle;
    this.jar = request.jar();

    this._request_ = request;
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

User.prototype.login = function (meta) {
    var self = this;
    return new Promise(function (fulfill, reject) {
        request.post({url: meta.url, jar: meta.jar, form: meta.data}, function (err, httpResponse, body) {
            if(err || httpResponse.statusCode != 302) {
                self.status = User.status.loginFail;
                reject(err || new Error('Authentication failed.'));
            }
            else {
                self.status = User.status.loginSuccess;
                fulfill(httpResponse);
            }
        });
    });
};

