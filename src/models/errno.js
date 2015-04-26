
function Errno(type, message, val) {
    this.type = type;
    this.message = message;
    this.val = val;
}

module.exports = Errno;

Errno.create = function (type, val) {
    var msg = Errno.messages[type];
    return new Errno(type, msg, val);
};

Errno.types = {
    nologin: 100
};

Errno.messages = {
    100: '没有登录'
};
