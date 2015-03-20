// 外部依赖

var _ = require('lodash');
var jsdom = require('jsdom');
var Promise = require('promise');

var Encoder = require('../helpers/encoder');

var Exam = require('../structure/exam');
var Score = require('../structure/score');
var Course = require('../structure/course');
var StdDetail = require('../structure/stddetail');


// 构造函数

function Parser() {
}

module.exports = Parser;


// 静态字段


// 静态方法

Parser.get$ = function (html) {
    var env = jsdom.env;

    return new Promise(function (fullfill, reject) {
        env(html, function (errors, window) {
            if (errors) {
                reject(errors);
            }
            var $ = require('jquery')(window);
            fullfill($);
        });
    })
};

Parser.getAppCourses = function (html) {
    return Parser.get$(html).then(function ($) {
        var lines = $('table.gridtable > tbody > tr');
        return _.map(lines, function (line) {
            var id = $(line.children[1]).text();
            var course = new Course(id);
            course.__setField__('title', $(line.children[2]).text());
            course.__setField__('type', $(line.children[3]).text());
            course.__setField__('department', $(line.children[4]).text());
            course.__setField__('instructor', _.trim($(line.children[5]).text()));
            course.__setField__('grade', +$(line.children[7]).text());
            course.__setField__('durations',
                Encoder.parseDurations($(line.children[8]).text(), $(line.children[9]).html()));
            course.__setField__('campus', $(line.children[11]).text());
            //console.log(course);
            return course;
        });
    });
};

Parser.getUserAllScores = function (html) {
    return Parser.get$(html).then(function ($) {
        var lines = $('div.grid > table.gridtable > tbody > tr');
        return _.map(lines, function (line) {
            var id = $(line.children[2]).text();
            var course = new Course(id);
            course.__setField__('code', $(line.children[1]).text());
            course.__setField__('title', $(line.children[3]).text());
            course.__setField__('type', $(line.children[4]).text());
            course.__setField__('credit', +$(line.children[5]).text());
            course.__setField__('semester', Encoder.parseSemester($(line.children[0]).text()));
            var score = new Score(course);
            score.__setField__('overall', +_.trim($(line.children[6]).text()));
            score.__setField__('resit', +_.trim($(line.children[7]).text()));
            score.__setField__('final', +_.trim($(line.children[8]).text()));
            course.score = score;
            return course;
        });
    });
};

Parser.getUserDetail = function (html) {
    return Parser.get$(html).then(function ($) {
        var lines = $('#studentInfoTb > tbody > tr');
        var id = $(lines[1].children[1]).text();
        var detail = new StdDetail(id);
        detail.__setField__('name', $(lines[1].children[3]).text());
        detail.__setField__('englishName', $(lines[2].children[1]).text());
        detail.__setField__('gender', $(lines[2].children[3]).text());
        detail.__setField__('grade', +$(lines[3].children[1]).text());
        detail.__setField__('length', $(lines[3].children[3]).text());
        detail.__setField__('project', $(lines[4].children[1]).text());
        detail.__setField__('qualification', $(lines[4].children[3]).text());
        detail.__setField__('type', $(lines[5].children[1]).text());
        detail.__setField__('college', $(lines[5].children[3]).text());
        detail.__setField__('major', $(lines[6].children[1]).text());
        detail.__setField__('direction', $(lines[6].children[3]).text());
        detail.__setField__('fromDate', $(lines[8].children[1]).text());
        detail.__setField__('toDate', $(lines[8].children[3]).text());
        detail.__setField__('administrationCollege', $(lines[9].children[1]).text());
        detail.__setField__('studyType', $(lines[9].children[3]).text());
        detail.__setField__('educationType', $(lines[10].children[1]).text());
        detail.__setField__('status', $(lines[10].children[3]).text());
        detail.__setField__('inEnrollment', $(lines[11].children[1]).text());
        detail.__setField__('inSchool', $(lines[11].children[3]).text());
        detail.__setField__('administrationClass', $(lines[12].children[1]).text());
        detail.__setField__('campus', $(lines[12].children[3]).text());
        return detail;
    });
};

Parser.getUserSemesterCourses = function (html) {
    return Parser.get$(html).then(function ($) {
        var table = $('table.gridtable')[1];
        var lines = $(table).find('tbody > tr');
        return _.map(lines, function (line) {
            var id = _.trim($(line.children[4]).text());
            var course = new Course(id);
            course.__setField__('code', $(line.children[1]).text());
            course.__setField__('title', $(line.children[2]).text());
            course.__setField__('credit', +$(line.children[3]).text());
            course.__setField__('instructor', $(line.children[5]).text());
            return course;
        });
    });
};

Parser.getUserSemesterExams = function (html) {
    return Parser.get$(html).then(function ($) {
        var lines = $('table.formTable > tbody > tr[onclick]');
        return _.map(lines, function (line) {
            var id = _.trim($(line.children[0]).text());
            var course = new Course(id);
            course.__setField__('title', $(line.children[1]).text());
            var exam = new Exam(course);
            var date = $(line.children[2]).text();
            var description = $(line.children[3]).text();
            var tmp = _.words(description, /\d+:\d+/g);
            exam.__setField__('date', new Date(date? date: '1970-1-1'));
            exam.__setField__('from', new Date(date? date + ' ' + tmp[0]: '1970-1-1'));
            exam.__setField__('to', new Date(date? date + ' ' + tmp[1]: '1970-1-1'));
            exam.__setField__('description', description);
            exam.__setField__('place', $(line.children[4]).text());
            exam.__setField__('seat', $(line.children[5]).text());
            exam.__setField__('status', $(line.children[6]).text());
            course.exam = exam;
            return course;
        });
    });
};

Parser.getUserSemesterScores = function (html) {
    return Parser.get$(html).then(function ($) {
        var lines = $('table.gridtable > tbody > tr');
        return _.map(lines, function (line) {
            var id = $(line.children[2]).text();
            var course = new Course(id);
            course.__setField__('code', $(line.children[1]).text());
            course.__setField__('title', $(line.children[3]).text());
            course.__setField__('type', $(line.children[4]).text());
            course.__setField__('credit', +$(line.children[5]).text());
            course.__setField__('grade', +$(line.children[7]).text());
            var score = new Score(course);
            score.__setField__('semester', Encoder.parseSemester($(line.children[0]).text()));
            score.__setField__('overall', +_.trim($(line.children[6]).text()));
            score.__setField__('resit', +_.trim($(line.children[7]).text()));
            score.__setField__('final', +_.trim($(line.children[8]).text()));
            score.__setField__('gpa', +_.trim($(line.children[9]).text()));
            course.score = score;
            return course;
        });
    });
};
