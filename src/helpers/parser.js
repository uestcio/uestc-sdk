// 外部依赖

var _ = require('lodash');
var jsdom = require('jsdom');
var Promise = require('promise');

var Course = require('../structure/course');


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
