// 外部依赖

var _ = require('lodash');
var Promise = require('promise');

var Course = require('../structure/course');


// 构造函数

function Peeler() {
}

module.exports = Peeler;


// 静态字段

Peeler.fixtures = {
    CourseTable: function (year, semester) {
        this.year = year;
        this.semester = semester;
        this.activities = [];
        _.times(12 * 7, function (n) {
            this.activities[n] = [];
        }, this);
    },
    TaskActivity: function (uk1, instructor, uk2, titleAndId, uk3, place, weeks) {
        this.uk1 = uk1;
        this.instructor = instructor;
        this.uk2 = uk2;
        this.titleAndId = titleAndId;
        this.uk3 = uk3;
        this.place = place;
        this.weeks = weeks;
    }
};


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
            if (!timeTable[id]) {
                timeTable[id] = [];
            }
            var before = _.find(timeTable[id], function (time) {
                return (time.day == day) && (time.place == place) &&
                    (time.weeks == weeks) && (time.index + time.span == index);
            });
            if (before) {
                before.span += 1;
            }
            else {
                timeTable[id].push({day: day, index: index, span: 1, place: place, weeks: weeks});
            }
        }
    }
    return timeTable;
};

Peeler.getUserSemesterCourses = function (html) {
    var raws = html.match(/var table0[\S\s]*?table0\.marshalTable/)[0];
    raws = raws.replace('table0.marshalTable', '');
    var CourseTable = Peeler.fixtures.CourseTable;
    var TaskActivity = Peeler.fixtures.TaskActivity;
    eval(raws);
    return Peeler.getTable(table0);
};
