// 外部依赖

var Carrier = require('./carrier');
var User = require('./user');
var UrlUtil = require('./urlutil');


// 构造方法

function Application() {
    this._carrier_ = Carrier.singleton();
    this.users = [];
    this.current = null;
}

module.exports = Application;


// 实例方法

Application.prototype.login = function (number, password) {
    var util = UrlUtil.getLoginUtil(number, password);

    var user = new User(number, password);
    this.users.push(user);
    this.current = user;
    user.login(util, this._carrier_.post, null);

    return user;
};

Application.prototype.reset = function () {
    this._carrier_ = null;
    this.users = [];
    this.current = null;
};
