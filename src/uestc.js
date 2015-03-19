// 外部依赖

var Application = require('./application');


// 构造方法

function Sdk() {
}

exports = module.exports = Sdk;

Sdk._singleton_ = Sdk._singleton_ || null;

Sdk.create = function () {
    Sdk._singleton_ = new Application();
    return Sdk._singleton_;
};

Sdk.single = function () {
    if(!Sdk._singleton_) {
        Sdk._singleton_ = new Application();
    }
    return Sdk._singleton_;
};


