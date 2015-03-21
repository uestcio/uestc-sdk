// 外部依赖

var _ = require('lodash');
var moment = require('moment');

var Duration = require('../structure/duration');

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

Encoder.parseDayofWeek = function (dayStr) {
    var res;
    switch (dayStr){
        case '星期一':
        case '周一':
        case '一':
            res = 1;
            break;
        case '星期二':
        case '周二':
        case '二':
            res = 2;
            break;
        case '星期三':
        case '周三':
        case '三':
            res = 3;
            break;
        case '星期四':
        case '周四':
        case '四':
            res = 4;
            break;
        case '星期五':
        case '周五':
        case '五':
            res = 5;
            break;
        case '星期六':
        case '周六':
        case '六':
            res = 6;
            break;
        case '星期日':
        case '星期天':
        case '周日':
        case '日':
            res = 7;
            break;
        default :
            res = 0;
            break;
    }
    return res;
};

Encoder.parseDurations = function (durationsStr, placesStr) {
    var dStrs = _.words(durationsStr, /[^\n\r\]]+/g);
    var pStrs = _.words(placesStr, /[^<br>]+/g);
    return dStrs.map(function (dStr, n) {
        var place = _.trim(pStrs[n]) || '';
        var res = _.words(dStr, /[\S]+/g);
        var parity = _.startsWith(place, '单')? 1: (_.startsWith(place, '双')? 2: 4);
        if(parity !== 4) {
            place = _.words(place, /\S+/g)[1];
        }
        var day = Encoder.parseDayofWeek(res[0]);
        var indexes = Encoder.parseIndexes(res[1]);
        var weeks = Encoder.parseWeeks(res[2], parity);
        return new Duration(weeks, day, indexes, place);
    })
};

Encoder.parseIndexes = function (indexesStr) {
    var raws = _.words(indexesStr, /\d+/g);
    var res = '';
    _.times(12, function (n) {
        res += (n + 1 >= raws[0] && n + 1 <= raws[1]? '1': '0');
    });
    return res;
};

Encoder.parseSemester = function (semesterStr) {
    var year0 = +_.words(semesterStr)[0];
    var year1 = +_.words(semesterStr)[1];
    var semester = +_.words(semesterStr)[2];
    return [year0, year1, semester];
};

Encoder.parseWeeks = function (weeksStr, parity) {
    var raws = _.words(weeksStr, /\d+/g);
    var res = '';
    _.times(24, function (n) {
        var tmp;
        if((parity === 1 && n % 2 === 1) || (parity === 2 && n % 2 === 0)) {
            tmp = '0';
        }
        else {
            tmp = (n + 1 >= raws[0] && n + 1 <= raws[1]? '1': '0');
        }
        res += tmp;
    });
    return res;
};

