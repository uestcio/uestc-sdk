// 外部依赖

var _ = require('lodash');
var jsdom = require('jsdom');
var Promise = require('promise');

var Course = require('../structure/course');
var Score = require('../structure/score');
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
            if(errors) {
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
            course.__setField__('grade', $(line.children[7]).text());
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
            var score = new Score(course);
            score.__setField__('semester', $(line.children[0]).text());
            score.__setField__('generalScore', _.trim($(line.children[6]).text()));
            score.__setField__('finallScore', _.trim($(line.children[8]).text()));
            score.__setField__('gpa', _.trim($(line.children[9]).text()));
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
        detail.__setField__('eName', $(lines[2].children[1]).text());
        detail.__setField__('sex', $(lines[2].children[3]).text());
        detail.__setField__('grade', $(lines[3].children[1]).text());
        detail.__setField__('eduLenth', $(lines[3].children[3]).text());
        detail.__setField__('project', $(lines[4].children[1]).text());
        detail.__setField__('qualification', $(lines[4].children[3]).text());
        detail.__setField__('type', $(lines[5].children[1]).text());
        detail.__setField__('school', $(lines[5].children[3]).text());
        detail.__setField__('major', $(lines[6].children[1]).text());
        detail.__setField__('direction', $(lines[6].children[3]).text());
        detail.__setField__('fromDate', $(lines[8].children[1]).text());
        detail.__setField__('toDate', $(lines[8].children[3]).text());
        detail.__setField__('adminSchl', $(lines[9].children[1]).text());
        detail.__setField__('stuForm', $(lines[9].children[3]).text());
        detail.__setField__('EduForm', $(lines[10].children[1]).text());
        detail.__setField__('status', $(lines[10].children[3]).text());
        detail.__setField__('inEdu', $(lines[11].children[1]).text());
        detail.__setField__('inSchl', $(lines[11].children[3]).text());
        detail.__setField__('adminClass', $(lines[12].children[1]).text());
        detail.__setField__('campus', $(lines[12].children[3]).text());
        return detail;
    });
};
