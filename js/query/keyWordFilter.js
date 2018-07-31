$(function(){
	Trade.init();
});
var Trade = (function(){
	var keyWordNav=localStorage.getItem("KEYWORDNAV");
	var keyWordList=localStorage.getItem("KEYWORDLIST");
	var metroLineList=localStorage.getItem("METROLINELIST");
	var keyWordId = localStorage.getItem("KEYWORDID");
	var openid=$("input[name='openid']").val();
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
			//返回上一步
			$(".returnback").on(CLICK,function(){
				if(getUrlParam("source")=="searchList"){
					window.location.href=ctx+"/hotel/wx/v1/hotel/queryHotelList?openid="+openid;
				}else{
					window.location.href=ctx+"/hotel/wx/v1/company/welcome?openid="+openid;
				}
			});
			//分类导航
			var cityid=eval("("+localStorage.getItem("currentPosition")+")")["posid"];
			getlist(cityid,$(".curSelected").attr("data-type"),$(".curSelected").index()+1);
			$(".keyWordNav").delegate("li",CLICK,function(){
				$(".keyWordNav li").removeClass("curSelected");
				$(this).addClass("curSelected");
				getlist(cityid,$(this).attr("data-type"),$(this).index()+1);
			});
			$(".keyWordList").delegate("li",CLICK,function(){  //每一个地点的列表
				$(".keyWordList li").removeClass("selectedWord");  //先清除其他li的样式
				$(this).addClass("selectedWord");  //为当前选中的添加样式
				if($(this).hasClass("metroLine")){  //地铁线
					var data={};
					data.cityid=cityid;
					data.type=2;
					data.parent_id=$(this).attr("data-parentId");
					$.ajax({
						data:data,
						url:ctx+'/hotel/api/v2/keyword/getKeywordType',
						type:"GET",
						dataType: "json",
						success:function(result){
							var stationArr=result.data;
							for(var i=0;i<stationArr.length;i++){
								$("#metroLineList").append("<li data-sectionId='"+stationArr[i]["id"]+"'>"+stationArr[i]["name"]+"</li>");
							}
							if(metroLineList&&(keyWordList==$("#keyWordList li.selectedWord").index())&&(keyWordNav==$(".keyWordNav li.curSelected").index())){
								$("#metroLineList li").eq(metroLineList).addClass("selectedWord");
							}
						}
					});
					$(".selectKeyWord").hide();
					$("#metroLineList").show();
				}else{
					if($(this).hasClass("hotelList")){
						localStorage.setItem("HOTELID",$(this).attr('data-hotelId'));
						localStorage.setItem("KEYWORDID","");
					}else{
						localStorage.setItem("KEYWORDID",$(this).attr('data-sectionId'));
						localStorage.setItem("HOTELID","");
					}
					localStorage.setItem("KEYWORDNAV",$(".curSelected").index());
					localStorage.setItem("KEYWORDLIST",$("#keyWordList li.selectedWord").index());
					localStorage.setItem("KEYWORD",$(this).html());
					var oDate=new Date();
					if(getUrlParam("source")=="searchList"){
						window.location.href=ctx+"/hotel/wx/v1/hotel/queryHotelList?openid="+openid+"&now="+oDate.getTime();
					}else{
						window.location.href=ctx+"/hotel/wx/v1/company/welcome?openid="+openid+"&now="+oDate.getTime();
					}
				}
			});
			//点击地铁站
			$(".metroLineList").delegate("li",CLICK,function(){
				$("#metroLineList li").removeClass("selectedWord");
				$(this).addClass("selectedWord");
				localStorage.setItem("KEYWORDNAV",$(".curSelected").index());
				localStorage.setItem("KEYWORDLIST",$("#keyWordList li.selectedWord").index());
				localStorage.setItem("METROLINELIST",$(this).index());
				localStorage.setItem("KEYWORD",$(this).html());
				localStorage.setItem("KEYWORDID",$(this).attr('data-sectionId'));
				localStorage.setItem("HOTELID","");
				var oDate=new Date();
				if(getUrlParam("source")=="searchList"){
					window.location.href=ctx+"/hotel/wx/v1/hotel/queryHotelList?openid="+openid+"&now="+oDate.getTime();
				}else{
					window.location.href=ctx+"/hotel/wx/v1/company/welcome?openid="+openid+"&now="+oDate.getTime();
				}
			})
			/*搜索框输入*/
			$("#keywordSearchInp").on("keyup change",function(){
				var timer=null
				if(timer){
        			clearTimeout(timer);
        		}
				timer=setTimeout(function(){
					var data={};
					data.keyword=$("#keywordSearchInp").val().replace(/\s+/g, "");
					data.cityid=cityid;
		        	if($("#keywordSearchInp").val()!=""){
		        		$("#keywordSearchInp").parent(".keyWordInp").removeClass("hasValueInp");
		        		$("#cancleSearch").show();
		        		$(".selectKeyWord").hide();
		        		$(".keywordResult").show();
			        	$.ajax({
			        		data:data,
		        			url:ctx+'/hotel/api/v2/keyword/getHotAutoallTip',
		        			type:"GET",
		        			dataType: "json",
		        			success:function(result){
								if(result.code ==1) {
									var backValue=result.data;
									$(".cityEmpty").hide();
									$(".searchedCityList").show();
									$(".searchedCityList").empty();
									if(result.code==1&&backValue.length!=0){
										for(var j=0;j<backValue.length;j++){
											var searchedType="";
											var typeNum=backValue[j]['type_num'];
											switch(typeNum){
												case 0:
													searchedType="城市";
													break;
												case 99:
													searchedType="酒店";
													break;
												default:
													for(var k=0;k<$(".keyWordNav li").length;k++){
														if(typeNum==parseInt($(".keyWordNav li").eq(k).attr('data-type'))){
															searchedType=$(".keyWordNav li").eq(k).html();
														}
													}
													break;
											}
											if(backValue[j]['type']=="section"){
												$(".searchedCityList").append('<li><p class="searchedName" data-sectionId="'+backValue[j]['id']+'" data-data-hotelId="">'
													+backValue[j]['name']
													+'</p><span class="searchedType">'+searchedType+'</span></li>');
											}else{
												$(".searchedCityList").append('<li><p class="searchedName" data-sectionId="" data-hotelId="'+backValue[j]['id']+'">'
													+backValue[j]['name']
													+'</p><span class="searchedType">'+searchedType+'</span></li>');
											}
										}
									}else{
										$(".searchedCityList").hide();
										$(".cityEmpty").show();
									}
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
	        	localStorage.setItem("KEYWORD",$(this).children(".searchedName").html());
				localStorage.setItem("KEYWORDID",$(this).children(".searchedName").attr('data-sectionId'));
				localStorage.setItem("HOTELID",$(this).children(".searchedName").attr('data-hotelId'));
	        	var oDate=new Date();
				if(getUrlParam("source")=="searchList"){
					window.location.href=ctx+"/hotel/wx/v1/hotel/queryHotelList?openid="+openid+"&now="+oDate.getTime();
				}else{
					window.location.href=ctx+"/hotel/wx/v1/company/welcome?openid="+openid+"&now="+oDate.getTime();
				}
	        });
	        $("#cancleSearch").on(CLICK,function(){
	        	localStorage.setItem("KEYWORD",$("#keywordSearchInp").val());
	        	var oDate=new Date();
				if(getUrlParam("source")=="searchList"){
					window.location.href=ctx+"/hotel/wx/v1/hotel/queryHotelList?openid="+openid+"&now="+oDate.getTime();
				}else{
					window.location.href=ctx+"/hotel/wx/v1/company/welcome?openid="+openid+"&now="+oDate.getTime();
				}
	        });
	        function getlist(cityid,type,index){  //获取列表
	        	var data={};
	        	data.cityid=cityid;
	        	data.type=type;
				data.parent_id="";
	        	$.ajax({
	        		data:data,
	        		url:ctx+'/hotel/api/v2/keyword/getKeywordType',
	        		type:"GET",
	        		dataType: "json",
	        		success:function(result){
	        			var backvalue=result.data;
	        			if(backvalue.length!=0){
	        				$("#keyWordList").empty();
	        				var len=backvalue.length;
	        				for(var i=0;i<len;i++){
	        					if(index==4){ //地铁线
	        						$("#keyWordList").append("<li class='metroLine' data-parentId='"+backvalue[i]['id']+"'>"+backvalue[i]['name']+"</li>");
	        					}else if(index==7){//品牌酒店
	        						$("#keyWordList").append("<li class='hotelList' data-hotelId='"+backvalue[i]['id']+"'>"+backvalue[i]['name']+"</li>");
	        					}else{
									$("#keyWordList").append("<li data-sectionId='"+backvalue[i]['id']+"'>"+backvalue[i]['name']+"</li>");
	        					}
	        				}
	        				if(keyWordList&&(keyWordNav==$(".keyWordNav li.curSelected").index())){
	        					$(".keyWordList li").eq(keyWordList).addClass("selectedWord");
	        				}
	        			}else{
	        				$("#keyWordList").empty();
	        				$("#keyWordList").html("无记录");
	        			}
	        		}
	        	});
	        }
		}
	};
}());
