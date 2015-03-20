// 外部依赖

var _ = require('lodash');
var Promise = require('promise');

var Course = require('../structure/course');


// 构造函数

function Peeler() {
}

module.exports = Peeler;


// 静态字段


// 静态方法

Peeler.getTable = function (table) {
    var timeTable = {};
    for (var i in table.activities) {
        for (var j in table.activities[i]) {
            var course = table.activities[i][j];
            var id = _.words(course.uk2, /[\w\d\.]+/g)[1];
            var day = parseInt(i / 12) + 1;
            var index = parseInt(i % 12);
            var place = course.place;
            var weeks = course.weeks.substr(1, 24);
            if(!timeTable[id]) {
                timeTable[id] = [];
            }
            var before = _.find(timeTable[id], function (time) {
                return (time.day == day) && (time.place == place) &&
                    (time.weeks == weeks) && (time.index + time.span == index);
            });
            if(before) {
                before.span += 1;
            }
            else {
                timeTable[id].push({day: day, index: index, span: 1, place: place, weeks: weeks});
            }
        }
    }
    return timeTable;
};
