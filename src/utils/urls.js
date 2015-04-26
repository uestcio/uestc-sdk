// 外部依赖
var moment = require('moment');

// 构造函数

function Urls() {
}

module.exports = Urls;


// 静态字段


// 静态方法

Urls.appSearchCoursesPre = function (user) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/publicSearch.action',
        jar: user._jar_
    };
};

Urls.appSearchCourses = function (user, options) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/publicSearch!search.action',
        form: {
            'lesson.course.name': options.name || '',
            'teacher.name': options.instructor || '',
            'limitGroup.grade': options.grade || ''
        },
        jar: user._jar_
    };
};

Urls.appSearchPeoplePre = function (user) {
    return {
        url: 'http://portal.uestc.edu.cn/pnull.portal?action=globalGroupsTree&.ia=false&.pmn=view&.pen=personnelGroupmanager&groupId&identity=undefined&authorize=undefined',
        jar: user._jar_
    };
};

Urls.appSearchPeople = function (user, term, limit) {
    return {
        url: 'http://portal.uestc.edu.cn/pnull.portal?action=fetchUsers&.ia=false&.pmn=view&.pen=personnelGroupmanager',
        form: {
            'limit': limit,
            'oper_type': 'normal_user',
            'term': term
        },
        jar: user._jar_
    };
};

Urls.userEnsureLogin = function (user) {
    return {
        url: 'http://portal.uestc.edu.cn/login.portal',
        jar: user._jar_
    };
};

Urls.userAllScores = function (user) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR',
        jar: user._jar_
    };
};

Urls.userConsumptionsPre = function (user) {
    return {
        url: 'http://ecard.uestc.edu.cn/c/portal/layout?p_l_id=1',
        jar: user._jar_
    };
};

Urls.userConsumptions = function (user, from, to) {
    return {
        url: 'http://ecard.uestc.edu.cn/c/portal/layout?p_l_id=1&p_p_id=querydetail&p_p_action=1&p_p_state=maximized&p_p_mode=view&p_p_width=270&p_p_col_order=n1&p_p_col_pos=1&p_p_col_count=3&_querydetail_struts_action=%2Fecardtransaction%2Fquerydetail_result',
        form: {
            'beginDate': from || moment().format('YYYY/MM/DD'),
            'endDate': to || moment().format('YYYY/MM/DD'),
            'cardId': user._cardId_
        },
        jar: user._jar_
    };
};

Urls.userDetail = function (user) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/stdDetail.action',
        jar: user._jar_
    };
};

Urls.userSemesterExams = function (user, semester) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/stdExamTable!examTable.action?semester.id=' + semester + '&examType.id=1',
        jar: user._jar_
    };
};

Urls.userLogin = function (number, password) {
    return {
        url: 'https://uis.uestc.edu.cn/amserver/UI/Login',
        form: {
            'IDToken0': '',
            'IDToken1': number,
            'IDToken2': password,
            'IDButton': 'Submit',
            'goto': 'aHR0cDovL3BvcnRhbC51ZXN0Yy5lZHUuY24vbG9naW4ucG9ydGFs',
            'encoded': 'true',
            'gx_charset': 'UTF-8'
        }
    };
};

Urls.userSemesterCourses = function (user, semester, ids) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action',
        form: {
            'ignoreHead': 1,
            'setting.kind': 'std',
            'startWeek': 1,
            'project.id': 1,
            'semester.id': semester,
            'ids': ids
        },
        jar: user._jar_
    };
};

Urls.userSemesterCoursesPre = function (user) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/courseTableForStd.action',
        jar: user._jar_
    };
};

Urls.userSemesterScores = function (user, semester) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/teach/grade/course/person!search.action?semesterId=' + semester,
        jar: user._jar_
    };
};
