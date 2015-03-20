var _ = require('lodash');
var assert = require('assert');
var Peeler = require('../../src/helpers/peeler');

describe('Peeler ', function () {

    beforeEach(function () {
    });

    describe('#getTable()', function () {
        var table0;

        beforeEach(function () {
            var CourseTable = Peeler.fixtures.CourseTable;
            var TaskActivity = Peeler.fixtures.TaskActivity;
            table0 = new CourseTable(2014, 84);
            var unitCount = 12;
            var index = 0;
            var activity = null;
            activity = new TaskActivity("9766", "韦云凯", "11870(G0102030.01)", "局域网与城域网(G0102030.01)", "364", "A108", "00101010101010101000000000000000000000000000000000000");
            index = 0 * unitCount + 4;
            table0.activities[index][table0.activities[index].length] = activity;
            index = 0 * unitCount + 5;
            table0.activities[index][table0.activities[index].length] = activity;
            activity = new TaskActivity("9766", "韦云凯", "11870(G0102030.01)", "局域网与城域网(G0102030.01)", "364", "A108", "01111111111111111100000000000000000000000000000000000");
            index = 3 * unitCount + 8;
            table0.activities[index][table0.activities[index].length] = activity;
            index = 3 * unitCount + 9;
            table0.activities[index][table0.activities[index].length] = activity;
            activity = new TaskActivity("9506", "周宁", "11233(F0101140.02)", "通信原理(F0101140.02)", "449", "C304", "01111111111111111100000000000000000000000000000000000");
            index = 3 * unitCount + 4;
            table0.activities[index][table0.activities[index].length] = activity;
            index = 3 * unitCount + 5;
            table0.activities[index][table0.activities[index].length] = activity;
            activity = new TaskActivity("9506", "周宁", "11233(F0101140.02)", "通信原理(F0101140.02)", "449", "C304", "01111111111111111100000000000000000000000000000000000");
            index = 1 * unitCount + 2;
            table0.activities[index][table0.activities[index].length] = activity;
            index = 1 * unitCount + 3;
            table0.activities[index][table0.activities[index].length] = activity;
            activity = new TaskActivity("9660", "吴献钢", "12400(E0100650.17)", "微处理器系统结构与嵌入式系统设计(E0100650.17)", "377", "B411", "01111111111111111100000000000000000000000000000000000");
            index = 2 * unitCount + 2;
            table0.activities[index][table0.activities[index].length] = activity;
            index = 2 * unitCount + 3;
            table0.activities[index][table0.activities[index].length] = activity;
            activity = new TaskActivity("9660", "吴献钢", "12400(E0100650.17)", "微处理器系统结构与嵌入式系统设计(E0100650.17)", "377", "B411", "01111111111111111100000000000000000000000000000000000");
            index = 0 * unitCount + 0;
            table0.activities[index][table0.activities[index].length] = activity;
            index = 0 * unitCount + 1;
            table0.activities[index][table0.activities[index].length] = activity;
            activity = new TaskActivity("9660", "吴献钢", "12400(E0100650.17)", "微处理器系统结构与嵌入式系统设计(E0100650.17)", "377", "B411", "01010101010101010100000000000000000000000000000000000");
            index = 4 * unitCount + 4;
            table0.activities[index][table0.activities[index].length] = activity;
            index = 4 * unitCount + 5;
            table0.activities[index][table0.activities[index].length] = activity;
            activity = new TaskActivity("9070", "刘镰斧", "11669(G0101630.05)", "通信射频电路(G0101630.05)", "696", "A109", "01111111111111111100000000000000000000000000000000000");
            index = 4 * unitCount + 2;
            table0.activities[index][table0.activities[index].length] = activity;
            index = 4 * unitCount + 3;
            table0.activities[index][table0.activities[index].length] = activity;
            activity = new TaskActivity("9070", "刘镰斧", "11669(G0101630.05)", "通信射频电路(G0101630.05)", "696", "A109", "01010101010101010100000000000000000000000000000000000");
            index = 2 * unitCount + 0;
            table0.activities[index][table0.activities[index].length] = activity;
            index = 2 * unitCount + 1;
            table0.activities[index][table0.activities[index].length] = activity;
        });

        it('should be able to parse grade and semester', function () {
            var res = Peeler.getTable(table0);
            assert.equal(4, _.values(res).length);
            assert.equal(3, res['E0100650.17'].length);
        });
    });

    describe('#getUserSemesterCourses()', function () {
        var html;

        beforeEach(function () {
            html = '// function CourseTable in TaskActivity.js\
            var table0 = new CourseTable(2014,84);\
            var unitCount = 12;\
            var index=0;\
            var activity=null;\
            activity = new TaskActivity("9766","韦云凯","11870(G0102030.01)","局域网与城域网(G0102030.01)","364","A108","00101010101010101000000000000000000000000000000000000");\
            index =0*unitCount+4;\
            table0.activities[index][table0.activities[index].length]=activity;\
            index =0*unitCount+5;\
            table0.activities[index][table0.activities[index].length]=activity;\
            activity = new TaskActivity("9766","韦云凯","11870(G0102030.01)","局域网与城域网(G0102030.01)","364","A108","01111111111111111100000000000000000000000000000000000");\
            index =3*unitCount+8;\
            table0.activities[index][table0.activities[index].length]=activity;\
            index =3*unitCount+9;\
            table0.activities[index][table0.activities[index].length]=activity;\
            activity = new TaskActivity("9506","周宁","11233(F0101140.02)","通信原理(F0101140.02)","449","C304","01111111111111111100000000000000000000000000000000000");\
            index =3*unitCount+4;\
            table0.activities[index][table0.activities[index].length]=activity;\
            index =3*unitCount+5;\
            table0.activities[index][table0.activities[index].length]=activity;\
            activity = new TaskActivity("9506","周宁","11233(F0101140.02)","通信原理(F0101140.02)","449","C304","01111111111111111100000000000000000000000000000000000");\
            index =1*unitCount+2;\
            table0.activities[index][table0.activities[index].length]=activity;\
            index =1*unitCount+3;\
            table0.activities[index][table0.activities[index].length]=activity;\
            activity = new TaskActivity("9660","吴献钢","12400(E0100650.17)","微处理器系统结构与嵌入式系统设计(E0100650.17)","377","B411","01111111111111111100000000000000000000000000000000000");\
            index =2*unitCount+2;\
            table0.activities[index][table0.activities[index].length]=activity;\
            index =2*unitCount+3;\
            table0.activities[index][table0.activities[index].length]=activity;\
            activity = new TaskActivity("9660","吴献钢","12400(E0100650.17)","微处理器系统结构与嵌入式系统设计(E0100650.17)","377","B411","01111111111111111100000000000000000000000000000000000");\
            index =0*unitCount+0;\
            table0.activities[index][table0.activities[index].length]=activity;\
            index =0*unitCount+1;\
            table0.activities[index][table0.activities[index].length]=activity;\
            activity = new TaskActivity("9660","吴献钢","12400(E0100650.17)","微处理器系统结构与嵌入式系统设计(E0100650.17)","377","B411","01010101010101010100000000000000000000000000000000000");\
            index =4*unitCount+4;\
            table0.activities[index][table0.activities[index].length]=activity;\
            index =4*unitCount+5;\
            table0.activities[index][table0.activities[index].length]=activity;\
            activity = new TaskActivity("9070","刘镰斧","11669(G0101630.05)","通信射频电路(G0101630.05)","696","A109","01111111111111111100000000000000000000000000000000000");\
            index =4*unitCount+2;\
            table0.activities[index][table0.activities[index].length]=activity;\
            index =4*unitCount+3;\
            table0.activities[index][table0.activities[index].length]=activity;\
            activity = new TaskActivity("9070","刘镰斧","11669(G0101630.05)","通信射频电路(G0101630.05)","696","A109","01010101010101010100000000000000000000000000000000000");\
            index =2*unitCount+0;\
            table0.activities[index][table0.activities[index].length]=activity;\
            index =2*unitCount+1;\
            table0.activities[index][table0.activities[index].length]=activity;\
            table0.marshalTable(2,1,20);\
            fillTable(table0,7,12,0);';
        });

        it('should be able to parse grade and semester', function () {
            var res = Peeler.getUserSemesterCourses(html);
            assert.equal(4, _.values(res).length);
            assert.equal(3, res['E0100650.17'].length);
        });
    });
});