function Application() {
}

module.exports = Application;

Application.prototype.login = function (number, password) {
    var url = 'https://uis.uestc.edu.cn/amserver/UI/Login';
    var data = {
        'IDToken0': '',
        'IDToken1': number,
        'IDToken2': password,
        'IDButton': 'Submit',
        'goto': 'aHR0cDovL3BvcnRhbC51ZXN0Yy5lZHUuY24vbG9naW4ucG9ydGFs',
        'encoded': true,
        'gx_charset': 'UTF-8'
    };

    this._carrier_.post(url, data);

    return {};
};
