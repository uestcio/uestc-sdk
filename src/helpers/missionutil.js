var _ = require('lodash');
var async = require('async');

function MissionUtil() {
}

module.exports = MissionUtil;


MissionUtil.getUserLoginMission = function (app) {
    return function (callback) {
        var users = app._users_;
        if (_.size(users) > 0) {
            async.parallelLimit(_.map(users, function (user) {
                return function (callback) {
                    user.__login__().then(function (res) {
                        console.log(user._number_ + ' login success at ' + new Date());
                        callback(null, res);
                    }, function (err) {
                        console.log(user._number_ + ' login failed at ' + new Date() + ', because of ' + err);
                        callback(null);
                    });
                }
            }), 3, function (err, results) {
                err ? console.log('Login mission failed at ' + new Date() + ' because of ' + err):
                    console.log('Login mission over at ' + new Date());
                callback(err, results);
            });
        }
        else {
            var message = 'Login unavailable because of no user at' + new Date();
            console.log(message);
            callback(null);
        }
    };
};

MissionUtil.getUserDetailMission = function (app) {
    return function (callback) {
        var users = app._users_;
        if (_.size(users) > 0) {
            async.parallelLimit(_.map(users, function (user) {
                return function (callback) {
                    user.__getDetailOnline__().then(function (res) {
                        console.log(user._number_ + ' get detail success at ' + new Date());
                        callback(null, res);
                    }, function (err) {
                        console.log(user._number_ + ' get detail failed at ' + new Date() + ', because of ' + err);
                        callback(null);
                    });
                }
            }), 3, function (err, results) {
                err ? console.log('Get detail mission failed at ' + new Date() + ' because of ' + err):
                    console.log('Get detail mission over at ' + new Date());
                callback(err, results);
            });
        }
        else {
            var message = 'Get detail unavailable because of no user at' + new Date();
            console.log(message);
            callback(null);
        }
    };
};

MissionUtil.getUserCoursesMission = function (app) {
    return function (callback) {
        var users = app._users_;
        if (_.size(users) > 0) {
            async.parallelLimit(_.map(users, function (user) {
                return function (callback) {
                    user.__getAllCourses__().then(function (res) {
                        console.log(user._number_ + ' get courses success at ' + new Date());
                        callback(null, res);
                    }, function (err) {
                        console.log(user._number_ + ' get courses failed at ' + new Date() + ', because of ' + err);
                        callback(null);
                    });
                }
            }), 3, function (err, results) {
                err ? console.log('Get courses mission failed at ' + new Date() + ' because of ' + err):
                    console.log('Get courses mission success at ' + new Date());
                callback(err, results);
            });
        }
        else {
            var message = 'Get courses unavailable because of no user at' + new Date();
            console.log(message);
            callback(null);
        }
    };
};

MissionUtil.getUserScoresMission = function (app) {
    return function (callback) {
        var users = app._users_;
        if (_.size(users) > 0) {
            async.parallelLimit(_.map(users, function (user) {
                return function (callback) {
                    user.__getAllScores__().then(function (res) {
                        console.log(user._number_ + ' get scores success at ' + new Date());
                        callback(null, res);
                    }, function (err) {
                        console.log(user._number_ + ' get scores failed at ' + new Date() + ', because of ' + err);
                        callback(null);
                    });
                }
            }), 3, function (err, results) {
                err ? console.log('Get scores mission failed at ' + new Date() + ' because of ' + err):
                    console.log('Get scores mission over at ' + new Date());
                callback(err, results);
            });
        }
        else {
            var message = 'Get scores unavailable because of no user at' + new Date();
            console.log(message);
            callback(null);
        }
    };
};

MissionUtil.getUserExamsMission = function (app) {
    return function (callback) {
        var users = app._users_;
        if (_.size(users) > 0) {
            async.parallelLimit(_.map(users, function (user) {
                return function (callback) {
                    user.__getAllExams__().then(function (res) {
                        console.log(user._number_ + ' get exams success at ' + new Date());
                        callback(null, res);
                    }, function (err) {
                        console.log(user._number_ + ' get exams failed at ' + new Date() + ', because of ' + err);
                        callback(null);
                    });
                }
            }), 3, function (err, results) {
                err ? console.log('Get exams mission failed at ' + new Date() +' because of ' + err):
                    console.log('Get exams mission over at ' + new Date());
                callback(err, results);
            });
        }
        else {
            var message = 'Get exams unavailable because of no user at' + new Date();
            console.log(message);
            callback(null);
        }
    };
};
