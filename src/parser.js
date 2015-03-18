// 外部依赖

var jsdom = require('jsdom');
var Promise = require('promise');


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

Parser.getSemester = function (grade, semester, user) {
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

Parser.getTable = function (table) {

};
