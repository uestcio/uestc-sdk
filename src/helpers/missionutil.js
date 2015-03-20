

function MissionUtil() {
}

module.exports = MissionUtil;


MissionUtil.getUserLoginMission = function (app) {
    return function (callback) {
        var user = app._current_;
        if(user) {
            user.__login__().then(function (res) {
                console.log('Login success at ' + new Date());
                callback(null, res);
            }, function (err) {
                console.log('Login failed at ' + new Date() + ', because of ' + err);
                callback(err);
            });
        }
        else {
            console.log('Login unavailable because of no user');
        }
    };
};

MissionUtil.getUserDetailMission = function (app) {
    return function (callback) {
        var user = app._current_;
        if(user) {
            user.__getDetailOnline__().then(function (res) {
                console.log('Get detail success at ' + new Date());
                callback(null, res);
            }, function (err) {
                console.log('Get detail failed at ' + new Date() + ', because of ' + err);
                callback(err);
            });
        }
        else {
            console.log('Get detail unavailable because of no user');
        }
    };
};

MissionUtil.getUserCoursesMission = function (app) {
    return function (callback) {
        var user = app._current_;
        if(user) {
            user.__getAllCourses__().then(function (res) {
                console.log('Get courses success at ' + new Date());
                callback(null, res);
            }, function (err) {
                console.log('Get courses failed at ' + new Date() + ', because of ' + err);
                callback(err);
            });
        }
        else {
            console.log('Get courses unavailable because of no user');
        }
    };
};

MissionUtil.getUserScoresMission = function (app) {
    return function (callback) {
        var user = app._current_;
        if(user) {
            user.__getAllScores__().then(function (res) {
                console.log('Get scores success at ' + new Date());
                callback(null, res);
            }, function (err) {
                console.log('Get scores failed at ' + new Date() + ', because of ' + err);
                callback(err);
            });
        }
        else {
            console.log('Get scores unavailable because of no user');
        }
    };
};

MissionUtil.getUserExamsMission = function (app) {
    return function (callback) {
        var user = app._current_;
        if(user) {
            //user.__getAllExams__().then(function (res) {
            //    console.log('Get exams success at ' + new Date());
            //    callback(null, res);
            //}, function (err) {
            //    console.log('Get exams failed at ' + new Date() + ', because of ' + err);
            //    callback(err);
            //});
            callback(new Error('Get exams mission has not been completed yet'));
        }
        else {
            console.log('Get exams unavailable because of no user');
        }
    };
};
