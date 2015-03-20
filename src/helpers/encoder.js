// 外部依赖

var _ = require('lodash');
var moment = require('moment');
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
        2015: {1: 84, 2: 0},
        2016: {1: 0, 2: 0},
        2017: {1: 0, 2: 0},
        2018: {1: 0, 2: 0},
        2019: {1: 0, 2: 0},
        2020: {1: 0, 2: 0}
    };
    return map[grade][semester];
};

Encoder.getAllSemesters = function (user) {
    var semesters = [];
    _.range(user.getGrade(), moment().year() + 1).forEach(function (year) {
        semesters.push(Encoder.getSemester(year, 1, user));
        semesters.push(Encoder.getSemester(year, 2, user));
    });
    return semesters;
};

Encoder.parseSemester = function (semesterStr) {
    var year0 = +_.words(semesterStr)[0];
    var year1 = +_.words(semesterStr)[1];
    var semester = +_.words(semesterStr)[2];
    return [year0, year1, semester];
};

