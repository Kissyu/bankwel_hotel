$(function(){
	Fill.init();
});
var Fill = (function(){
	
	return {
		init: function(){
			me = this;
			this.initVars();
			this.renderUI();
			this.bindUI();
		},
		initVars: function(){
			if($(".startday").html().length==0){
				window.location.href=ctx+"?openid="+localStorage.getItem("openId");
			}
		},
		renderUI: function(){
			var thename=JSON.parse(localStorage.getItem('name'));
			if(thename){
				for(var i=0;i<thename.length;i++){
					$("input[name='contact']").eq(i).val(thename[i]);
				}
			}
			var themobile=localStorage.getItem('mobile');
			if(themobile){
				$("input[name='mobile']").val(themobile);
			}
		},
		bindUI: function(){
			var openid=$("input[name='openid']").val();
			$(".modipopup").on("opened",function(){
				$(".modal-overlay-visible").on(CLICK,function(){
					$.closeModal('.popup.modipopup.modal-in');
				});
			});
			/*修改入离店日期*/
				//初始化
			var oDate=new Date();
			var yesterday=oDate.getFullYear()+'-'+toDou(oDate.getMonth()+1)+'-'+toDou(oDate.getDate()-1);
			var today=oDate.getFullYear()+'-'+toDou(oDate.getMonth()+1)+'-'+toDou(oDate.getDate());
			$("#liveinday").val($(".startday").attr("data-start"));
			$(".totallive em").html($(".totalday").html());
			$(".leavedate em").html($(".endday").attr("data-end"));
			calWeek($("#liveinday").val(),$(".liveintip i"));
			$(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
			calWeek($(".leavedate em").html(),$(".leavedate i"));
			/*/*$("#liveinday").calendar({
				minDate:[yesterday],
				value:[today]
			});*/
			/*$("#liveinday").on("change",function(){
				calWeek($("#liveinday").val(),$(".liveintip i"));
			});*/
				//前一天
			if(!compareToday($("#liveinday").val())){
				$(".prevday").addClass("cannotclick");
			}
			$(".prevday").on(CLICK,function(){
				if(compareToday($("#liveinday").val())){
					$("#liveinday").val(modiDate($("#liveinday").val(),1,false));
					calWeek($("#liveinday").val(),$(".liveintip i"));
					if(!compareToday($("#liveinday").val())){
						$(".prevday").addClass("cannotclick");
					}
					$(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
					calWeek($(".leavedate em").html(),$(".leavedate i"));
				}
			});
				//后一天
			$(".nextday").on(CLICK,function(){
				$("#liveinday").val(modiDate($("#liveinday").val(),1,true));
				calWeek($("#liveinday").val(),$(".liveintip i"));
				if(compareToday($("#liveinday").val())){
					$(".prevday").removeClass("cannotclick");
				}
				$(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
				calWeek($(".leavedate em").html(),$(".leavedate i"));
			});
				//减住一天
			if(parseInt($(".totallive em").html())<=1){
				$(".subdays").addClass("cannotclick");
			}
			$(".subdays").on(CLICK,function(){
				if(parseInt($(".totallive em").html())>1){
					$(".totallive em").html(parseInt($(".totallive em").html())-1);
					$(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
					calWeek($(".leavedate em").html(),$(".leavedate i"));
					if(parseInt($(".totallive em").html())<=1){
						$(".subdays").addClass("cannotclick");
					}
				}
			});
				//加住一天
			$(".adddays").on(CLICK,function(){
				if(parseInt($(".totallive em").html())<28){
					$(".totallive em").html(parseInt($(".totallive em").html())+1);
					$(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
					calWeek($(".leavedate em").html(),$(".leavedate i"));
					if(parseInt($(".totallive em").html())>1){
						$(".subdays").removeClass("cannotclick");
					}
					if(parseInt($(".totallive em").html())==28){
						$(".adddays").addClass("cannotclickright");
					}
				}
					
			});
				//点击确定修改入离店日期
			$(".confirmmodi").on(CLICK,function(){
				$(".startday").attr("data-start",$("#liveinday").val());
				$(".startday").html($("#liveinday").val().substring(5));
				$(".endday").html($(".leavedate em").html().substring(5));
				$(".endday").attr("data-end",$(".leavedate em").html());
				$(".totalday").html($(".totallive em").html());
				var totalcost=(parseInt($(".totalday").html())*room_rate).toFixed(2);
				$(".roomcost").html("￥"+totalcost);
				$(".roomrate i").html(totalcost)
				calctotal();
				$.closeModal('.modal-in');
			});
			/*选择入住人*/
			$(".nameinput").on(CLICK,function(){
				sessionStorage.setItem('loggerNum',$(".nameinput p").length);
				window.location.href=ctx+"/account/selectLodger?openid="+openid;
			});
			var checkitem=JSON.parse(sessionStorage.getItem('checked'));
			if(checkitem){
				for(var i=0;i<checkitem.length;i++){
					$("input[name='contact']").eq(i).val(checkitem[i]['name']);
					$("input[name='contact']").eq(i).attr('data-index',checkitem[i]['index']);
				}
			}
			/*联系方式只能输入数字*/
			$("#mobile").on("keyup",function(){
				$(this).val($(this).val().replace(/[^\d-]/g,""));
			});
			/*需要发票*/
			$("#needbill").live(CLICK,function(){
				if($(this).hasClass("oncheck")){
					$(".addBillInfo").show();
					$(".invoiceshow").show();
					if($(".invoicelist").find(".oncheck").length){
						$(".freight").show();
						calctotal();
					}
				}else{
					$(".addBillInfo").hide();
					$(".invoiceshow").hide();
					$(".freight").hide();
					calctotal();
				}
			});
			/*添加发票信息*/
			$(".addBillInfo").on(CLICK,function(){
				var contact=[];
				for(var i=0;i<$("input[name='contact']").length;i++){
					contact.push($("input[name='contact']").eq(i).val());
				}
				localStorage.setItem('name',JSON.stringify(contact));
				localStorage.setItem('mobile',$("input[name='mobile']").val());
				$(this).attr("href",ctx+"/hotel/invoiceInfo?openid="+openid);
			});
			/*判断是否填入发票抬头*/
			if(header){
				$("#needbill").addClass("oncheck");
				$(".addBillInfo").show();
				$(".invoiceshow").show();
				$(".freight").show();
				calctotal();
				$(".invoicelist").append("<p><span class='myradio oncheck'><i></i>"+header+"</span></p>");
			}
			$(".invoicelist p").live(CLICK,function(){
				if($(this).children(".myradio").hasClass("oncheck")&&$("#needbill").hasClass("oncheck")){
					$(".freight").show();
				}else{
					$(".freight").hide();
				}
				calctotal()
			});
			/*红包*/
			/*$(".luckymoney").on(CLICK,function(){
				if($(this).hasClass("oncheck")){
					$(this).removeClass("oncheck");
				}else{
					window.location.href=ctx+"/account/voucher?openid="+openid;
					$(this).addClass("oncheck")
				}
			});*/
			/*点击提交订单按钮*/
			$(".suOrderBtn").on(CLICK,function(){
				for(var i=0;i<$("input[name='contact']").length;i++){
					if($("input[name='contact']").eq(i).val()==""){
						$.toast("请输入入住人");
						return;
					}
				}
				if($("#mobile").val()==""){
					$.toast("请输入联系方式");
				}else if(!validate("#mobile","PHONE")){
					$.toast("请输入正确的联系方式");
				}else if(!$(this).hasClass("clicked")){
					$(this).addClass("clicked");
					var data={};
					data.openid=$("input[name='openid']").val();
					data.hotelId = hotel_id;
					data.invoiceId=invoiceId;
					data.expressFlag=$("#needbill").hasClass("oncheck")&&$(".invoicelist").find(".oncheck").length?1:0;
					data.days = $(".totalday").html();
					data.startTime=$(".startday").attr("data-start");
					data.endTime=$(".endday").attr("data-end");
					var arr=[];
					for(var i=0;i<$("input[name='contact']").length;i++){
						arr.push($("input[name='contact']").eq(i).val());
					}
					data.contact=arr.join(",");
					data.mobile=$("input[name='mobile']").val();
					localStorage.setItem('openId',$("input[name='openid']").val());
					$.ajax({
						type: "post",
						url:ctx+'/hotel/confirmOrder',
						data: data,
						dataType: "json",
						success: function(result,state) {
							console.info(result);
							if(result.code == 0){
								window.location.href=ctx+'/hotel/generatorPayInfo?openid='+result.data.openid;
								$(".suOrderBtn").removeClass("clicked");
							}
						}
					});
				}
			});			
		}
	};
}());
function calctotal(){
	var totalcost=0;
	$(".costItem").each(function(){
		if($(this).css("display")=="block"){
			totalcost+=parseFloat($(this).find("i").html());
		}
	})
	$(".totalCost span").html("￥"+totalcost.toFixed(2));
}
//比较所选日期与今天的大小
function compareToday(value){
	var oToday=new Date();
	var select=value.split('-');
	var oSelect=new Date();
	oSelect.setFullYear(select[0],select[1]-1,select[2]);
	if(oSelect.getTime()<=oToday.getTime()){
		return false;
	}else{
		return true;
	}
}
//依据日期算星期几
function calWeek(date,showPlace){
	var livein=date.split('-');
	var oDate1=new Date();
	oDate1.setFullYear(livein[0],livein[1]-1,livein[2]);
	showPlace.html(toWeek(oDate1.getDay()));
}
//前后移动日期
function modiDate(date,num,modiway){
	var thedate=date.split('-');
	var oDate2=new Date();
	oDate2.setFullYear(thedate[0],thedate[1]-1,thedate[2]);
	if(modiway){
		oDate2.setDate(oDate2.getDate()+num);
	}else{
		oDate2.setDate(oDate2.getDate()-num);
	}
	return oDate2.getFullYear()+'-'+toDou(oDate2.getMonth()+1)+'-'+toDou(oDate2.getDate());
}
function toWeek(week){
	switch(week){
		case 0:
			return "日";
			break;
		case 1:
			return "一";
			break;
		case 2:
			return "二";
			break;
		case 3:
			return "三";
			break;
		case 4:
			return "四";
			break;
		case 5:
			return "五";
			break;
		case 6:
			return "六";
			break;	
	}
}