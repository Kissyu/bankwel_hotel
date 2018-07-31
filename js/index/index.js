$(function(){
	Reserve.init();
});
var Reserve = (function(){
	
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
			//选择床型
			  $("#bedtype").picker({
		          toolbarTemplate: '<header class="bar bar-nav">\
			          <button class="button button-link pull-right close-picker">确定</button>\
			          <h1 class="title">请选择床型</h1>\
			          </header>',
		          cols: [
		            {
		              textAlign: 'center',
		              values: ['不限', '双床','大床']
		            }
		          ]
		        });
			  $("#bedtype").next("em").on(CLICK,function(){
				  $("#bedtype").picker('open');
			  });
			  $("#hotelname").inputValidate("");
			  //初始化搜索酒店方式
			  var queryType=sessionStorage.getItem("QUERYTYPE");
			  if(queryType){
				  $(".queryWay li").removeClass("selectedWay");
				  $(".queryWay li").eq(queryType).addClass("selectedWay");
				  $(".querymethod").removeClass("selectedmethod");
				  $(".querymethod").eq(queryType).addClass("selectedmethod");
			  }
			//初始化价格、星级
			  var selectedPrice=sessionStorage.getItem("PRICE");
			  var selectedStar=sessionStorage.getItem("STAR");
			  if(selectedPrice||selectedStar){
				  $(".choosePrice li").eq(selectedPrice).addClass("selectedprice");
				  var seStarArr=selectedStar.split(",");
				  for(var i=0;i<seStarArr.length;i++){
					  $(".chooseStar").children().eq(seStarArr[i]).addClass("selectedstar");
				  }
				  getPriceStar()
			  }else{
				  $(".choosePrice li").eq(0).addClass("selectedprice");
				  $(".chooseStar").children().eq(0).addClass("selectedstar");
			  }
		},
		bindUI: function(){
			/*选择搜索酒店方式*/
			$(".queryWay li").on(CLICK,function(){
				$(".queryWay li").removeClass("selectedWay");
				$(this).addClass("selectedWay");
				$(".querymethod").removeClass("selectedmethod");
				$(".querymethod").eq($(this).index()).addClass("selectedmethod");
			})
			/*选择入离店时间*/
			var oDate=new Date();
			var oYesterday=new Date();
			var oTomorrow=new Date();
			oYesterday.setDate(oYesterday.getDate()-1);
			oTomorrow.setDate(oTomorrow.getDate()+1);
			var yesterday=oYesterday.getFullYear()+'-'+toDou(oYesterday.getMonth()+1)+'-'+toDou(oYesterday.getDate());
			var today=oDate.getFullYear()+'-'+toDou(oDate.getMonth()+1)+'-'+toDou(oDate.getDate());
			var tomorrow=oTomorrow.getFullYear()+'-'+toDou(oTomorrow.getMonth()+1)+'-'+toDou(oTomorrow.getDate());
			$("#checkintime").val(today);
			$("#leavetime").val(tomorrow);
			$("#checkintime").change(calcRestDay);
			$("#leavetime").change(calcRestDay);
			$("#checkintime").calendar({
				minDate:[yesterday],
				value:[today]
			});
			$("#leavetime").calendar({
				minDate:[today],
				value:[tomorrow]
			});
			/*选择目的地*/
			if(localStorage.getItem("currentPosition")){
				var location=eval("("+localStorage.getItem("currentPosition")+")");
				$("#locationAdd").html(location["posname"]);
				$("#locationAdd").attr("data-cityid",location["posid"]);
			}
			$("#mylocation").on(CLICK,function(){
				sessionStorage.setItem("QUERYTYPE",$(".selectedWay").index());
				var openid=$("input[name='openid']").val();
				sessionStorage.removeItem("KEYWORD");
				sessionStorage.removeItem("KEYWORDNAV");
				sessionStorage.removeItem("KEYWORDLIST");
				sessionStorage.removeItem("METROLINELIST");
				window.location.href=ctx+"/city/cityList?openid="+openid;
			});
			/*我的位置*/
			$("#locate").on(CLICK,function(){
				getlocation(function(json){
					if(json.status==0){
						$("#locationAdd").html(json.result.formatted_address);
					}
				});
			});
			var infiniteScroll=false;
			/*酒店全称联想*/
			$("#hotelname").on("change focus",function(){
				if(!localStorage.getItem("currentPosition")){
					$.toast("请先选择目的地");
				}else if($(this).val()!=""){
					var cityid=eval("("+localStorage.getItem("currentPosition")+")")["posid"];
					var nameInp=$(this).val();
					$(".page.page-current").show();
					$('.infinite-scroll-preloader').show();
	                $(".nomoredata").hide();
					$('.infinite-scroll-bottom .list-container').empty();
					// 加载flag
					var loading = false;
				    var nomore=false;
				    function addItems(nameInp,pageNum) {
				    	var data={};
						data.cityId=cityid;
						data.name=nameInp;
						data.pageNumber=pageNum;
				    	$.ajax({
				    		data:data,
							url:ctx+'/hotel/getHotelsByName',
							type:"POST",
							dataType: "json",
							success:function(result){
								if(result.length<10){
									nomore=true;
								}
								var html = '';
								for(var i = 0; i < result.length; i++){
									html += '<li class="item-content"><div class="item-inner"><div class="item-title">' + result[i]["name"] + '</div></div></li>';
								}
								$('.infinite-scroll-bottom .list-container').append(html);
								if(result.length<20){
									nomore=true;
					                  // 删除加载提示符
					                  $('.infinite-scroll-preloader').hide();
					                  $(".nomoredata").show();
					                  return;
								}
							}
						});     
				     }
				      addItems(nameInp,1);
				      var pageNum=2;
				      var container=document.getElementById("content")
				      container.onscroll=function(){
				    	  var scrollTop = container.scrollTop;
				    	  var scrollHeight = container.scrollHeight;
				    	  var height = container.offsetHeight;
				    	  var scrollB=scrollTop + height;
					      if(scrollB >= scrollHeight-150){
					    	  if (loading) return;
					          loading = true;
					          setTimeout(function() {
					              loading = false;
					              if (nomore) {
					                  $('.infinite-scroll-preloader').hide();
					                  $(".nomoredata").show();
					                  container.onscroll=null;
					                  return;
					              }
					              addItems(nameInp,pageNum);
						    	  pageNum++;
					          }, 1000);
					    	  
					  	  }
				      };
				}else{
					$("#page-infinite-scroll-bottom").hide();
				}
			});
			$(document).on(CLICK,function(e){
				if(!$(e.target).hasClass("hotelfullname")){
					$("#page-infinite-scroll-bottom").hide();
				}
			});
			$("#content").delegate("li",CLICK,function(){
				$("#hotelname").val($(this).find(".item-title").html());
				$("#page-infinite-scroll-bottom").hide();
			})
			/*选择关键字/位置/商圈*/
			if(sessionStorage.getItem("KEYWORD")){
				$("#areaInp").siblings(".input-writetip").hide();
				$("#areaInp").html(sessionStorage.getItem("KEYWORD"));
				$("#area").siblings(".cancelSelect").show();
				$("#area").addClass("jsKeywordInp");
			}
			$("#area").on(CLICK,function(){
				if(!localStorage.getItem("currentPosition")){
					$.toast("请先选择目的地");
				}else{
					sessionStorage.setItem("QUERYTYPE",$(".selectedWay").index());
					var openid=$("input[name='openid']").val();
					window.location.href=ctx+"/city/keywordfilter?openid="+openid;
				}
			});
				//点击×按钮
			$("#areaDelete").on(CLICK,function(){
				$("#area").children(".deleteItem").html("");
				$("#area").children(".input-writetip").show();
				$(this).hide();
				sessionStorage.removeItem("KEYWORD");
				sessionStorage.removeItem("KEYWORDNAV");
				sessionStorage.removeItem("KEYWORDLIST");
				sessionStorage.removeItem("METROLINELIST");
				var deleteTimer = setTimeout(function(){
					$("#area").removeClass("jsKeywordInp")
					clearTimeout(deleteTimer);
				},30);
			});
			/*选择价格、星级*/
			$(".choosePrice li").on(CLICK,function(){
				$(".choosePrice li").removeClass("selectedprice");
				$(this).addClass("selectedprice");
			});
			$(".chooseStar dd").on(CLICK,function(){
				if($(this).hasClass("selectedstar")){
					$(this).removeClass("selectedstar");
					if($(".selectedstar").length==0){
						$(".chooseStar dt").addClass("selectedstar");
					}
				}else{
					$(".chooseStar dt").removeClass("selectedstar");
					$(this).addClass("selectedstar");
				}
			});
			$(".chooseStar dt").on(CLICK,function(){
				$(".chooseStar dd").removeClass("selectedstar");
				$(this).addClass("selectedstar");
			});
			$(".priceStarpopup").on("opened",function(){
				$(".modal-overlay-visible").on(CLICK,function(){
					$.closeModal('.popup.priceStarpopup.modal-in');
				});
			});
			$("#confirmStarPrice a").on(CLICK,function(){
				getPriceStar();
				var starIndexArr=[];
				for(var i=0;i<$(".selectedstar").length;i++){
					starIndexArr.push($(".selectedstar").eq(i).index());
				}
				sessionStorage.setItem("PRICE",$(".selectedprice").index());
				sessionStorage.setItem("STAR",starIndexArr.join(","));
				$.closeModal('.popup.priceStarpopup.modal-in');
			});
			//点击×按钮
			$("#priceDelete").on(CLICK,function(){
				var bedtype=$(this).siblings(".bedtype");
				bedtype.children(".deleteItem").html("");
				bedtype.children(".input-writetip").show();
				$(this).hide();
				sessionStorage.removeItem("PRICE");
				sessionStorage.removeItem("STAR");
				$(".choosePrice li").removeClass("selectedprice");
				$(".chooseStar").children().removeClass("selectedstar");
				$(".choosePrice li").eq(0).addClass("selectedprice");
				$(".chooseStar").children().eq(0).addClass("selectedstar");
				var deleteTimer = setTimeout(function(){
					bedtype.removeClass("jsKeywordInp")
					clearTimeout(deleteTimer);
				},30);
			});
			/*点击开始搜索*/
			$("#searchNow").on(CLICK,function(){
				var data={};
				if($("#locationAdd").html()==""){
					$.toast("请您选择目的地");
					return;
				}
				if($(".selectedWay").index()==0){//精准预定
					if($("#hotelname").val()==""){
						$.toast("请您输入酒店全称！");
						return;
					}
					data.type=1;
					data.hotelName=$("#hotelname").val();
				}else{//按需找房
					if($("#areaInp").html()==""){
						$.toast("请您选择关键字/位置/商圈");
						return;
					}else if($("#pricetarInp").html()==""){
						$.toast("请选择价格/星级");
						return;
					}
					var star=[];
					for(var i=0;i<$(".selectedstar").length;i++){
						star.push($(".selectedstar").eq(i).html());
					}
					data.type=2;
					data.starType=star.join(",");
					data.priceMin=$(".selectedprice").html();
					data.hotelName=$("#areaInp").html();
				}
				if(!$(this).hasClass("clicked")){
					$(this).addClass("clicked");
					data.destination=$("#locationAdd").html();
					data.startTime=$("#checkintime").val();
					data.endTime=$("#leavetime").val();
					data.houseType=$("#bedtype").val();
					data.remark=$("#remark").val();
					//获取用户的openid
					data.openid=$("#open_id").val();
					$.ajax({
						type: "post",
						url:ctx+'/hotel/submitOccupancyInfo',
						data: data,
						dataType: "json",
						success: function(result,state) {
							console.info(result);
							if(result.code==0){
								$.alert("您搜索的结果稍后我们将会以微信消息的形式发送到您手机上，请耐心等待！",function(){
									WeixinJSBridge.invoke('closeWindow');
									$("#searchNow").removeClass("clicked");
								});
							}else{
								$("#searchNow").removeClass("clicked");
								$.alert(result.message,function(){
									WeixinJSBridge.invoke('closeWindow');
									$("#searchNow").removeClass("clicked");
								});
							}
						}
					});
				}
			});
			function calcRestDay(){
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
					$(".livedate").html("共"+1+"晚");
				}else{
					$(".livedate").html("共"+parseInt(totalday)+"晚");
				}
			}
		}
	};
}());
//价格、星级
function getPriceStar(){
	var priceStar=[];
	if(!$(".selectedprice").index()==0){
		priceStar.push($(".selectedprice").html());
	}
	if(!$(".selectedstar").is("dt")){
		for(var i=0;i<$(".selectedstar").length;i++){
			priceStar.push($(".selectedstar").eq(i).html());
		}
	}
	$(".pricetarInp").html(priceStar.join(","));
	if(priceStar.length!=0){
		$("#pricetarInp").siblings(".input-writetip").hide();
		$("#pricetarInp").parent(".bedtype").siblings(".cancelSelect").show();
		$("#pricetarInp").parent(".bedtype").addClass("jsKeywordInp");
	}else{
		$("#pricetarInp").siblings(".input-writetip").show();
		$("#pricetarInp").parent(".bedtype").siblings(".cancelSelect").hide();
		$("#pricetarInp").parent(".bedtype").removeClass("jsKeywordInp");
	}
}