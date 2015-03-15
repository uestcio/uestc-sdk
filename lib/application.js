// 外部依赖

var Carrier = require('./carrier');
var User = require('./user');
var UrlUtil = require('./urlutil');


// 构造方法

function Application() {
    this._carrier_ = Carrier.singleton();
}

module.exports = Application;

Application.prototype.login = function (number, password) {
    var util = UrlUtil.getLoginUtil(number, password);

    var user = new User(number, password);
    user.login(util, this._carrier_.post, null);

    return user;
};
