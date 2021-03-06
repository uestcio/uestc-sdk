// 外部依赖

var _ = require('lodash');


// 构造函数

function Exam(course) {
    this.course = course;
    this.__init__();
}

module.exports = Exam;


// 静态字段


// 静态方法


// 实例方法

Exam.prototype.toString = function () {
    return '[Exam_' + this.course.id + '_' + this.date + '_' +
        this.from + '_' + this.to + '_' + this.description + '_' +
        this.place + '_' + this.seat + '_' + this.status + ']';
};


// 非公开方法

Exam.prototype.__init__ = function () {
    this.place = '';
    this.seat = '';
    this.status = '';
};

Exam.prototype.__setField__ = function (field, val) {
    var self = this;
    if (val === undefined || val != val || val === '' || _.isFunction(val)) {
        return;
    }
    switch (field) {
        case 'date':
        case 'from':
        case 'to':
        case 'description':
        case 'place':
        case 'status':
            self[field] = val;
            break;
        case 'seat':
            self[field] = +val;
            break;
    }
};
