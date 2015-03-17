// 外部依赖

var jsdom = require('jsdom');


// 构造函数

function Parser() {
}

module.exports = Parser;


// 静态字段


// 静态方法

Parser.get$ = function (html, callback) {
    var env = jsdom.env;

    env(html, function (errors, window) {
        console.log(errors);
        var $ = require('jquery')(window);
        callback($);
    });
};
