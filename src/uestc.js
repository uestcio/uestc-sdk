// 外部依赖
var Application = require('./application');
var Fixture = require('./helpers/fixture');
var MissionUtil = require('./helpers/missionutil');
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

// SDK 初始化（开启定时任务）
Sdk.__begin__ = function () {
    Keeper.addTask(0, MissionUtil.getUserLoginMission(Sdk.single()));
    Keeper.addTask(1, MissionUtil.getUserDetailMission(Sdk.single()));
    Keeper.addTask(2, MissionUtil.getUserCoursesMission(Sdk.single()));
    Keeper.addTask(3, MissionUtil.getUserScoresMission(Sdk.single()));
    Keeper.addTask(4, MissionUtil.getUserExamsMission(Sdk.single()));
    Keeper.start();
};


