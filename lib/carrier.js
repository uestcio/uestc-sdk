var http = require('http');
var https = require('https');
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
    var meta = Carrier.getMeta(url);
    var options = Carrier.getPostHeader(meta.host, meta.path, contents);
    console.log(options);
    var protocolMap = {
        'http': http,
        'https': https
    };
    var req = protocolMap[meta.protocol].request(options, function (res) {
        res.setEncoding('utf8');
        console.log("statusCode: ", res.statusCode + '\n');
        console.log("headers: ", res.headers + '\n');
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

Carrier.getPostHeader = function (host, path, contents) {
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

Carrier.getMeta = function (url) {
    var index0 = url.indexOf('://');
    var peeled = url.substr(index0 + 3);
    var protocol = url.substring(0, index0);
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
        'protocol': protocol,
        'host': host,
        'path': path
    };
};

