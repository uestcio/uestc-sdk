import { weekCycle } from './week';


export class TaskActivity {
    teacherId: string;
    teacherName: string;
    courseId: string;
    courseName: string;
    roomId: string;
    roomName: string;
    vaildWeeks: string;
    taskId: string;
    remark: string;
    
    constructor (teacherId: string, teacherName: string, courseId: string, courseName: string, roomId: string, roomName: string, vaildWeeks: string, taskId: string, remark: string) {
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.courseId = courseId;
        this.courseName = courseName;
        this.roomId = roomId;
        this.roomName = roomName;
        this.vaildWeeks = vaildWeeks;	// 53个01组成的字符串，代表了一年的53周
        this.taskId = taskId;
        this.remark = remark;
    }
    
    // 输出教学活动信息
    toString () {
        return 'teacherId:' + this.teacherId + '\n'
            + 'teacherName:' + this.teacherName + '\n'
            + 'courseId:' + this.courseId + '\n'
            + 'courseName:' + this.courseName + '\n'
            + 'roomId:' + this.roomId + '\n'
            + 'roomName:' + this.roomName + '\n'
            + 'vaildWeeks:' + this.vaildWeeks;
    }
    
    /**
    * 添加缩略表示 add a abbreviation to exists result; Do not use it directly. a
    * white space will delimate the weeks For example:odd1-18 even3-20
    */
    addAbbreviate (cycle: number, begin: number, end: number) {
        var result = "";
        if (result !== '') {
            result += ' ';
        }
        if (begin == end) { // only one week
            result += begin.toString();
        }
        else {
            result += weekCycle[cycle] + begin + '-' + end;
        }
        return result;
    }
    
    /**
    * 根据该年份是否结束于星期六，调整教学州的占用串。 如果没有调整则返回原来的activity.否则返回调整后的新的activity。
    * 
    * @activity 要调整的教学活动
    * @endAtStat 该活动的年份是否结束于星期六
    * @start 从何为止检查有效的教学周
    * @mustClone 是否必须克隆
    */
    adjustClone (endAtSat: boolean, start: number, mustClone: boolean) {
        if (mustClone) {
            var newActivity = this.clone();
            if (newActivity.needLeftShift(endAtSat, start)) {
                newActivity.leftShift();
            }
            return newActivity;
        } else {
            if (this.needLeftShift(endAtSat, start)) {
                var activity = this.clone();
                activity.leftShift(start);
                return activity;
            } else {
                return this;
            }
        }
    }
    
    /**
    * 合并相同的教学活动 same [teacherId,courseId,roomId,remark] can merge
    */
    canMergeWith (other: TaskActivity) {
        return (
            this.teacherId == other.teacherId &&
            this.courseId == other.courseId &&
            this.roomId == other.roomId &&
            this.courseName == other.courseName
        );
    }
    
    // clone a activity
    clone () {
        return new TaskActivity(this.teacherId, this.teacherName, this.courseId, this.courseName, this.roomId, this.roomName, this.vaildWeeks, this.taskId, this.remark);
    }
    
    /**
    * 判断是否相同的活动 same acitivity [teacherId,courseId,roomId,vaildWeeks]
    */
    isSameActivity (other: TaskActivity) {
        return this.canMergeWith(other) && (this.vaildWeeks == other.vaildWeeks);
    }
    
    /**
    * 根据年份是否以周六结束,调整占用周. 如果在起始周之前有占用周,只有没有则表示可以进行调节.
    */
    leftShift (start?: number) {
        this.vaildWeeks = this.vaildWeeks.substring(1, 53) + '0';
        // alert('leftShift:'+this.vaildWeeks);
    }
    
