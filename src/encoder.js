// 外部依赖

var Promise = require('promise');


// 构造函数

function Encoder() {
}

module.exports = Encoder;


// 静态字段


// 静态方法

Encoder.getSemester = function (grade, semester, user) {
    if(grade < 10) {
        grade += user.getGrade() - 1;
    }
    var map = {
        2008: {1: 21, 2: 22},
        2009: {1: 19, 2: 20},
        2010: {1: 17, 2: 18},
        2011: {1: 15, 2: 16},
        2012: {1: 13, 2: 14},
        2013: {1: 1, 2: 2},
        2014: {1: 43, 2: 63},
        2015: {1: 84}
    };
    return map[grade][semester];
};

