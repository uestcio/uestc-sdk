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
    this.overall = -1;
    this.resit = -1;
    this.final = -1;
    this.gpa = -1;
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
            if(+val >= 0) {
                self[field] = +val;
            }
            break;
    }
};