    /**
    * 对教学周占用串进行缩略表示 marsh a string contain only '0' or '1' which named
    * 'vaildWeeks' with length 53
    * 00000000001111111111111111100101010101010101010100000 |
    * |--------------------------------------| (from) (startWeek) (endWeek)
    * from is start position with minimal value 1,in login it's calendar week
    * start startWeek is what's start position you want to mashal baseed on
    * start,it also has minimal value 1 endWeek is what's end position you want
    * to mashal baseed on start,it also has minimal value 1
    */
    marshal (weekOccupy: string, from: number, startWeek: number, endWeek: number) {
        var result = '';
        if (null == weekOccupy) {
            return '';
        }
        var initLength = weekOccupy.length;
    
        if (from > 1) {
            var before = weekOccupy.substring(0, from - 1);
            if (before.indexOf('1') != -1) {
                weekOccupy = weekOccupy + before;
            }
        }
        var tmpOccupy = this.repeatChar('0', from + startWeek - 2);
        tmpOccupy += weekOccupy.substring(from + startWeek - 2, from + endWeek - 1);
        tmpOccupy += this.repeatChar('0', initLength - weekOccupy.length);
        weekOccupy = tmpOccupy;
    
        if (endWeek > weekOccupy.length) {
            endWeek = weekOccupy.length;
        }
        if (weekOccupy.indexOf('1') == -1) {
            return '';
        }
        weekOccupy += '000';
        var start = 0;
        while ('1' != weekOccupy.charAt(start)) {
            start++;
        }
        var i = start + 1;
        while (i < weekOccupy.length) {
            var post = weekOccupy.charAt(start + 1);
            if (post == '0') {
                start = this.mashalOdd(result, weekOccupy, from, start);
            }
            if (post == '1') {
                start = this.mashalContinue(result, weekOccupy, from, start);
            }
            while (start < weekOccupy.length && '1' != weekOccupy.charAt(start)) {
                start++;
            }
            i = start;
        }
        return result;
    }
    
    // 缩略连续周
    mashalContinue(result: String, weekOccupy: string, from: number, start: number) {
        var cycle = 1;
        var i = start + 2;
        for (; i < weekOccupy.length; i += 2) {
            if (weekOccupy.charAt(i) == '1') {
                if (weekOccupy.charAt(i + 1) != '1') {
                    this.addAbbreviate(cycle, start - from + 2, i - from + 2);
                    return i + 2;
                }
            } else {
                this.addAbbreviate(cycle, start - from + 2, i - 1 - from + 2);
                return i + 1;
            }
        }
        return i;
    }
    
    // 缩略单周,例如'10101010'
    mashalOdd (result: String, weekOccupy: string, from: number, start: number) {
        var cycle = 0;
        if ((start - from + 2) % 2 === 0) {
            cycle = 3;
        }
        else {
            cycle = 2;
        }
        var i = start + 2;
        for (; i < weekOccupy.length; i += 2) {
            if (weekOccupy.charAt(i) == '1') {
                if (weekOccupy.charAt(i + 1) == '1') {
                    this.addAbbreviate(cycle, start - from + 2, i - 2 - from + 2);
                    return i;
                }
            } else {
                if (i - 2 == start) {
                    cycle = 1;
                }
                this.addAbbreviate(cycle, start - from + 2, i - 2 - from + 2);
                return i + 1;
            }
        }
        return i;
    }
    
    /**
    * mashal style is or --------------------------- -------------------- |
    * odd3-18 even19-24,room | | odd3-18 | --------------------------
    * --------------------
    */
    marshalValidWeeks (from: number, startWeek: number, endWeek: number) {
        // alert(this.vaildWeeks);
        if (this.roomName !== '') {
            return this.marshal(this.vaildWeeks, from, startWeek, endWeek) + ',' + this.roomName;
        }
        else {
            return this.marshal(this.vaildWeeks, from, startWeek, endWeek);
        }
    }
    
    /**
    * 检查是否需要进行左移动
    */
    needLeftShift (endAtSat: boolean, start: number) {
        return (!endAtSat && this.vaildWeeks.substring(0, start).indexOf('1') != -1 && this.vaildWeeks.substring(start).indexOf('1') == -1)
    }
    
    // utility for repeat char
    repeatChar(str: string, length: number) {
        if (length <= 1) {
            return str;
        }
        var rs = '';
        for (var k = 0; k < length; k++) {
            rs += str;
        }
        return rs;
    }
}
