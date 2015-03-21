// 外部依赖

var Application = require('./application');
var Fixture = require('./helpers/fixture');
var MissionUtil = require('./helpers/missionutil');
var Keeper = require('./helpers/keeper');

// 构造方法

function Sdk() {
}

exports = module.exports = Sdk;

Sdk._singleton_ = Sdk._singleton_ || null;

Sdk.create = function () {
    Sdk._singleton_ = new Application();
    return Sdk._singleton_;
};

Sdk.getFixture = function () {
    return Fixture;
};

Sdk.single = function () {
    if(!Sdk._singleton_) {
        Sdk._singleton_ = new Application();
    }
    if(arguments.length != 0) {
        Sdk.__begin__();
    }
    return Sdk._singleton_;
};

Sdk.__begin__ = function () {
    Keeper.addTask(0, MissionUtil.getUserLoginMission(Sdk.single()));
    Keeper.addTask(1, MissionUtil.getUserDetailMission(Sdk.single()));
    Keeper.addTask(2, MissionUtil.getUserCoursesMission(Sdk.single()));
    Keeper.addTask(3, MissionUtil.getUserScoresMission(Sdk.single()));
    Keeper.addTask(4, MissionUtil.getUserExamsMission(Sdk.single()));
    Keeper.start();
};


