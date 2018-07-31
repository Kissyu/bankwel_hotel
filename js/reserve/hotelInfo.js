$(function(){
	Reserve.init();
});
var Reserve = (function(){
	var swiper=null;
	return {
		init: function(){
			me = this;
			this.initVars();
			this.renderUI();
			this.bindUI();
		},
		initVars: function(){
			
		},
		renderUI: function(){
			/*初始化轮播图片宽度*/
			var len=$(".photobox li").length;
			for(var i=0;i<len;i++){
				$(".photobox li").width(100/len+"%");
			}
		},
		bindUI: function(){
			var openid = $('#open_id').val();
			/*收藏*/
			var collectFlag = 0;
			$("#enshrine").on(CLICK,function(){
				if($(this).hasClass('enshrined')) {
					collectFlag = 0;
					$(this).removeClass('enshrined');
				}else {
					collectFlag = 1;
					$(this).addClass('enshrined');
				}
				$.ajax({
					type: 'GET',
					data: {
						openid: openid,
						target_type: 'hotel',
						target_id: $('#hotelId').val(),
						opt_type: collectFlag
					},
					url:ctx+'/hotel/api/v1/user/favorit',
					dataType: 'json',
					success: function(result) {
						if(result.code ==1) {

						}
					}
				});
			});
			/*获取入住与离店时间*/
			var checkInTime = null;
			var leaveTime = null;
			function formatDate(num){
				var oDate=new Date();
				oDate.setDate(oDate.getDate()+(num));
				var targetDay=oDate.getFullYear()+'-'+toDou(oDate.getMonth()+1)+'-'+toDou(oDate.getDate());
				return targetDay;
			}
			var yesterday=formatDate(-1);
			var today=formatDate(0);
			var tomorrow=formatDate(1);
			var maxInDay=formatDate(30);
			var maxOutDay=formatDate(60);

			if(sessionStorage.getItem('checkintime')){
				checkInTime = sessionStorage.getItem('checkintime');
			}else if(getUrlParam('checkintime')){
				checkInTime = getUrlParam('checkintime');
			}else{
				checkInTime = today;
			}
			if(sessionStorage.getItem('leavetime')){
				leaveTime = sessionStorage.getItem('leavetime');
			}else if(getUrlParam('leavetime')){
				leaveTime = getUrlParam('leavetime');
			}else{
				leaveTime = tomorrow;
			}

			$('.startWeek').html('周'+calWeek(checkInTime));
			$('.endWeek').html('周'+ calWeek(leaveTime));
			$('.totalday').html(sessionStorage.getItem('timeDay'));

			$("#checkintime").val(checkInTime);
			$("#leavetime").val(leaveTime);
			$("#checkintime").change(changeDate);
			$("#leavetime").change(changeDate);
			$("#checkintime").calendar({
				minDate:[yesterday],
				maxDate:[maxInDay],
				value:[checkInTime]
			});
			$("#leavetime").calendar({
				minDate:[today],
				maxDate:[maxOutDay],
				value:[leaveTime]
			});
			function changeDate(){
				var livein=$("#checkintime").val().split('-');
				var oDate1=new Date();
				oDate1.setFullYear(livein[0],livein[1]-1,livein[2]);
				timein=oDate1.getTime();
				var leave=$("#leavetime").val().split('-');
				var oDate2=new Date();
				oDate2.setFullYear(leave[0],leave[1]-1,leave[2]);
				var timeleave=oDate2.getTime();
				var totalday=(timeleave-timein)/86400000;
				if(totalday<=0){
					oDate1.setDate(oDate1.getDate()+1);
					$("#leavetime").val(oDate1.getFullYear()+'-'+toDou(oDate1.getMonth()+1)+'-'+toDou(oDate1.getDate()));
					$(".totalday").html(1);
				}
				$(".totalday").html(parseInt(totalday));
				$(".startWeek").html("周"+calWeek($("#checkintime").val()));
				$(".endWeek").html("周"+calWeek($("#leavetime").val()));
				sessionStorage.setItem("checkintime",$("#checkintime").val());
				sessionStorage.setItem("leavetime",$("#leavetime").val());
				sessionStorage.setItem('timeDay',parseInt(totalday));
				var data={};
				data.openid=$("#open_id").val();
				data.hotel_id=$("#hotelId").val();
				data.checkintime=$("#checkintime").val();
				data.leavetime=$("#leavetime").val();
				$.ajax({
					type: "post",
					url:ctx+'/hotel/wx/v1/hotel/queryHotelDetail',
					data: data,
					dataType: "html",
					success: function(result) {
						if(result){
							$(".houseList").empty().append($(result).find(".houseList").html());
						}
					}
				});
			}
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
				var data={};
				data.openid=$("#open_id").val();
				data.hotel_id=$("#hotelId").val();
				data.checkintime=$(".startday").attr("data-start");
				data.leavetime=$(".endday").attr("data-end");
				$.ajax({
					type: "post",
					url:ctx+'/hotel/wx/v1/hotel/queryHotelDetail',
					data: data,
					dataType: "html",
					success: function(result) {
						if(result){
							$(".houseList").empty().append($(result).find(".houseList").html());
						}
					}
				});
			});
*/
			/*收起与展示房型的具体价格*/
			$(document).delegate(".houseTypeList",CLICK,function(){
				if(!$(this).hasClass("showDetailMoney")){
					$(this).addClass("showDetailMoney");
					$(this).siblings(".detailMoneyBox").show();
				}else{
					$(this).removeClass("showDetailMoney");
					$(this).siblings(".detailMoneyBox").hide();
				}
			});
			/*显示房型详情*/
			$(document).delegate(".priceIdList,.houseCostZera",CLICK,function(){
				var data={};
				data.openid=openid;
				data.price_id=$(this).parents("dd").find('.priceId').val();
				data.checkintime=$("#checkintime").val();
				data.leavetime=$("#leavetime").val();
				var arr=[];
				for(var i in data){
					arr.push(i+"="+data[i]);
				}
				window.location.href=ctx+'/hotel/wx/v1/hotel/queryHouseDetail?'+arr.join("&");
			});
			/*点击预定*/
			$(document).delegate(".reserveBtn",CLICK,function(){
				var priceId = $(this).parents().find('.priceId').val();
				var checkInTime=$("#checkintime").val();
				var leaveTime=$("#leavetime").val();
				var openid = $('#open_id').val();
				sessionStorage.setItem('price_id',priceId);
				sessionStorage.setItem('hotel_id',$('#hotelId').val());
				sessionStorage.setItem('checkintime',checkInTime);
				sessionStorage.setItem('leavetime',leaveTime);
				sessionStorage.setItem('timeDay',$('.totalday').html());
				window.location.href = ctx+"/hotel/wx/v1/hotel/newOrderPage?openid="+openid+"&price_id="+priceId+"&checkintime="+checkInTime+"&leavetime="+leaveTime;
			});
			/*酒店实景图*/
			swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        paginationType: 'fraction',
		        onTap:function(swiper){
		        	$("#photo_mark").hide();
			        $(".showbox").css('visibility','hidden');
		        }
		    });
		    $(".photobox li").on(CLICK,function(ev){
		        $(".showbox").css('visibility','visible');
		        $("#photo_mark").show();
		        var aPhotoLi=$(".showphotobox").children("li");
			    var num=aPhotoLi.length;
			    aPhotoLi.css('width',$(window).width()+'px');
			    var awidth=aPhotoLi.first().width();
			    $(".showphotobox").css("width",(num*awidth)+'px');
			    for(var i=0;i<$(".showphotobox li").length;i++){
			        $(".showphotobox li").eq(i).css('marginTop',-($(".showphotobox li img").eq(i).height()/2)+'px');
			    }
			    swiper.slideTo($(this).index(),0,false);
		    });
			/*调用酒店地图*/
			$('.locationMap').on(CLICK,function() {
				var jing = $('#mapLocationLat').val();
				var wei = $('#mapLocationLng').val();
				sessionStorage.setItem('jing',jing);
				sessionStorage.setItem('wei',wei);
				window.location.href = ctx+'/hotel/wx/v1/geo/hotelMapPage';
			});
		}
	};
}());