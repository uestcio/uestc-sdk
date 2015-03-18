// 外部依赖

var request = require('request');
var Promise = require('promise');


// 构造函数

function Carrier() {
}

module.exports = Carrier;


// 静态字段


// 静态方法

Carrier.get = function (meta) {
    return new Promise(function (fulfill, reject) {
        request.get(meta, function (err, httpResponse, body) {
            if (err) {
                reject(err);
            }
            else {
                fulfill({httpResponse: httpResponse, body: body});
            }
        });
    });
};

Carrier.jar = request.jar;

Carrier.post = function (meta) {
    return new Promise(function (fulfill, reject) {
        request.post(meta, function (err, httpResponse, body) {
            if (err) {
                reject(err);
            }
            else {
                fulfill({httpResponse: httpResponse, body: body});
            }
        });
    });
};


// 实例方法


// 非公开方法

