jQuery.fn.extend({semesterCalendar:function(options,initCallback){
	jQuery.struts2_jquery.requireCss("/themes/default/css/semesterCalendar.css",bg.getContextPath() + "/static");
	var bar = jQuery(this).next();	
	var yearTb = bar.find("table").first();
	var termTb = yearTb.nextUntil("table").next();
	jQuery(this).next().find("#semesterCalendar_target")[0].onchange = function(){
		if(!jQuery(this).data("changing")){
			jQuery(this).data("changing",true);
			if(jQuery.type(options.onChange)=="string" && jQuery.trim(options.onChange)!==""){
				eval(options.onChange);
			}else if(jQuery.type(options.onChange)=="function"){
				options.onChange.call();
			}
			jQuery(this).data("changing",false);
		}
	};
	
	if(this[0].form){
		this[0].form.onreset = function(){
			if(options.value){
				this[0].getSemesters(jQuery(this[0]),options);
			}else{
				bar.find("#allSemester").click();
			}
		}
	}
	
	
	this[0].getSemesters=function(e,options,initCallback){
		var param = {tagId:jQuery(e).prop("id"),dataType:"semesterCalendar"};
		param.value = options.value;
		param.empty = options.empty || "true";
		var res = jQuery.post(bg.getContextPath()+"/dataQuery.action",param,function(){
			if(res.status==200){
				if(res.responseText!=""){
					var result = eval("("+res.responseText.replace(new RegExp("\r\n","gm"), "").replace(new RegExp("\n","gm"), "")+")");
					var year = jQuery(e).next().find("#semesterCalendar_year");
					var term = jQuery(e).next().find("#semesterCalendar_term");
					if(options.empty=="false" || options.empty==false  || options.empty==0){
							year.attr("index","0");
							term.attr("index","0");
							year.val(result.semesters.y0[0].schoolYear);
							term.val(result.semesters.y0[0].name);
							e.val(result.semesters.y0[0].schoolYear+"学年"+result.semesters.y0[0].name+"学期");
							e.next().find("#semesterCalendar_target").val(result.semesters.y0[0].id);
					}else{
						year.attr("index","-1");
						term.attr("index","-1");
						e.val("全部学期");
						e.next().find("#semesterCalendar_target").val("");
					}
					if(result.yearIndex!="-1"){
						if(options.value==""){
							year.attr("index","0");
							term.attr("index","0");
							year.val(result.semesters.y0[0].schoolYear);
							term.val(result.semesters.y0[0].name);
							e.val(result.semesters.y0[0].schoolYear+"学年"+result.semesters.y0[0].name+"学期");
							e.next().find("#semesterCalendar_target").val(result.semesters.y0[0].id);
						}else{
							var semesterInYear = eval("result.semesters.y"+result.yearIndex);
							if(!(options.empty=="false" || options.empty==false  || options.empty==0)){
								year.attr("index",parseInt(result.yearIndex)+1);
							} else {
								year.attr("index",result.yearIndex);
							}
							term.attr("index",result.termIndex);
							year.val(semesterInYear[result.termIndex].schoolYear);
							term.val(semesterInYear[result.termIndex].name);
							e.val(semesterInYear[result.termIndex].schoolYear+"学年"+semesterInYear[result.termIndex].name+"学期");
							e.next().find("#semesterCalendar_target").val(options.value);
						}
					}
					var years = jQuery(e).next().find("#semesterCalendar_yearTb tbody");
					years.empty();
					if(!(options.empty=="false" || options.empty==false  || options.empty==0)){
						var yearTrs = jQuery(result.yearDom);
						var yearTds = ["<td class='calendar-bar-td-blankBorder' onClick='jQuery(\"#allSemester\").click()'>全部学期</td>"];
						var count = 0;
						for(var i=0;i<yearTrs.length;i++){
							tds = jQuery(yearTrs[i]).html().split("</td>");
							for(var j=0;j<tds.length;j++){
								var td = tds[j].replace("<tr>","").replace("</tr>");
								if(td!=""){
									yearTds[yearTds.length] = td +"</td>";
								}
							}
						}
						var html = "<tr>"
						for(var i=0;i<yearTds.length;i++){
							if(i%3==0){
								html+="<tr>";
							}
							html += yearTds[i];
							if(i%3==2){
								html+="</tr>";
							}
						}
						var semesters = {};
						for(key in result.semesters){
							var idx = parseInt(key.replace("y",""));
							if(isNaN(idx)){
								semesters[key] = result.semesters[key];
							} else {
								semesters["y"+(idx+1)]=result.semesters[key];
							}
						}
						semesters.y0=[];
						jQuery(e).data("semesters",semesters);
						years.append(html);
					}else{
						jQuery(e).data("semesters",result.semesters);
						years.append(result.yearDom);
					}
					var terms = jQuery(e).next().find("#semesterCalendar_termTb tbody");
					terms.empty();
					terms.append(result.termDom);
					if(typeof options.value==="undefined"){
						options.value = result.semesterId;
					}
					jQuery(e).semesterCalendar(options,initCallback);
					return;
				}
			}
		},"text");
	}
	
	if(typeof jQuery(this).data("semesters")=="undefined"){
		this[0].getSemesters(this,options,initCallback);	
		return;
	}
	
	jQuery(this).focus(function(){
		var bar = jQuery(this).next();
		if(!bar.data("barBlur")){
			jQuery(this).trigger("showBar");
		}else{
			jQuery(this).blur();
		}
		bar.data("barBlur",false)
	}).hover(function(){
		var bar = jQuery(this).next();
		if(bar.is(":hidden")){
			jQuery(this).data("mouseOverEvent",true).addClass("calendar-text-state-highlight").removeClass("calendar-text-state-default");
		}
		setTimeout("jQuery('#"+this.id+"').trigger('handlerMouseOverEvent')",500);	
	},function(){
		jQuery(this).removeData("mouseOverEvent");
	}).bind("handlerMouseOverEvent",function(){
		if(jQuery(this).data("mouseOverEvent")){
			var bar = jQuery(this).next();
			if(bar.is(":hidden")){
				jQuery(this).trigger("showBar");
			}
		}
		jQuery(this).removeClass("calendar-text-state-highlight").addClass("calendar-text-state-default");
	}).bind("showBar",function(event){
		var bar = jQuery(this).next();
		var year = bar.find("table:first");
		var term = year.nextUntil("table").next();
		//term.hide();
		bar.scrollTop(bar.prev().scrollTop()+bar.prev().outerHeight()+3);
		bar.scrollLeft(bar.prev().scrollLeft());
		year.show();
		var semesterYear = bar.parent().find("#semesterCalendar_year");
		var semesterTerm = bar.parent().find("#semesterCalendar_term");
		var oldVal = bar.children("#semesterCalendar_target").val();
		bar.data("oldVal",oldVal);
		if(oldVal==""){
			var td = year.find("td:first");
			semesterYear.val(td.html());
			semesterTerm.children("#semesterCalendar_term").attr("index","0");
			td.click();
			jQuery(this).val("全部学期");
			semesterTerm.removeClass("calendar-input-hover");
			bar.children("#semesterCalendar_target").val("");
		}
		var yearIndex = parseInt(semesterYear.attr("index"));
		var termIndex = parseInt(semesterTerm.attr("index"));
		year.find(".ui-state-active").each(function(){
			jQuery(this).removeClass("ui-state-active");
		});
		term.find(".ui-state-active").each(function(){
			jQuery(this).removeClass("ui-state-active");
		});
		var semesterId = bar.find("#semesterCalendar_target").val();
		if(semesterId==""){
			year.find("td").each(function(index,e){
				if(!jQuery(this).attr("index") && index==0){
					jQuery(this).addClass("ui-state-active");
				}else{
					jQuery(this).addClass("calendar-bar-td-blankBorder");
				}
			});
		}else{
			year.find("td:eq("+yearIndex+")").addClass("ui-state-active");
			term.find("td[val='"+semesterId+"']").addClass("ui-state-active");
		}
		bar.show();
		//semesterYear.focus();
		bar.focus();
	})
	
	if(yearTb.find("tr").length>=termTb.find("tr").length){
		yearTb.css("border-right","1px solid #DDD");
		termTb.css("border-left","0 none");
	}else{
		termTb.css("border-left","1px solid #DDD");
		yearTb.css("border-right","0 none");
	}
	
	bar.find("#allSemester").click(function(){
		var bar = jQuery(this).parent()
		bar.prev().val("全部学期");
		bar.find("#semesterCalendar_target").val("");
		var target = bar.children("#semesterCalendar_target");
		bar.hide();
		if(bar.data("oldVal")!=""){
			bar.data("oldVal","");
			if(!jQuery(this).data("changing")){
				target[0].onchange();
			}
		}
	});
	
	bar.find("a").hover(function(){
		jQuery(this).toggleClass("calendar-bar-a-hover");	
	}).click(function(){
		var bar = jQuery(this).parent();
		if(this.id!="allSemester"){
			var flag = jQuery(this).prop("name")=="prev";
			var input = flag?jQuery(this).next():jQuery(this).prev().prev();
			var tb = bar.find("#"+input.prop("id")+"Tb");
			var tds = tb.find("td:not(:empty)");
			var isYear = input.prop("id")=="semesterCalendar_year";
			var year = isYear ? input : jQuery(this).parent().find("#semesterCalendar_year");
			var term = isYear ? jQuery(this).parent().find("#semesterCalendar_term") : input ;
			if(input.attr("index")==-1){
				if(isYear){
					for(var i=0;i<tds.length;i++){
						if(jQuery(tds[i]).html()==year.val()){
							year.attr("index",jQuery(tds[i]).attr("val"));
						}
					}
				}
			}
			if((flag && input.attr("index")!=0) || (!flag && input.attr("index")!=tds.length-1)){
				if(isYear){
					var i = parseInt(input.attr("index"))+(flag?-1:1);
					term.attr("index","0");
					jQuery(tds[i]).click();
				}else{
					var i = parseInt(term.attr("index"));
					var semestersInYear = eval(" bar.prev().data(\"semesters\").y"+year.attr("index"));
					if(semestersInYear.length <= i){
						i =0 ;
					}
					i += flag ? -1 : 1;
					if(i<0){
						i = 0;
					}
					input.val(jQuery(tds[i]).children("span").html());
					input.attr("index",i);
					bar.children("#semesterCalendar_target").val(jQuery(tds[i]).attr("val"));
					bar.prev().val(year.val()+"学年"+term.val()+"学期");
				}
			}
		}
		bar.find("#semesterCalendar_term").focus();
	});
	
	bar.find("#semesterCalendar_term").focus(function(){
		jQuery(this).addClass("calendar-input-hover");
		var year = jQuery(this).parent().parent().find("#semesterCalendar_yearTb");
		var term = year.nextUntil("table").next();
		//year.hide();
		term.show();
	}).blur(function(){
		jQuery(this).removeClass("calendar-input-hover");
		var bar = jQuery(this).parent();
		if(bar.find("td.calendar-td-hover").length==0 && !bar.find("#semesterCalendar_year").is(".calendar-input-hover") && bar.find("a.calendar-bar-a-hover").length==0){
			var target = bar.children("#semesterCalendar_target");
			var newVal = target.val();
			bar.hide();
			if(bar.data("oldVal")!=newVal){
				bar.data("oldVal",newVal);
				if(!jQuery(this).data("changing")){
					target[0].onchange();
				}
			}
			
		}
	}).hover(function(){
		jQuery(this).focus();
		jQuery(this).parent().find("#semesterCalendar_year").blur();
	});
	
	bar.find("#semesterCalendar_year").focus(function(){
		jQuery(this).removeClass("calendar-input");
		jQuery(this).addClass("calendar-input-hover");
		var year = jQuery(this).parent().parent().find("#semesterCalendar_yearTb");
		var term = year.nextUntil("table").next();
		//term.hide()
		year.show();
	}).blur(function(){
		jQuery(this).removeClass("calendar-input-hover");
		jQuery(this).addClass("calendar-input");
		var bar = jQuery(this).parent();
		if(bar.find("td.calendar-td-hover").length==0 && !bar.find("#semesterCalendar_term").is(".calendar-input-hover")  && bar.find("a.calendar-bar-a-hover").length==0){
			var target =  bar.children("#semesterCalendar_target");
			var newVal = target.val();
			bar.hide();
			if(bar.data("oldVal")!=newVal){
				bar.data("oldVal",newVal);
				if(!jQuery(this).data("changing")){
					target[0].onchange();
				}
			}
		}
	}).hover(function(){
		jQuery(this).focus();
		jQuery(this).parent().find("#semesterCalendar_term").blur();
	});
	
	yearTb.find("td").click(function(){
		if(!jQuery(this).is(":empty")){
			//TODO 多选
			yearTb.find("td").each(function(){
				jQuery(this).removeClass("ui-state-active").addClass("calendar-bar-td-blankBorder");
			});
			jQuery(this).addClass("ui-state-active").removeClass("calendar-bar-td-blankBorder");
			var tb = yearTb;
			var bar = tb.parent();
			var input = bar.find("#semesterCalendar_year");
			input.val(jQuery(this).html());
			var tds = tb.find("td:not(:empty)");
			var sameYear = input.attr("index")==(tds.index(jQuery(this))+"");
			if(sameYear && jQuery("#semesterCalendar_target").val()!=""){
				return;
			}
			input.attr("index",tds.index(jQuery(this)));
			jQuery(this).removeClass("calendar-td-hover");
			
			tb.nextUntil("table").next().empty();
			if(jQuery(this).attr("index")){				
				var terms = bar.prev().data("semesters")["y"+input.attr("index")];
				var html = "<tbody>";
				
				for(var i=0;i<terms.length;i++){
					html+="<tr><td index='"+i+"' val='"+terms[i].id+"' class='"+(i==0?"ui-state-active":"calendar-bar-td-blankBorder")+"'><span>"+terms[i].name+"</span>学期</td></tr>";
				}
				if(tb.find("tr").length>=((options.empty?1:0)+terms.length)){
					tb.css("border-right","1px solid #DDD");
					tb.nextUntil("table").next().css("border-left","0 none");
				}else{
					tb.nextUntil("table").next().css("border-left","1px solid #DDD");
					tb.css("border-right","0 none");
				}
				tb.nextUntil("table").next().append(html+"</tbody>");
				tb.nextUntil("table").next().find("td").unbind("click").click(function(){
					if(!jQuery(this).is(":empty")){
						//TODO 多选;
						termTb.find("td").each(function(){
							jQuery(this).removeClass("ui-state-active").addClass("calendar-bar-td-blankBorder");
						});
						jQuery(this).addClass("ui-state-active").removeClass("calendar-bar-td-blankBorder");
						if(!jQuery(this).hasClass("allSemester")){
							var parents = jQuery(this).parentsUntil("table");
							var tb = jQuery(parents[parents.length-1]).parent();
							var input = tb.parent().find("#"+tb.prop("id").replace("Tb",""));
							input.val(jQuery(this).children("span").html());
							input.attr("index",jQuery(this).index());
							jQuery(this).removeClass("calendar-td-hover");
							var bar = tb.parent();
							var term = bar.find("#semesterCalendar_term");
							bar.prev().val(bar.find("#semesterCalendar_year").val()+"学年"+term.val()+"学期");
							bar.children("#semesterCalendar_target").val(jQuery(this).attr("val"));
							var target = bar.children("#semesterCalendar_target");
							var newVal = target.val();
							bar.hide();
							if(bar.data("oldVal")!=newVal){
								bar.data("oldVal",newVal);
								if(!jQuery(this).data("changing")){
									target[0].onchange();
								}
							}
						}
					}
				}).hover(function(){
					if(!jQuery(this).is(":empty") && !jQuery(this).hasClass("ui-state-active")){
						jQuery(this).addClass("calendar-td-hover").removeClass("calendar-bar-td-blankBorder");
						jQuery(this).addClass("calendar-backgroundDDD");
					}
				},function(){
					jQuery(this).removeClass("calendar-td-hover");
					if(!jQuery(this).is(":empty")){
						jQuery(this).removeClass("calendar-backgroundDDD");
						if(!jQuery(this).hasClass("ui-state-active")){
							jQuery(this).addClass("calendar-bar-td-blankBorder");
						}
					}
				});
				var termInput = bar.find("#semesterCalendar_term");
				termInput.val(terms[0].name);
				bar.children("#semesterCalendar_target").val(terms[0].id);
				bar.prev().val(input.val()+"学年"+terms[0].name+"学期");
				termInput.focus();
			}
		}
		yearTb.parent().focus();
	}).hover(function(){
		if(!jQuery(this).is(":empty") && !jQuery(this).hasClass("ui-state-active")){
			jQuery(this).addClass("calendar-td-hover").removeClass("calendar-bar-td-blankBorder");
			jQuery(this).addClass("calendar-backgroundDDD");
		}
	},function(){
		jQuery(this).removeClass("calendar-td-hover");
		if(!jQuery(this).is(":empty")){
			jQuery(this).removeClass("calendar-backgroundDDD");
			if(!jQuery(this).hasClass("ui-state-active")){
				jQuery(this).addClass("calendar-bar-td-blankBorder");
			}
		}
	});
	
	termTb.find("td").click(function(){
		if(!jQuery(this).is(":empty")){
			//TODO 多选
			termTb.find("td").each(function(){
				jQuery(this).removeClass("ui-state-active").addClass("calendar-bar-td-blankBorder");
			});
			jQuery(this).addClass("ui-state-active").removeClass("calendar-bar-td-blankBorder");
			if(!jQuery(this).hasClass("allSemester")){
				var parents = jQuery(this).parentsUntil("table");
				var tb = jQuery(parents[parents.length-1]).parent();
				var input = tb.parent().find("#"+tb.prop("id").replace("Tb",""));
				input.val(jQuery(this).children("span").html());
				input.attr("index",jQuery(this).index());
				jQuery(this).removeClass("calendar-td-hover");
				var bar = tb.parent();
				var term = bar.find("#semesterCalendar_term");
				bar.prev().val(bar.find("#semesterCalendar_year").val()+"学年"+term.val()+"学期");
				bar.children("#semesterCalendar_target").val(jQuery(this).attr("val"));
				var target = bar.children("#semesterCalendar_target");
				var newVal = target.val();
				bar.hide();
				if(bar.data("oldVal")!=newVal){
					bar.data("oldVal",newVal);
					if(!jQuery(this).data("changing")){
						target[0].onchange();
					}
				}
			}
		}
	}).hover(function(){
		if(!jQuery(this).is(":empty") && !jQuery(this).hasClass("ui-state-active")){
			jQuery(this).addClass("calendar-td-hover").removeClass("calendar-bar-td-blankBorder");
			jQuery(this).addClass("calendar-backgroundDDD");
		}
	},function(){
		jQuery(this).removeClass("calendar-td-hover");
		if(!jQuery(this).is(":empty")){
			jQuery(this).removeClass("calendar-backgroundDDD");
			if(!jQuery(this).hasClass("ui-state-active")){
				jQuery(this).addClass("calendar-bar-td-blankBorder");
			}
		}
	});
	
	bar.blur(function(){
		var $this = jQuery(this);
		if($this.find("td.calendar-td-hover").length==0){ 
				//&& !$this.find("#semesterCalendar_term").is(".calendar-input-hover")  && bar.find("a.calendar-bar-a-hover").length==0){
			var target =  $this.children("#semesterCalendar_target");
			var newVal = target.val();
			$this.hide();
			$this.data("barBlur",true);
			if($this.data("oldVal")!=newVal){
				$this.data("oldVal",newVal);
				if(!jQuery(this).data("changing")){
					target[0].onchange();
				}
			}
		}
	});
	
	if(jQuery.type(initCallback)=="string"){
		jQuery(this).next().find("#semesterCalendar_target").one("initCallback",function(){
			eval(initCallback);
		});
	}else if(jQuery.type(initCallback)!="undefined"){
		jQuery(this).next().find("#semesterCalendar_target").one("initCallback",initCallback);
	}else{
		jQuery(this).next().find("#semesterCalendar_target").one("initCallback",jQuery.noop);
	}
	jQuery(this).next().find("#semesterCalendar_target").trigger("initCallback");
}});
