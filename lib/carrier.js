var http = require('http');
var querystring = require('querystring');


function Carrier() {
}

module.exports = Carrier;

Carrier._singleton_ = null;

Carrier.singleton = function () {
    if(!Carrier._singleton_) {
        Carrier._singleton_ = new Carrier();
    }
    return Carrier._singleton_;
};

Carrier.prototype.post = function (url, data, callback) {
    var contents = querystring.stringify(data);
    var options = Carrier.getPostHeader(url, contents);
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            callback(null, data);
        });
    });

    req.on('error', function (error) {
        callback(error);
    });

    req.write(contents);
    req.end();
};

Carrier.getPostHeader = function (url, contents) {
    var host = Carrier.getHostAndPath(url).host;
    var path = Carrier.getHostAndPath(url).path;
    return {
        host: host,
        path: path,
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Length': contents.length,
            'Connection': 'Keep-Alive',
            'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)'
        }
    }
};

Carrier.getHostAndPath = function (url) {
    var index0 = url.indexOf('://');
    var peeled = url.substr(index0 + 3);
    var index1 = peeled.indexOf('/');
    var host, path;
    if(index1 > 0) {
        host = peeled.substring(0, index1);
        path = peeled.substring(index1);
    }
    else {
        host = peeled;
        path = '/';
    }
    return {
        'host': host,
        'path': path
    };
};

