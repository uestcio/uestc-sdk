import { TaskActivity } from './task_activity';
import { weeksPerYear } from './week';


/**
* all activities in each unit consists a ActivityCluster
*/
export class ActivityCluster {
    year: number;
    endAtSat: boolean;
    courseId: string;
    courseName: string;
    weeks: string;
    remark: string;
    weeksMap: { [id: string]: string[] };
    activityMap: { [id: string]: TaskActivity };
    add: any;
    genActivities: any;

    constructor(year: number, courseId: string, courseName: string, weeks: string, remark: string) {
        this.year = year;
        var date = new Date();
        date.setFullYear(year, 11, 31);
        this.endAtSat = false;
        if (6 == date.getDay()) {
            this.endAtSat = true;
        }
        this.courseId = courseId;
        this.courseName = courseName;
        this.weeks = weeks;
        this.remark = remark;
        this.weeksMap = {};
        this.activityMap = {};
        this.add = this.addActivityToCluster;
        this.genActivities = this.constructActivities;
    }
    
    /***************************************************************************
    * 添加一个小节中的教学活动组成一个活动集. * *
    **************************************************************************/
    // add acitity to cluster.and weekInex from 0 to weeks-1
    addActivityToCluster(teacherId: string, teacherName: string, roomId: string, roomName: string, weekIndex: number) {
        // alert("addActivityToCluster:"+weekIndex)
        if (null == this.weeksMap[teacherId + roomId]) {
            this.weeksMap[teacherId + roomId] = new Array(this.weeks);
            this.activityMap[teacherId + roomId] = new TaskActivity(teacherId, teacherName, this.courseId, this.courseName, roomId, roomName, "", null, null);
        }
        this.weeksMap[teacherId + roomId][weekIndex] = "1";
    }
    
    /**
    * 构造教学活动
    */
    constructActivities(startWeek: number) {
        // alert("enter constructActivities")
        var activities = new Array();
        for (var teacherRoomId in this.activityMap) {
            var weekState = this.constructValidWeeks(startWeek, teacherRoomId);
            this.activityMap[teacherRoomId].vaildWeeks = weekState[0];
            this.activityMap[teacherRoomId].remark = this.remark;
            activities[activities.length] = this.activityMap[teacherRoomId];
            if (weekState.length == 2) {
                var cloned = this.activityMap[teacherRoomId].clone();
                cloned.vaildWeeks = weekState[1];
                activities[activities.length] = cloned;
                // alert(cloned)
            }
            // alert(this.activityMap[teacherRoomId]);
        }
        return activities;
    }
    
    /*
    * construct a valid Weeks from this.weeksMap by key teacherRoomId this
    * startweek is the position of this.weeksMap[teacherRoomId] in return
    * validWeekStr also it has mininal value 1;
    */
    constructValidWeeks(startWeek: number, teacherRoomId: string) {
        // alert("enter constructValidWeeks")
        // as many as possible weeks with in a year
        var firstWeeks: string[] = new Array(weeksPerYear);
        var secondWeeks: string[] = null;
        var weeksThisYear = "";
        for (var i = 0; i < weeksPerYear - 1; i++) {
            firstWeeks[i] = "0";
        }
        for (var weekIndex = 0; weekIndex < this.weeksMap[teacherRoomId].length; weekIndex++) {
            var occupy = "0";
            if (this.weeksMap[teacherRoomId][weekIndex] === undefined) occupy == "0";
            else occupy = "1";
            // 计算占用周的位置
            var weekIndexNum = weekIndex;
            weekIndexNum += startWeek - 1;

            if (weekIndexNum < weeksPerYear) {
                firstWeeks[weekIndexNum] = occupy;
            }
            else {
                if (null == secondWeeks) {
                    // 生成下一年的占用情况
                    secondWeeks = new Array();
                    for (var i = 0; i < weeksPerYear - 1; i++) {
                        secondWeeks[i] = "0";
                    }
                }
                secondWeeks[(weekIndexNum + (this.endAtSat ? 0 : 1)) % weeksPerYear] = occupy;
            }
        }
        for (i = 0; i < weeksPerYear; i++) {
            weeksThisYear += (firstWeeks[i] == null) ? "0" : firstWeeks[i];
        }
        // alert(weeksThisYear)
        var weekState = new Array();

        if (weeksThisYear.indexOf("1") != -1) {
            weekState[weekState.length] = weeksThisYear;
        }
        var weeksNextYear = "";
        if (null != secondWeeks) {
            for (i = 0; i < weeksPerYear; i++) {
                weeksNextYear += (secondWeeks[i] === undefined) ? "0" : secondWeeks[i];
            }
            if (weeksNextYear.indexOf("1") != -1) {
                weekState[weekState.length] = weeksNextYear;
            }
            // alert(weeksNextYear);
        }
        // alert(weekState)
        return weekState;
    }
}
