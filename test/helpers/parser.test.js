var assert = require('assert');
var Parser = require('../../src/helpers/parser');

describe('Parser ', function () {

    beforeEach(function () {
    });

    describe('#get$()', function () {
        it('should be able to get $', function (done) {
            Parser.get$('<html>0</html>').nodeify(function (err, $) {
                assert.equal('0', $('html').text());
                done();
            })
        });
    });

    describe('#getAppCourses()', function () {
        var html;

        beforeEach(function () {
            html = '<table id="grid11962977591" class="gridtable">\
             <tbody id="grid11962977591_data"><tr class="griddata-even   "><td class="gridselect"><input class="box" name="lesson.id" value="220126" type="checkbox"></td>		<td>0010270.01</td>\
             <td>数学分析（含常微分方程）II</td><td>公共基础课</td><td>英才实验学院</td><td>			肖义彬\
             </td><td>			副教授\
             </td><td></td>		<td>星期二 7-8 [6-16]<br></td>\
             <td>  B305 <br></td>\
             <td>未选择考试类型</td>\
             <td>清水河校区</td></tr><tr class="griddata-odd "><td class="gridselect"><input class="box" name="lesson.id" value="220127" type="checkbox"></td>		<td>0010350.01</td>\
             <td>线性代数与解析几何</td><td>公共基础课</td><td>英才实验学院</td><td>			黄廷祝\
             </td><td>			教授\
             </td><td></td>		<td>星期一 1-2 [3-18]<br>星期三 1-2 [3-18]<br>星期五 3-4 [3-17]<br></td>\
             <td>  A307 <br>  A307 <br>单  A307 <br></td>\
             <td>未选择考试类型</td>\
             <td>清水河校区</td></tr><tr class="griddata-even  "><td class="gridselect"><input class="box" name="lesson.id" value="220128" type="checkbox"></td>		<td>0010820.01</td>\
             <td>中国近代史纲要</td><td>公共基础课</td><td>英才实验学院</td><td>			吴燕\
             </td><td>			教授\
             </td><td></td>		<td>星期四 1-2 [6-13]<br>星期四 3-4 [6-13]<br></td>\
             <td>  综合楼520 <br>  C407 <br></td>\
             <td>未选择考试类型</td>\
             <td>清水河校区</td></tr><tr class="griddata-odd "><td class="gridselect"><input class="box" name="lesson.id" value="220180" type="checkbox"></td>		<td>0011245.01</td>\
             <td>大学物理II</td><td>学科基础课(必修)</td><td>英才实验学院</td><td>			滕保华\
             </td><td>			教授\
             </td><td></td>		<td>星期一 7-8 [1-17]<br>星期三 1-2 [1-17]<br></td>\
             <td>  A211 <br>  A211 <br></td>\
             <td>未选择考试类型</td>\
             <td>清水河校区</td></tr></tbody>\
             </table>';
        });

        it('should be able to get course from html', function (done) {
            Parser.getAppCourses(html).nodeify(function (err, courses) {
                assert.equal(4, courses.length);
                assert.equal('0010270.01', courses[0].id);
                done();
            })
        });
    });

    describe('#getUserAllScores()', function () {
        var html;

        beforeEach(function () {
            html = '<div class="grid">\
            <table id="grid21344342991" class="gridtable">\
            <thead class="gridhead">\
            </thead>\
            <tbody id="grid21344342991_data"><tr class="griddata-even  ">		<td>2012-2013 2</td>\
            <td>1003350</td>\
            <td>(2012-2013-2)-1003350-3203666-1-CX1</td>\
            <td>微积分Ⅱ<span style="color:red;">(重修)</span></td>\
            <td>公共基础课</td>		<td>5</td>\
            <td style=""></td><td style=""></td><td style="">			67\
            </td>\
            </tr><tr class="griddata-odd">		<td>2013-2014 2</td>\
            <td>K0400620</td>\
            <td>K0400620.55</td>\
            <td>大学物理实验 II</td>\
            <td>公共基础课</td>		<td>2</td>\
            <td style="">	  			80\
            </td><td style=""></td><td style="">			80\
            </td>\
            </tr><tr class="griddata-even">		<td>2013-2014 1</td>\
            <td>0404320</td>\
            <td>(2013-2014-1)-0404320-3203431-1</td>\
            <td>大学物理实验I</td>\
            <td>公共基础课</td>		<td>2</td>\
            <td style="">	  			80\
            </td><td style=""></td><td style="">			80\
            </td>\
            </tr><tr class="griddata-odd  ">		<td>2012-2013 1</td>\
            <td>1005140</td>\
            <td>(2012-2013-1)-1005140-3203514-1</td>\
            <td>线性代数与空间解析几何Ⅰ</td>\
            <td>公共基础课</td>		<td>4</td>\
            <td style="">	  			74\
            </td><td style=""></td><td style="">			74\
            </td>\
            </tr></tbody>\
            </table>\
            </div>';
        });

        it('should be able to get course from html', function (done) {
            Parser.getUserAllScores(html).nodeify(function (err, courses) {
                err && console.log(err);
                assert.equal(4, courses.length);
                assert.equal(67, courses[0].score.final);
                done();
            })
        });
    });

    describe('#getUserDetail()', function () {
        var html;

        beforeEach(function () {
            html = '<table style="width:95%" align="center" class="infoTable" id="studentInfoTb">\
            <tbody><tr>\
            <td colspan="5" style="font-weight:bold;text-align:center" class="darkColumn">学籍信息</td>\
            </tr>\
            <tr>\
            <td width="25%" class="title" style="width:18%">学号：</td>\
            <td width="25%">2012019050020</td>\
            <td width="25%" class="title" style="width:18%">姓名：</td>\
            <td>刘建翔</td>\
            <td width="11%" rowspan="5" id="photoImg">\
            <img width="80px" height="110px" src="/eams/avatar/my.action" alt="刘建翔" title="刘建翔">\
            </td>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">英文名：</td>\
            <td>Liu JianXiang</td>\
            <td class="title" style="width:18%">性别：</td>\
            <td>男</td>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">所在年级：</td>\
            <td>2012</td>\
            <td class="title" style="width:18%">学制：</td>\
            <td>4</td>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">项目：</td>\
            <td>本科</td>\
            <td class="title" style="width:18%">学历层次：</td>\
            <td>本科</td>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">学生类别：</td>\
            <td>普通本科生</td>\
            <td class="title" style="width:18%">院系：</td>\
            <td>通信与信息工程学院</td>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">专业：</td>\
            <td>通信工程</td>\
            <td class="title" style="width:18%">专业方向：</td>\
            <td></td>\
            </tr>\
            <tr>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">入校时间：</td>\
            <td>2012-09-01</td>\
            <td class="title" style="width:18%">应毕业时间：</td>\
            <td>2016-07-01</td>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">行政管理院系：</td>\
            <td>通信与信息工程学院</td>\
            <td class="title" style="width:18%">学习形式：</td>\
            <td>普通全日制</td>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">教育形式：</td>\
            <td></td>\
            <td class="title" style="width:18%">学籍状态：</td>\
            <td>在籍在校</td>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">是否在籍：</td>\
            <td>是</td>\
            <td class="title" style="width:18%">是否在校：</td>\
            <td>是</td>\
            </tr>\
            <tr>\
            <td class="title" style="width:18%">行政班级：</td>\
            <td>2012010306</td>\
            <td class="title" style="width:18%">所属校区：</td>\
            <td>清水河校区</td>\
            </tr>\
                <!--zhangli_begain-->\
            <!--\
            <tr>\
            <td class="title" style="width:18%">备注：</td>\
            <td colspan="3"></td>\
            </tr>\
            -->\
                <!--zhangli_end-->\
            </tbody></table>';
        });

        it('should be able to get course from html', function (done) {
            Parser.getUserDetail(html).nodeify(function (err, detail) {
                err && console.log(err);
                assert.equal('刘建翔', detail.name);
                assert.equal('男', detail.sex);
                done();
            })
        });
    });
});