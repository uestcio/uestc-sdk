// 外部依赖

var _ = require('lodash');

// 构造函数

function StdDetail(id) {
    this.id = id;
    this.__init__();
}

module.exports = StdDetail;


// 静态字段


// 静态方法


// 实例方法


// 非公开方法

StdDetail.prototype.__init__ = function () {
    this.direction = '';
    this.educationType = '';
};

StdDetail.prototype.__setField__ = function (field, val) {
    var self = this;
    if (val === null || val === undefined || val != val || val === '' || _.isFunction(val)) {
        return;
    }
    switch (field) {
        case 'id':
        case 'name':
        case 'englishName':
        case 'gender':
        case 'project':
        case 'qualification':
        case 'type':
        case 'college':
        case 'major':
        case 'direction':
        case 'administrationCollege':
        case 'studyType':
        case 'educationType':
        case 'status':
        case 'administrationClass':
        case 'campus':
            self[field] = val;
            break;
        case 'grade':
        case 'length':
            self[field] = +val;
            break;
        case 'fromDate':
        case 'toDate':
            self[field] = new Date(val);
            break;
        case 'inEnrollment':
        case 'inSchool':
            self[field] = (val == '是');
            break;
    }
};
