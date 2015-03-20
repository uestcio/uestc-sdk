// 外部依赖

var _ = require('lodash');

var Duration = require('./duration');
var Exam = require('./exam');
var Score = require('./score');

// 构造函数

function Course(id) {
    this.id = id;
    this.durations = [];
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

Course.merge = function (courses0, courses1) {
    var res = {};
    _.forEach(courses0, function (course) {
        res[course.id] = course;
    });
    _.forEach(courses1, function (course) {
        if (!res[course.id]) {
            res[course.id] = course;
        }
        else {
            res[course.id].merge(course)
        }
    });
    return _.values(res);
};


// 实例方法


// 非公开方法

Course.prototype.__merge__ = function (course) {
    var self = this;
    _.forEach(course, function (val, field) {
        self.__setField__(field, val);
    });
    return self;
};

Course.prototype.__setField__ = function (field, val) {
    if (val == null || val == undefined || val != val || val == '' || _.isFunction(val)) {
        return;
    }
    switch (field) {
        case 'id':
            break;
        case 'title':
        case 'code':
        case 'instructor':
            this[field] = val;
            break;
        case 'credit':
        case 'hours':
            this[field] = +val;
            break;
        case 'type':
            break;
        case 'durations':
            this[field] = Duration.merge(this.durations, val);
            break;
        case 'score':
            if (val instanceof Score) {
                this[field] = val;
            }
            break;
        case 'exam':
            if (val instanceof Exam) {
                this[field] = val;
            }
            break;
        default :
            break;
    }

};
