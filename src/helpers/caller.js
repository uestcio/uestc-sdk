//外部依赖
var _ = require('lodash');
var Promise = require('promise');

var Errno = require('../models/errno');

// 构造方法
function Caller() {
}

module.exports = Caller;

Caller.rejectForNoLogin = function () {
    var err = Errno.create(Errno.types.nologin, null);
    return Promise.reject(err);
};