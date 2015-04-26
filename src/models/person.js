// 外部依赖
var _ = require('lodash');

// 构造函数

function Person(id) {
    this.id = id;
}

module.exports = Person;


// 静态字段


// 静态方法


// 实例方法
Person.prototype.__merge__ = function (person) {
    var self = this;
    _.forEach(person, function (val, field) {
        self.__setField__(field, val);
    });
    return self;
};

// 非公开方法

Person.prototype.__setField__ = function (field, val) {
    var self = this;
    if (val === undefined || val != val || val === '' || _.isFunction(val)) {
        return;
    }
    switch (field) {
        case 'id':
        case 'name':
        case 'metier':
        case 'deptName':
        case 'description':
            self[field] = val;
            break;
    }
};
