// 外部依赖


// 构造函数

function Score(course) {
    this.course = course;
}

module.exports = Score;


// 静态字段


// 静态方法


// 实例方法


// 非公开方法

Score.prototype.__setField__ = function (field, val) {
    if(val == null || val == undefined || val == '') {
        return;
    }
    if(field == 'id') {
        return;
    }
    this[field] = val;
};
