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

Score.prototype.toString = function () {
    return '[Score_' + this.course.id + '_' + this.overall + '_' +
        this.resit + '_' + this.final + '_' + this.gpa + ']';
};


// 非公开方法

Score.prototype.__init__ = function () {
    this.overall = null;
    this.resit = null;
    this.final = null;
    this.gpa = null;
};

Score.prototype.__setField__ = function (field, val) {
    var self = this;
    if (val === undefined || val != val || val === '' || _.isFunction(val)) {
        return;
    }
    switch (field) {
        case 'overall':
        case 'resit':
        case 'final':
        case 'gpa':
            if(val === null){
                self[field] = val;
            }
            else if(+val >= 0) {
                self[field] = +val;
            }
            break;
    }
};
