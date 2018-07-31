$(function(){
	QUERY.init();
});
var QUERY = (function(){
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
			//初始化头部及搜索框内的内容
			if(localStorage.getItem('KEYWORD')){
				$("#citySearch").val(localStorage.getItem('KEYWORD'));
				$(".deleteKeyword").show();
			}
			var location=eval("("+localStorage.getItem("currentPosition")+")");
			$(".thetittle").html(location["posname"]);
		},
		bindUI: function() {
			var openid = $('#open_id').val();
			$(".dispopup").on("opened",function(){
				$(".modal-overlay-visible").on(CLICK,function(){
					$.closeModal('.popup.dispopup.modal-in');
				});
			});
			//搜索输入框
			$("#citySearch").on(CLICK, function () {
				window.location.href = ctx+"/hotel/wx/v1/keyword/keyWordFilterPage?openid=" + openid+"&source=searchList";
			});
			$(".queryHotelList").delegate(".queryHotelItem", CLICK, function () {
				var hotelId = $(this).find('.hotelId').val();
				var checkintime =  sessionStorage.getItem('checkintime');
				var leavetime = sessionStorage.getItem('leavetime');
				window.location.href =  ctx+"/hotel/wx/v1/hotel/queryHotelDetail?openid="+openid+"&hotel_id="+hotelId+"&checkintime="+checkintime+"&leavetime="+leavetime;
			});
			/*酒店列表加载*/
			// 加载flag
			var loading = false;
			var nomore=false;
			var pageNum=1;
			var sortType = '';
			var section_id="";
			var hotel_id="";
			addItems(sortType,1);
			//点击搜索框内的×按钮
			$(".deleteKeyword").on(CLICK,function(){
				$("#citySearch").val("");
				$(".deleteKeyword").hide();
				localStorage.removeItem("KEYWORD");
				localStorage.removeItem("KEYWORDID");
				localStorage.removeItem("HOTELID");
				localStorage.removeItem("KEYWORDNAV");
				localStorage.removeItem("KEYWORDLIST");
				localStorage.removeItem("METROLINELIST");
				addItems(sortType,1);
				nomore=false;
				loading = false;
				pageNum=1;
			});
			/*点击筛选栏中的排序*/
			$(".sortpopupbox").on(CLICK,"li",function(){
				sortType = $(this).attr('data-sort');
				$(".sortpopupbox li").removeClass("curSortStandard");
				$(this).addClass("curSortStandard");
				$.closeModal('.popup.modal-in');
				addItems(sortType,1);
				nomore=false;
				loading = false;
				pageNum=1;
			});
			//价格星级弹出层点击确定
			$("#confirmStarPrice a").on(CLICK,function(){
				var starIndexArr=[];
				for(var i=0;i<$(".selectedstar").length;i++){
					starIndexArr.push($(".selectedstar").eq(i).index());
				}
				if($(".selectedprice").index()==0) {
					sessionStorage.setItem("PRICE",'');
				}else{
					sessionStorage.setItem("PRICE",$(".selectedprice").index());
				}
				if(starIndexArr[0]=='0') {
					sessionStorage.setItem("STAR",'');
				}else{
					sessionStorage.setItem("STAR",starIndexArr);
				}
				$.closeModal('.popup.priceStarpopup.modal-in');
				addItems(sortType,1);
				nomore=false;
				loading = false;
				pageNum=1;
			});
			function addItems(sorttype,thepageid) {
				if (loading) return;
				loading = true;
				$(".nomoredata").hide();
				$('.infinite-scroll-preloader').show();
				if (thepageid == 1) {
					$("#queryHotelList").empty();
				}
				var data = {};
				var location=eval("("+localStorage.getItem("currentPosition")+")");
				data.openid = openid;
				data.city_id = location["posid"];
				data.checkintime =  sessionStorage.getItem('checkintime')?sessionStorage.getItem('checkintime'):"";
				data.leavetime = sessionStorage.getItem('leavetime')?sessionStorage.getItem('leavetime'):"";
				data.section_id = localStorage.getItem('KEYWORDID')?localStorage.getItem('KEYWORDID'):"";
				data.hotel_id = localStorage.getItem('HOTELID')?localStorage.getItem('HOTELID'):"";
				data.keyword=localStorage.getItem('KEYWORD')?localStorage.getItem('KEYWORD'):"";
				data.choosePrice = sessionStorage.getItem('PRICE')?sessionStorage.getItem('PRICE'):"";
				data.chooseStar = sessionStorage.getItem('STAR')?sessionStorage.getItem('STAR'):"";
				data.lat = sessionStorage.getItem('thelat')?sessionStorage.getItem('thelat'):"";
				data.lng = sessionStorage.getItem('thelng')?sessionStorage.getItem('thelng'):"";
				data.sorttype = sorttype;
				data.page_id = thepageid;
				$.ajax({
					data:data,
					url: ctx+'/hotel/api/v1/hotel/queryHotelListByPage',
					type: "GET",
					dataType: "html",
					success: function (result) {
						loading = false;
						// 删除加载提示符
						$('.infinite-scroll-preloader').hide();
						$("#queryHotelList").append(result);
						if($(".totalhotel").val()==0){
							$(".nomoredata").html("没有相关的酒店");
						}else{
							$(".nomoredata").html("没有更多结果了");
						}
						if (thepageid >= $(".pageCount").val()) {
							nomore = true;
							$(".nomoredata").show();
							return;
						}
						pageNum++;
					}
				});
			}
			var container = document.getElementById("content");
			container.onscroll = function () {
				var scrollTop = container.scrollTop;
				var scrollHeight = container.scrollHeight;
				var height = container.offsetHeight;
				var scrollB = scrollTop + height;
				if (scrollB >= scrollHeight - 550) {
					if (nomore) {
						return;
					}
					addItems(sortType,pageNum);
				}
			};
		}
	};
}());