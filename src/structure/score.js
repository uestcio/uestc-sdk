// 外部依赖

var _ = require('lodash');

// 构造函数

function Score(course) {
    this.course = course;
    this. __init__();
}

module.exports = Score;


// 静态字段


// 静态方法


// 实例方法


// 非公开方法

Score.prototype.__init__ = function () {
    this.overall = 0;
    this.resit = 0;
    this.final = 0;
    this.gpa = 0;
};

Score.prototype.__setField__ = function (field, val) {
    var self = this;
    if (val === null || val === undefined || val != val || val === '' || _.isFunction(val)) {
        return;
    }
    switch (field) {
        case 'overall':
        case 'resit':
        case 'final':
        case 'gpa':
            self[field] = +val;
            break;
        default :
            break;
    }
};
