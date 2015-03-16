// 外部依赖

var http = require('http');
var https = require('https');
var querystring = require('querystring');


// 构造方法

function Carrier() {
}

module.exports = Carrier;


/// 静态字段

Carrier._singleton_ = null;


// 静态方法

Carrier.getPostOptions = function (host, path, contents) {
    return {
        hostname: host,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': contents.length
        }
    }
};

Carrier.getUrlMeta = function (url) {
    var index0 = url.indexOf('://');
    var peeled = url.substr(index0 + 3);
    var protocol = url.substring(0, index0);
    var index1 = peeled.indexOf('/');
    var host, path;
    if (index1 > 0) {
        host = peeled.substring(0, index1);
        path = peeled.substring(index1);
    }
    else {
        host = peeled;
        path = '/';
    }
    return {
        'protocol': protocol,
        'host': host,
        'path': path
    };
};

Carrier.singleton = function () {
    if (!Carrier._singleton_) {
        Carrier._singleton_ = new Carrier();
    }
    return Carrier._singleton_;
};


// 实例方法

Carrier.prototype.post = function (url, data, wait, callback) {
    var contents = querystring.stringify(data);
    var meta = Carrier.getUrlMeta(url);
    var options = Carrier.getPostOptions(meta.host, meta.path, contents);
    var protocolMap = {
        'http': http,
        'https': https
    };
    var req = protocolMap[meta.protocol].request(options, function (res) {
        res.setEncoding('utf8');
        if (!wait) {
            callback(null, {
                status: res.statusCode,
                headers: res.headers
            });
        }
        else {
            res.on('data', function (data) {
                callback(null, {
                    status: res.statusCode,
                    headers: res.headers,
                    data: data
                });
            });
        }
    });

    req.on('error', function (error) {
        callback(error);
    });

    req.write(contents);
    req.end();
};
