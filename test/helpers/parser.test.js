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
});