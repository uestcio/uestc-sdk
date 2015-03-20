// 外部依赖

var _ = require('lodash');


// 构造函数

function Exam(course) {
    this.course = course;
}

module.exports = Exam;


// 静态字段


// 静态方法


// 实例方法


// 非公开方法

Exam.prototype.__setField__ = function (field, val) {
    if(val == null || val == undefined || val == '' || _.isFunction(val) || field == 'id') {
        return;
    }
    this[field] = val;
};
