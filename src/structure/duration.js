// 外部依赖

var _ = require('lodash');


// 构造函数

function Duration(weeks, day, indexes, place) {
    this.weeks = weeks;
    this.day = day;
    this.indexes = indexes;
    this.place = place;
}

module.exports = Duration;


// 静态字段


// 静态方法


// 实例方法


// 非公开方法

Duration.prototype.__setField__ = function (field, val) {
    if(val == null || val == undefined || val == '' || _.isFunction(val) || field == 'id') {
        return;
    }
    this[field] = val;
};
