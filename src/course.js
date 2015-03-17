// 外部依赖




// 构造函数

function Course() {
    this.title = '';
    this.code = '';
    this.id = '';
    this.credit = -1;
    this.hours = -1;
    this.semester = -1;
    this.type = Course.types.all;
}

module.exports = Course;


// 静态字段

Course.types = {
    all: 0,
    publicDisciplinary: 1,
    basicDisciplinary: 2,
    basicDisciplinaryElective: 3,
    practicalEducation: 4,
    majorDisciplinary: 5,
    majorElective: 6,
    innovationCredit: 7,
    qualityElective: 8
};

// 静态方法


// 实例方法

