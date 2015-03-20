// 外部依赖

var _ = require('lodash');

var Application = require('../application');
var Duration = require('./duration');
var Exam = require('./exam');
var Fixture = require('../helpers/fixture');
var Score = require('./score');

// 构造函数

function Course(id) {
    this.id = id;
    this.durations = [];
    this.semester = [0, 0, 0];
}

module.exports = Course;


// 静态字段


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
    if (val === null || val === undefined || val != val || val === '' || _.isFunction(val)) {
        return;
    }
    switch (field) {
        case 'id':
            break;
        case 'title':
        case 'code':
        case 'instructor':
        case 'instructorTitle':
        case 'examType':
        case 'campus':
            this[field] = val;
            break;
        case 'credit':
        case 'hours':
            this[field] = +val;
            break;
        case 'type':
            if (_.some(Fixture.courseTypes, function (value) {
                    return val == value;
                })) {
                this[field] = val;
            }
            break;
        case 'department':
            if (_.some(Fixture.departments, function (value) {
                    return val == value;
                })) {
                this[field] = val;
            }
            break;
        case 'durations':
            this[field] = val;
            break;
        case 'grade':
            this['semester'][0] = +val;
            this['semester'][1] = val > 0? val + 1 : 0;
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
    //console.log(1, field);
    //console.log(2, val);
    //console.log(3, this[field]);
    //console.log('');
};
