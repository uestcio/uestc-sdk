// 外部依赖


// 构造函数

function Enrollment(course, user) {
    this.course = course;
    this.user = user;
}

module.exports = Enrollment;


// 静态字段


// 静态方法


// 实例方法


// 非公开方法

Enrollment.prototype.__setField__ = function (field, val) {
    if(val == null || val == undefined || val == '') {
        return;
    }
    if(field == 'id') {
        return;
    }
    this[field] = val;
};
