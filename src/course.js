// 外部依赖

var _ = require('lodash');


// 构造函数

function Course(id) {
    this.id = id;
}

module.exports = Course;


// 静态字段

Course.types = {
    all: 0,
    publicDisciplinary: 1,
    basicDisciplinary: 2,
    basicDisciplinaryElective: 3,
    practicalEducation: 4,
    majorDisciplinary: 5,
    majorElective: 6,
    innovationCredit: 7,
    qualityElective: 8
};

// 静态方法


// 实例方法


// 非公开方法

Course.prototype.__setField__ = function (field, val) {
    if(val != null && val != undefined && val != '') {
        this[field] = val;
    }
};
