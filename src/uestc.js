// Sdk的根文件，用于创建应用实例及配置相关选项

// 外部依赖
var Application = require('./application');
var Tasks = require('./utils/tasks');
var Keeper = require('./helpers/keeper');

// 构造方法
function Sdk() {
}

// 模块输出
exports = module.exports = Sdk;

// 记录当前使用的单例
Sdk._singleton_ = Sdk._singleton_ || null;

// 记录当前的参数
Sdk._options_ = Sdk._options_ || {};

// 配置 SDK 方法
Sdk.config = function (options) {
    Sdk._options_ = options;
};

// 创建新的 SDK 实例
Sdk.create = function () {
    Sdk._singleton_ = new Application();
    return Sdk._singleton_;
};

// 使用单一的 SDK 实例
Sdk.single = function () {
    if(!Sdk._singleton_) {
        Sdk._singleton_ = new Application();
    }
    if(arguments.length != 0) {
        Sdk.__begin__();
    }
    return Sdk._singleton_;
};

// 未来将替换上面两种方法的唯一获取应用实例方法
Sdk.getApp = function () {
    return Sdk.single();
};

// SDK 初始化（开启定时任务）
Sdk.__begin__ = function () {
    Keeper.addTask(0, Tasks.userLogin(Sdk.getApp()));
    Keeper.addTask(1, Tasks.userDetail(Sdk.getApp()));
    Keeper.addTask(2, Tasks.userCourses(Sdk.getApp()));
    Keeper.addTask(3, Tasks.userScores(Sdk.getApp()));
    Keeper.addTask(4, Tasks.userExams(Sdk.getApp()));
    Keeper.start();
};


