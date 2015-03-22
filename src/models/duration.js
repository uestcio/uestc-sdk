// 外部依赖

var _ = require('lodash');


// 构造函数

function Duration(weeks, day, indexes, place) {
    this.weeks = weeks;
    this.day = day;
    this.indexes = indexes;
    this.place = place;
    this.__init__();
}

module.exports = Duration;


// 静态字段


// 静态方法


// 实例方法


// 非公开方法

Duration.prototype.__init__ = function () {
    this.fromWeek = _.indexOf(this.weeks, '1') + 1;
    this.toWeek = _.lastIndexOf(this.weeks, '1') + 1;
    this.parity = this.weeks[this.fromWeek] === '1'? 4: (this.fromWeek % 2 !== 0? 1: 2);
    this.fromIndex = _.indexOf(this.indexes, '1') + 1;
    this.toIndex = _.lastIndexOf(this.indexes, '1') + 1;
    this.span = this.toIndex - this.fromIndex + 1;
};
