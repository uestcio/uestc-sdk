// 外部依赖


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

User.prototype.login = function (util, method, callback) {
    var self = this;
    method(util.url, util.data, util.wait, function (err, meta) {
        if (err) {
            self.status = User.status.loginFail;
        }
        else {
            self.status = User.status.loginSuccess;
            self.setCookies(meta.headers['set-cookie'])
        }
        callback && callback(!err);
    });
};

User.prototype.setCookies = function (cookies) {
    for (var i in cookies) {
        this.cookies.push(cookies[i]);
    }
};
