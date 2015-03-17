// 外部依赖


// 构造函数

function UrlUtil() {
}

module.exports = UrlUtil;


// 静态字段


// 静态方法

UrlUtil.getApplicationSearchCoursePrepareMeta = function (user) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/publicSearch.action',
        jar: user.jar
    }
};

UrlUtil.getApplicationSearchCourseMeta = function (user, options) {
    return {
        url: 'http://eams.uestc.edu.cn/eams/publicSearch!search.action',
        data: {
            'lesson.course.name': options.name || '',
            'teacher.name': options.instructor || '',
            'limitGroup.grade': options.grade || ''
        },
        jar: user.jar
    }
};

UrlUtil.getApplicationSearchPersonMeta = function (user, term, limit) {
    return {
        url: 'http://portal.uestc.edu.cn/pnull.portal?action=fetchUsers&.ia=false&.f=f20889&.pmn=view&.pen=personnelGroupmanager',
        data: {
            'start': 0,
            'limit': limit,
            'oper_type': 'normal_user'
        }
    };
};

UrlUtil.getUserLoginMeta = function (number, password) {
    return {
        url: 'https://uis.uestc.edu.cn/amserver/UI/Login',
        data: {
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


