$(function(){
	Trade.init();
});
var Trade = (function(){
	var keyWordNav=sessionStorage.getItem("KEYWORDNAV");
	var keyWordList=sessionStorage.getItem("KEYWORDLIST");
	var metroLineList=sessionStorage.getItem("METROLINELIST");
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
			//初始化关键字/位置/商圈列表
			if(keyWordNav){
				$(".keyWordNav li").eq(keyWordNav).addClass("curSelected");
			}else{
				$(".keyWordNav li").eq(0).addClass("curSelected");
			}
		},
		bindUI: function(){
			var openid=$("input[name='openid']").val();
			//分类导航
			var cityid=eval("("+localStorage.getItem("currentPosition")+")")["posid"];
			getlist(cityid,$(".curSelected").attr("data-type"),$(".curSelected").index()+1);
			$(".keyWordNav").delegate("li",CLICK,function(){
				$(".keyWordNav li").removeClass("curSelected");
				$(this).addClass("curSelected");
				getlist(cityid,$(this).attr("data-type"),$(this).index()+1);
			});
			$(".keyWordList").delegate("li",CLICK,function(){
				var thisIndex=$(this).index();
				$(".keyWordList li").removeClass("selectedWord");
				$(this).addClass("selectedWord");
				if($(this).hasClass("metroLine")){
					var data={};
					data.cityId=cityid;
					data.type=2;
					$.ajax({
						data:data,
						url:ctx+'/city/getKeywordType',
						type:"POST",
						dataType: "json",
						success:function(result){
							var stationArr=eval("("+result+")")["MetroLineList"]["MetroLineList"][thisIndex]["MetroStationList"];
							for(var i=0;i<stationArr.length;i++){
								$("#metroLineList").append("<li>"+stationArr[i]["Name"]+"</li>")
							}
							if(metroLineList&&(keyWordList==$("#keyWordList li.selectedWord").index())&&(keyWordNav==$(".keyWordNav li.curSelected").index())){
								$("#metroLineList li").eq(metroLineList).addClass("selectedWord");
							}
						}
					});
					$(".selectKeyWord").hide();
					$("#metroLineList").show();
				}else if($(this).hasClass("hotelList")){
					$(".selectKeyWord").hide();
					$("#metroLineList").show();
					var nameInp=$(this).html();
					$(".page.page-current").show();
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
								var html = '';
								for(var i = 0; i < result.length; i++){
									html += '<li class="item-content">' + result[i]["name"] + '</li>';
								}
								$('.infinite-scroll-bottom .list-container').append(html);
								if(metroLineList&&(keyWordList==$("#keyWordList li.selectedWord").index())&&(keyWordNav==$(".keyWordNav li.curSelected").index())){
									$("#page-infinite-scroll-bottom li").eq(metroLineList).addClass("selectedWord");
								}
								if(result.length<20){
									nomore=true;
									$.detachInfiniteScroll($('.infinite-scroll'));
					                  // 删除加载提示符
					                  $('.infinite-scroll-preloader').remove();
					                  $(".nomoredata").show();
					                  return;
								}
							}
						});     
				     }
				      addItems(nameInp,1);
				      var pageNum=2;
					$(document).on("pageInit", "#page-infinite-scroll-bottom", function(e, id, page) {
					      // 注册'infinite'事件处理函数
					      $(page).on('infinite', function() {
					          // 如果正在加载，则退出
					          if (loading) return;
					          // 设置flag
					          loading = true;
					          // 模拟1s的加载过程
					          setTimeout(function() {
					              // 重置加载flag
					              loading = false;
					              if (nomore) {
					                  // 加载完毕，则注销无限加载事件，以防不必要的加载
					                  $.detachInfiniteScroll($('.infinite-scroll'));
					                  // 删除加载提示符
					                  $('.infinite-scroll-preloader').remove();
					                  $(".nomoredata").show();
					                  return;
					              }
					              // 添加新条目
					              addItems(nameInp,pageNum);
					              pageNum++;
					              //容器发生改变,如果是js滚动，需要刷新滚动
					              $.refreshScroller();
					          }, 1000);
					      });
					});
					$.init();
				}else{
					sessionStorage.setItem("KEYWORDNAV",$(".curSelected").index());
					sessionStorage.setItem("KEYWORDLIST",$("#keyWordList li.selectedWord").index());
					sessionStorage.setItem("KEYWORD",$(this).html());
					var oDate=new Date();
					window.location.href=ctx+"/?openid="+openid+"&now="+oDate.getTime();
				}
			});
			//点击地铁站
			$(".metroLineList").delegate("li",CLICK,function(){
				$("#metroLineList li").removeClass("selectedWord");
				$(this).addClass("selectedWord");
				sessionStorage.setItem("KEYWORDNAV",$(".curSelected").index());
				sessionStorage.setItem("KEYWORDLIST",$("#keyWordList li.selectedWord").index());
				sessionStorage.setItem("METROLINELIST",$(this).index());
				sessionStorage.setItem("KEYWORD",$(this).html());
				var oDate=new Date();
				window.location.href=ctx+"/?openid="+openid+"&now="+oDate.getTime();
			})
			/*搜索框输入*/
			$("#keywordSearchInp").on("keyup",function(){
				var timer=null
				if(timer){
        			clearTimeout(timer);
        		}
				timer=setTimeout(function(){
					var data={};
					data.keyword=$("#keywordSearchInp").val();
					data.cityId=cityid;
		        	if($("#keywordSearchInp").val()!=""){
		        		$("#keywordSearchInp").parent(".keyWordInp").removeClass("hasValueInp");
		        		$("#cancleSearch").show();
		        		$(".selectKeyWord").hide();
		        		$(".keywordResult").show();
			        	$.ajax({
			        		data:data,
		        			url:ctx+'/city/hotAutoallTip',
		        			type:"POST",
		        			dataType: "json",
		        			success:function(result){
		        				var backValue=eval("("+result+")");
		        				if(backValue["ErrorCode"]=="1"){
		        					$(".cityEmpty").hide();
		        					$(".searchedCityList").show();
		        					$(".searchedCityList").empty();
			        				for(var item in backValue){
			        					if(item!="ErrorCode"&&backValue[item].length!=0){
			        						for(var j=0;j<backValue[item].length;j++){
				        						var searchedType="";
				        						switch(backValue[item][j][2]){
				        							case "6":
				        								searchedType="品牌";
				        								break;
				        							case "3":
				        								searchedType="行政区";
				        								break;
				        							case "2":
				        								searchedType="商圈";
				        								break;
				        							case "4":
				        								searchedType="地标";
				        								break;
				        							case "9":
				        								searchedType="酒店";
				        								break;
				        							case "1":
				        								searchedType="景点";
				        								break;
				        							default:
				        								break;
				        						}
					        		        	$(".searchedCityList").append('<li><p class="searchedName">'
					        		        			+backValue[item][j][1]
					        		        			+'</p><span class="searchedType">'+searchedType+'</span></li>');
			        						}
			        					}
			        		        }
		        				}else{
		        					$(".searchedCityList").hide();
		        					$(".cityEmpty").show();
		        				}
		        			}
			        	});
		        	 }else{
		        		 $("#keywordSearchInp").parent(".keyWordInp").addClass("hasValueInp");
		        		 $("#cancleSearch").hide();
		        		 $(".cityEmpty").hide();
		        		 $(".searchedCityList").empty();
		        		 $(".selectKeyWord").show();
		        		 $(".keywordResult").hide();
		        	 }
				},350);
	        });
	        $(".searchedCityList").delegate("li",CLICK,function(){
	        	sessionStorage.setItem("KEYWORD",$(this).children(".searchedName").html());
	        	var oDate=new Date();
				window.location.href=ctx+"/?openid="+openid+"&now="+oDate.getTime();
	        });
	        $("#cancleSearch").on(CLICK,function(){
	        	sessionStorage.setItem("KEYWORD",$("#keywordSearchInp").val());
	        	var oDate=new Date();
				window.location.href=ctx+"/?openid="+openid+"&now="+oDate.getTime();
	        });
	        function getlist(cityid,type,index){
	        	var data={};
	        	data.cityId=cityid;
	        	data.type=type;
	        	$.ajax({
	        		data:data,
	        		url:ctx+'/city/getKeywordType',
	        		type:"POST",
	        		dataType: "json",
	        		success:function(result){
	        			var backvalue=eval("("+result+")");
	        			if(backvalue["RspStatus"]==true){
	        				var list="";
	        				var listname="Name";
	        				switch(index){
	        					case 1:
	        						list=backvalue["HotSceneryList"]["HotSceneryList"];
	        						break;
	        					case 2:
	        						list=backvalue["HotelBizSectionList"]["BizSectionList"];
	        						break;
	        					case 3:
	        						list=backvalue["TrafficStationList"]["TrafficStationList"];
	        						break;
	        					case 4:
	        						list=backvalue["MetroLineList"]["MetroLineList"];
	        						listname="LineName";
	        						break;
	        					case 5:
	        						list=backvalue["HotelSectionList"]["SectionList"];
	        						break;
	        					case 6:
	        						list=backvalue["HotelBizSectionList"]["BizSectionList"];
	        						break;
	        					case 7:
	        						list=backvalue["chainInfo"];
	        						listname="ChainName";
	        						break;
	        					default:
	        						break;	
	        				}
	        				$("#keyWordList").empty();
	        				var len=list.length;
	        				if(index==2){
	        					len=list.length>10?10:list.length;
	        				}
	        				for(var i=0;i<len;i++){
	        					if(index==4){
	        						$("#keyWordList").append("<li class='metroLine'>"+list[i][listname]+"</li>");
	        					}else if(index==7){
	        						$("#keyWordList").append("<li class='hotelList'>"+list[i][listname]+"</li>");
	        					}else{
	        						$("#keyWordList").append("<li>"+list[i][listname]+"</li>");
	        					}
	        				}
	        				if(keyWordList&&(keyWordNav==$(".keyWordNav li.curSelected").index())){
	        					$(".keyWordList li").eq(keyWordList).addClass("selectedWord");
	        				}
	        			}else{
	        				$("#keyWordList").empty();
	        				$("#keyWordList").html(backvalue["RspDesc"]);
	        			}
	        		}
	        	});
	        }
		}
	};
}());
