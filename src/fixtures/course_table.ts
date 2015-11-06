const delimiter: string = "<br>"

/***************************************************************************
* course table dispaly occupy of teacher,room and andminClass. It also
* represent data model of any course arrangement. For example student's
* course table,single course's table,teacher's course table,and
* adminClass's course table,even major's .
**************************************************************************/
export class CourseTable {
    unitCounts: any;
    activities: any[];
    year: any;
    endAtSat: boolean;
    marshalContents: any[];
    marshal: any;
    isSame: any;
    fill: any;

    constructor (year: number, unitCounts: number) {
        this.unitCounts = unitCounts;
        this.activities = [unitCounts];
        this.year = year;
        var date = new Date();
        // 日期中的月份为该月份的数字减一
        date.setFullYear(year, 11, 31);
        this.endAtSat = false;
        if (6 == date.getDay()) {
            this.endAtSat = true;
        }

        this.marshalContents = new Array(unitCounts);
        for (var k = 0; k < unitCounts; k++) {
            this.activities[k] = [];
        }

        this.marshal = this.marshalByTeacherCourse;
        // return true,if this.activities[first] and this.activities[second] has
        // same vaildWeeks and roomId pair set.
        this.isSame = this.isSameActivities;
        this.fill = this.fillTable;
    }

    fillTable(tableId: string, weeks: number, units: number) {
        var courseTable = document.getElementById(tableId);
        if (courseTable == null) { return; }
        for (var i = 0; i < weeks; i++) {
            for (var j = 0; j < units - 1; j++) {
                var index = units * i + j;
                var preTd = document.getElementById("TD" + index);
                var nextTd = document.getElementById("TD" + (index + 1));
                while (this.marshalContents[index] != null && this.marshalContents[index + 1] != null && this.marshalContents[index] == this.marshalContents[index + 1]) {
                    preTd.parentNode.removeChild(nextTd);
                    var spanNumber = (<any>preTd).colSpan;
                    spanNumber++;
                    (<any>preTd).colSpan = spanNumber;
                    j++;
                    if (j >= units - 1) {
                        break;
                    }
                    index = index + 1;
                    nextTd = document.getElementById("TD" + (index + 1));
                }
            }
        }

        for (var k = 0; k < this.unitCounts; k++) {
            var td = document.getElementById("TD" + k);
            if (td != null && this.marshalContents[k] != null) {
                td.innerHTML = this.marshalContents[k];
                td.style.backgroundColor = "#94aef3";
                td.className = "infoTitle";
            }
        }

    }
    
    // return true,if this.activities[first] and this.activities[second] has
    // same activities .
    isSameActivities(first: number, second: number) {
        if (this.activities[first].length != this.activities[second].length) {
            return false;
        }
        if (this.activities[first].length == 1) {
            return this.activities[first][0].isSame(this.activities[second][0]);
        }
        for (var i = 0; i < this.activities[first].length; i++) {
            var find = false;
            for (var j = 0; j < this.activities[second].length; j++) {
                if (this.activities[first][i].isSame(this.activities[second][j])) {
                    find = true; break;
                }
            }
            if (find === false) {
                return false;
            }
        }
        return true;
    }

