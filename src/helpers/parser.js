// 外部依赖

var _ = require('lodash');
var jsdom = require('jsdom');
var Promise = require('promise');

var Course = require('../structure/course');
var Score = require('../structure/score');


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
            var score = new Score(course, self);
            score.__setField__('semester', $(line.children[0]).text());
            score.__setField__('generalScore', _.trim($(line.children[6]).text()));
            score.__setField__('finallScore', _.trim($(line.children[8]).text()));
            score.__setField__('gpa', _.trim($(line.children[9]).text()));
            course.score = score;
            return course;
        });
    });
};
