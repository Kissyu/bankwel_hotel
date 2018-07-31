$(function(){
	Fill.init();
});
var Fill = (function(){
	var me=null;
	return {
		init: function(){
			this.initVars();
			this.renderUI();
			this.bindUI();
		},
		initVars: function(){
			me = this;
			sessionStorage.setItem("userName",$("#userName").val());

			var openid = $('#open_id').val();
			/*初始化入离店时间*/
			/*var startDay = sessionStorage.getItem('checkintime');
			var endDay = sessionStorage.getItem('leavetime');
			$('.startday').attr('data-start',startDay);
			$('.startday').html(transformDate(startDay));
			$('.endday').attr('data-end',endDay);
			$('.endday').html(transformDate(endDay));
			var totalDay = sessionStorage.getItem('timeDay');
			$('.totalday').html(totalDay);*/
			//选择预留时间
			var keepTime=[];
			var oDate=new Date();
			var hour=oDate.getHours()+1;
			if($("#priceType").val()=='adv'){
				for(var i=hour;i<=24;i++){
					keepTime.push(hour+":00");
					hour++;
				}
			}else if($("#priceType").val()=='cash'){
				if(hour>=18){
					keepTime=["18:00"];
				}else{
					for(var i=hour;i<=18;i++){
						keepTime.push(hour+":00");
						hour++;
					}
				}
			}
			  $("#reserveTime").picker({
		          toolbarTemplate: '<header class="bar bar-nav">\
			          <button class="button button-link pull-right close-picker">确定</button>\
			          <h1 class="title">请选择预留时间</h1>\
			          </header>',
		          cols: [
		            {
		              textAlign: 'center',
		              values: keepTime
		            }
		          ]
		        });
			  $("#reserveTime").next("i").on(CLICK,function(){
				  $("#reserveTime").picker('open');
			  });
			/*初始化房间数*/
			var lodgerNum=sessionStorage.getItem("lodgerNum");
			if(lodgerNum){
				$(".roomnum").html(lodgerNum);
				me.lodgerInpNum(lodgerNum);
			}
			/*初始化入住人*/
			me.initLodger();
			var themobile=localStorage.getItem('mobile');
			if(themobile){
				$("input[name='mobile']").val(themobile);
			}
			/*更新总额及费用明细*/
			me.updatecharge();
		},
		renderUI: function(){
			//存储发票信息与列表
			var ticket = $("#comInfoList").val();
			var ticketTrans = ticket.replace(/=/g,':');
			var reg = /([^\:\{\}\[\]\,]+)\:([^\:\,\{\}\[\]]*)/g;
			ticketTrans = ticketTrans.replace (reg, "\"$1\":\"$2\"");
			sessionStorage.setItem('comInfoList',ticketTrans);
			if(!sessionStorage.getItem("lastInv")){
				var lastTicket = $("#lastInv").val();
				var lastTicketTrans = lastTicket.replace(/=/g,':');
				lastTicketTrans = eval("("+lastTicketTrans.replace (reg, "\"$1\":\"$2\"")+")");
				var json={};
				for(var i in lastTicketTrans){
					json[i.replace(/\s/g,"")]=lastTicketTrans[i];
				}
				sessionStorage.setItem('lastInv',JSON.stringify(json));
			}
		},
		bindUI: function(){
			var openid=$("input[name='openid']").val();
			//返回上一步
			$(".lastStep").on(CLICK,function(){
				var hotelId = $('#hotelId').val();
				var checkintime =  sessionStorage.getItem('checkintime');
				var leavetime = sessionStorage.getItem('leavetime');
				window.location.href =  ctx+"/hotel/wx/v1/hotel/queryHotelDetail?openid="+openid+"&hotel_id="+hotelId+"&checkintime="+checkintime+"&leavetime="+leavetime;
			});
			/*/!*房型详情*!/
			$("#houseDetail").on(CLICK,function(){
				$(".mask").show();
				$(".houseDetailLayer").show();
			});
			$(".closeHouseDetail").on(CLICK,function(){
				$(".mask").hide();
				$(".houseDetailLayer").hide();
			});
			$(".showMoreFacility").on(CLICK,function(){
				$(".moreFacilityBox").show();
				$(this).hide();
			});
			$(".hidMoreFacility").on(CLICK,function(){
				$(".moreFacilityBox").hide();
				$(".showMoreFacility").show();
			});*/
			//点击确定修改入离店日期
			/*$(".confirmmodi").on(CLICK,function(){
				$(".startday").attr("data-start",$("#liveinday").val());
				$(".startday").html(transformDate($("#liveinday").val()));
				$(".endday").html(transformDate($(".leavedate em").html()));
				$(".endday").attr("data-end",$(".leavedate em").html());
				$(".totalday").html($(".totallive em").html());
				$(".startWeek").html("周"+calWeek($("#liveinday").val()));
				$(".endWeek").html("周"+calWeek($(".leavedate em").html()));
				$.closeModal('.modal-in');
				sessionStorage.setItem("checkintime",$(".startday").attr("data-start"));
				sessionStorage.setItem("leavetime",$(".endday").attr("data-end"));
				sessionStorage.setItem('timeDay',$('.totalday').html());
				me.updatecharge();
			});*/
			/*房间数*/
			$(".subbtn").live(CLICK,function(){
				if(Number($(this).next(".roomnum").html())<=1){
					return;
				}else{
					$(this).next(".roomnum").html(Number($(this).next(".roomnum").html())-1);
					me.lodgerInpNum(Number($(this).next(".roomnum").html()));
					me.initLodger();
					sessionStorage.setItem('lodgerNum',$('.roomnum').html());
					me.updatecharge();
				}
			});
			$(".addbtn").live(CLICK,function(){
				if(Number($(this).prev(".roomnum").html())>=10){
					return;
				}else{
					$(this).prev(".roomnum").html(Number($(this).prev(".roomnum").html())+1);
					me.lodgerInpNum(Number($(this).prev(".roomnum").html()));
					me.initLodger();
					sessionStorage.setItem('lodgerNum',$('.roomnum').html());
					me.updatecharge();
				}
			});
			/*选择入住人*/
			$("#lodgerList").on(CLICK,function(){
				sessionStorage.setItem('lodgerNum',$('.roomnum').html());
				window.location.href=ctx+"/hotel/wx/v1/order/choiceContact?openid="+openid;
			});
			/*初始化发票*/
			var lastInv=eval ("(" + sessionStorage.getItem('lastInv') + ")");
			if($("#priceType").val()=='adv'){
				if((!sessionStorage.getItem("noNeedInvoice"))&&lastInv["invoice_title"]!="null"&&lastInv["invoice_title"]!="undefined"){
					$("#invoiceDetail").html(lastInv["invoice_title"]);
				}else{
					$("#invoiceDetail").html("不开发票");
				}
				$("#invoiceDetail").siblings(".gotoselect").show();
			}else if($("#priceType").val()=='cash'){
				$("#invoiceDetail").html("如需发票，可向酒店索取");
				$("#invoiceDetail").siblings(".gotoselect").hide();
			}
			/*选择发票*/
			//如果不选择 就默认不要发票
			$("#writeInvoice").on(CLICK,function(){
				if($("#priceType").val()=='adv') {
					window.location.href = ctx+"/hotel/wx/v1/order/orderInvoicePage?openid=" + openid;
				}
			});
 			/*联系方式只能输入数字*/
 			$("#mobile").on("keyup",function(){
 				$(this).val($(this).val().replace(/[^\d-]/g,""));
 			});
			/*费用明细*/
			$(".costDetail").on(CLICK,function(){
				$(".costLayer").show();
			});
			$(".costLayer").on(CLICK,function(){
				$(".costLayer").hide();
			});
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
				}else if($("#reserveTime").val()==""){
					$.toast("请选择预留时间");
				}else if(!$(this).hasClass("clicked")){
					$.confirm("确定提交订单吗？",function(){
						$(this).addClass("clicked");
						var data={};
						data.openid=$("input[name='openid']").val();
						data.price_id = $("#priceId").val();
						data.checkindate=sessionStorage.getItem('checkintime');
						data.leavedate=sessionStorage.getItem('leavetime');
						var arr=[];
						for(var i=0;i<$("input[name='contact']").length;i++){
							arr.push($("input[name='contact']").eq(i).val());
						}
						data.true_name=arr.join(",");
						data.mobilephone=$("input[name='mobile']").val();
						data.house_count=$(".roomnum").html();
						data.reservetime=$("#reserveTime").val().replace(/[^\d:]/g,"");
						data.special_needs=$("#specialNeed").val();
						if($("#invoiceDetail").html()=="不开发票"){
							data.is_invoice=3;
						}else if($("#priceType").val()=='cash'){
							data.is_invoice=1;
						}else{
							data.is_invoice=2;
						}

						var invoiceInfo=eval ("(" + sessionStorage.getItem('lastInv') + ")");
						for(var i in invoiceInfo){
							data[i]=invoiceInfo[i];
						}

						$.ajax({
							type: "get",
							url:ctx+'/hotel/api/v1/order/commitOrder',
							data: data,
							dataType: "json",
							success: function(result) {
								$(".suOrderBtn").removeClass("clicked");
								if(result.code == 1){
									if($("#priceType").val()=='cash'){
										window.location.href=ctx+'/hotel/wx/v1/user/myOrderDetailPage?openid='+openid+'&order_id='+result.data.order_id;
									}else if($("#priceType").val()=='adv'){
										sessionStorage.setItem("orderId",result.data.order_id);
										window.location.href=ctx+'/hotel/wx/v1/pay/generatorPayInfo?openid='+openid+'&prepay_id='+result.data.wxResult.prepay_id;
									}
								}else{
									$.alert(result.msg);
								}
							}
						});
					});
				}
			});			
		},
		lodgerInpNum: function(num){
			$("#lodgerList").empty();
			$("#lodgerList").append('<i class="goselectLodger"></i>');
			for(var i=0;i<num;i++){
				$("#lodgerList").append('<p><input type="text" name="contact" readonly placeholder="姓名，每间只需选择1人"/></p>');
			}
			$("#lodgerList p").last().addClass("noBorderB");
		},
		initLodger: function(){
			var checkitem=JSON.parse(sessionStorage.getItem('checked'));
			if(checkitem){
				for(var i=0;i<checkitem.length;i++){
					$("input[name='contact']").eq(i).val(checkitem[i]['name']);
					$("input[name='contact']").eq(i).attr('data-index',checkitem[i]['index']);
				}
			}else{
				$("input[name='contact']").eq(0).val($("#userName").val());
			}
		},
		updatecharge: function(){
			var data={};
			data.openid=$("#open_id").val();
			data.price_id=$("#priceId").val();
			data.checkintime=sessionStorage.getItem('checkintime');
			data.leavetime=sessionStorage.getItem('leavetime');
			$.ajax({
				type: "get",
				url:ctx+'/hotel/wx/v1/hotel/getHousePrice',
				data: data,
				dataType: "json",
				success: function(result) {
					if(result.code == 1){
						var totalcost=parseFloat((result.data.house.total_price+"").replace(/[^\d\.]/g,""));
						$(".totalCost span").html("¥"+totalcost*$(".roomnum").html());
						$(".totalCharge span").html("¥"+totalcost*$(".roomnum").html());
						var html="";
						var priceList=result.data.house.priceList;
						for(var i=0;i<priceList.length;i++){
							html+='<dd class="clearfix">'
								+'<span class="fl">'+priceList[i].price_date+'</span>'
								+'<span class="dayCost fr">¥'+ priceList[i].price+'×'+$(".roomnum").html()+'</span>'
								+'</dd>';
						}
						$(".roomCharge").empty().html("<dt>房费</dt>"+html);
					}
				}
			});
		}
	};
}());