    isTimeConflictWith(otherTable: CourseTable) {
        for (var i = 0; i < this.unitCounts; i++) {
            if (this.activities[i].length !== 0 && otherTable.activities[i].length !== 0) {
                for (var m = 0; m < this.activities[i].length; m++) {
                    for (var n = 0; n < otherTable.activities[i].length; n++) {
                        for (var k = 0; k < this.activities[i][m].vaildWeeks.length; k++) {
                            if (this.activities[i][m].vaildWeeks.charAt(k) == '1'
                                && otherTable.activities[i][n].vaildWeeks.charAt(k) == '1') {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    
    /**
    * aggreagate activity of same course. first merge the activity of same
    * (teacher,course,room). then output mashal vaildWeek string . if course is
    * null. the course name will be ommited in last string. style is
    * -------------------------------- | teacher1Name course1Name | |
    * (odd1-2,room1Name) | | (even2-4,room2Name) | | teacher2Name course1Name | |
    * (odd3-6,room1Name) | | (even5-8,room2Name) |
    * ----------------------------------
    * 
    * @param index
    *            time unit index
    * @param from
    *            start position in year occupy week
    * @param startWeek
    *            bengin position from [from]
    * @param endWeek
    *            end position from [from]
    */
    marshalByTeacherCourse(index: number, from: number, startWeek: number, endWeek: number) {
        var validStart = from + startWeek - 2;
        if (this.activities[index].length === 0) { return ""; }
        if (this.activities[index].length == 1) {
            var cname = this.activities[index][0].courseName;
            var tname = this.activities[index][0].teacherName;
            return tname + " " + cname + delimiter + "(" + this.activities[index][0].adjustClone(this.endAtSat, validStart, false).marshal(from, startWeek, endWeek) + ")";
        }
        else {
            var marshalString = "";
            var tempActivities = new Array();
            tempActivities[0] = this.activities[index][0].adjustClone(this.endAtSat, validStart, true);
            // merge this.activities to tempActivities by same courseName and
            // roomId .start with 1.
            for (var i = 1; i < this.activities[index].length; i++) {
                var merged = false;
                for (var j = 0; j < tempActivities.length; j++) {
                    if (this.activities[index][i].canMergeWith(tempActivities[j])) {
                        // alert(tempActivities[j]+"\n"
                        // +this.activities[index][i]);
                        merged = true;
                        var secondWeeks = this.activities[index][i].vaildWeeks;
                        if (this.activities[index][i].needLeftShift(this.endAtSat, validStart)) {
                            secondWeeks = this.activities[index][i].vaildWeeks.substring(1, 53) + "0";
                        }
                        tempActivities[j].vaildWeeks = this.or(tempActivities[j].vaildWeeks, secondWeeks);
                    }
                }
                if (!merged) {
                    tempActivities[tempActivities.length] = this.activities[index][i].adjustClone(this.endAtSat, validStart, false);
                }
            }
            
            // marshal tempActivities
            for (var m = 0; m < tempActivities.length; m++) {
                if (tempActivities[m] === null) {
                    continue;
                }
                var courseName = tempActivities[m].courseName;
                var teacherName = tempActivities[m].teacherName;
                // add teacherName and courseName
                if (courseName !== null) { marshalString += delimiter + teacherName + " " + courseName;/* alert(courseName); */ }
                marshalString += delimiter + "(" + tempActivities[m].marshal(from, startWeek, endWeek) + ")";
                for (var n = m + 1; n < tempActivities.length; n++) {
                    // marshal same courseName activity
                    if (tempActivities[n] !== null && courseName == tempActivities[n].courseName && teacherName == tempActivities[n].teacherName) {
                        marshalString += delimiter + "(" + tempActivities[n].marshal(from, startWeek, endWeek) + ")";
                        tempActivities[n] = null;
                    }
                }
            }

            if (marshalString.indexOf(delimiter) === 0) {
                return marshalString.substring(delimiter.length);
            }
            else {
                return marshalString;
            }
        }
    }
    
    // 
    marshalTable(from: number, startWeek: number, endWeek: number) {
        for (var k = 0; k < this.unitCounts; k++) {
            if (this.activities[k].length > 0) {
                this.marshalContents[k] = this.marshal(k, from, startWeek, endWeek);
            }
        }
    }

    marshalTableForAdminclass(from: number, startWeek: number, endWeek: number) {
        for (var k = 0; k < this.unitCounts; k++) {
            if (this.activities[k].length > 0) {
                this.marshalContents[k] = this.marshalForAdminclass(k, from, startWeek, endWeek);
            }
        }
    }

    marshalForAdminclass(index: number, from: number, startWeek: number, endWeek: number) {
        var validStart = from + startWeek - 2;
        if (this.activities[index].length === 0) { return ""; }
        if (this.activities[index].length == 1) {
            var cname = this.activities[index][0].courseName;
            var tname = this.activities[index][0].teacherName;
            var roomOccupancy = "(" + this.activities[index][0].adjustClone(this.endAtSat, validStart, false).marshal(from, startWeek, endWeek) + ")";
            return tname + " " + cname + roomOccupancy;
        }
        else {
            var marshalString = "";
            var tempActivities = new Array();
            tempActivities[0] = this.activities[index][0].adjustClone(this.endAtSat, validStart, true);
            // merge this.activities to tempActivities by same courseName and
            // roomId .start with 1.
            for (var i = 1; i < this.activities[index].length; i++) {
                var merged = false;
                for (var j = 0; j < tempActivities.length; j++) {
                    if (this.activities[index][i].canMergeWith(tempActivities[j])) {
                        // alert(tempActivities[j]+"\n"
                        // +this.activities[index][i]);
                        merged = true;
                        var secondWeeks = this.activities[index][i].vaildWeeks;
                        if (this.activities[index][i].needLeftShift(this.endAtSat, validStart)) {
                            secondWeeks = this.activities[index][i].vaildWeeks.substring(1, 53) + "0";
                        }
                        tempActivities[j].vaildWeeks = this.or(tempActivities[j].vaildWeeks, secondWeeks);
                    }
                }
                if (!merged) {
                    tempActivities[tempActivities.length] = this.activities[index][i].adjustClone(this.endAtSat, validStart, false);
                }
            }
            
            // marshal tempActivities
            for (var m = 0; m < tempActivities.length; m++) {
                if (tempActivities[m] === null) {
                    continue;
                }
                var courseName = tempActivities[m].courseName;
                var teacherName = tempActivities[m].teacherName;
                // add teacherName and courseName
                var tipStr = "";
                if (courseName !== null) {
                    tipStr = courseName + "(" + tempActivities[m].marshal(from, startWeek, endWeek) + ")";
                }
                if (marshalString.indexOf(tipStr) == -1) {
                    marshalString += delimiter + tipStr;
                }
            }

            if (marshalString.indexOf(delimiter) === 0) {
                return marshalString.substring(delimiter.length);
            }
            else {
                return marshalString;
            }
        }
    }
    
    // merger activity in every unit.
    mergeAll() {
        for (var i = 0; i < this.unitCounts; i++) {
            if (this.activities[i].length > 1) {
                for (var j = 1; j < this.activities[i].length; j++) {
                    this.activities[i][0].vaildWeeks = this.or(this.activities[i][0].vaildWeeks, this.activities[i][j].vaildWeeks);
                    this.activities[i][j] = null;
                }
            }
        }
    }
    
    // merger activity in every unit by course.
    mergeByCourse () {
        for (var i = 0; i < this.unitCounts; i++) {
            if (this.activities[i].length > 1) {
                // O(n^2)
                for (var j = 0; j < this.activities[i].length; j++) {
                    if (null != this.activities[i][j]) {
                        for (var k = j + 1; j < this.activities[i].length; k++) {
                            if (null != this.activities[i][k]) {
                                if (this.activities[i][j].courseName == this.activities[i][k].courseName) {
                                    this.activities[i][j].vaildWeeks = this.or(this.activities[i][j].vaildWeeks, this.activities[i][k].vaildWeeks);
                                    this.activities[i][k] = null;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    /**
    * 合并课程表中相同的单元格
    */
    mergeCellOfCourseTable (weeks: number, units: number) {
        for (var i = 0; i < weeks; i++) {
            for (var j = 0; j < units - 1; j++) {
                var index = units * i + j;
                var preTd = document.getElementById("TD" + index);
                var nextTd = document.getElementById("TD" + (index + 1));
                while (preTd.innerHTML !== "" && nextTd.innerHTML !== "" && preTd.innerHTML == nextTd.innerHTML) {
                    preTd.parentNode.removeChild(nextTd);
                    var spanNumber = (<any>preTd).colSpan;
                    spanNumber++;
                    (<any>preTd).colSpan = spanNumber;
                    j++;
                    if (j >= units - 1) {
                        break;
                    }
                    index = index + 1;
                    nextTd = document.getElementById("TD" + (index + 1));
                }
            }
        }
    }
    
    or (first: string, second: string) {
        var newStr = "";
        for (var i = 0; i < first.length; i++) {
            if (first.charAt(i) == '1' || second.charAt(i) == '1') {
                newStr += "1";
            }
            else {
                newStr += "0";
            }
        }
        // alert(first+":first\n"+second+":second\n"+newStr+":result");
        return newStr;
    }
}
