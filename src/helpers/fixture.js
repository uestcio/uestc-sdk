// 外部依赖



// 构造方法

function Fixture() {
}

module.exports = Fixture;


// 静态字段

Fixture.courseTypes = Fixture.prototype.courseType = {
    all: '',
    publicDisciplinary: '公共基础课',
    basicDisciplinary: '学科基础课',
    basicDisciplinaryElective: '学科基础课（选修）',
    practicalEducation: '实践性教学',
    majorDisciplinary: '专业基础课',
    majorElective: '专业选修课',
    innovationCredit: '创新学分',
    qualityElective: '素质教育选修课'
};

Fixture.departments = Fixture.prototype.departments = {
    scie: '通信与信息工程学院',
    ncl: '通信抗干扰技术国家级重点实验室',
    ee: '电子工程学院',
    me: '微电子与固体电子学院',
    pe: '物理电子学院',
    soei: '光电信息学院',
    ccse: '计算机科学与工程学院',
    ss: '信息与软件工程学院',
    auto: '自动化工程学院',
    jxdz: '机械电子工程学院',
    life: '生命科学与技术学院',
    math: '数学科学学院',
    mgmt: '经济与管理学院',
    rw: '政治与公共管理学院',
    fl: '外国语学院',
    my: '马克思主义教育学院',
    energy: '能源科学与工程学院',
    sre: '资源与环境学院',
    iaa: '航空航天学院',
    gla: '格拉斯哥学院',
    med: '医学院',
    sport: '体育部',
    yingcai: '英才实验学院',
    iffs: '基础与前沿研究院'
};
