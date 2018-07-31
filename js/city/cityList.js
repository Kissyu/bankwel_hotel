$(function(){
	City.init();
});
var City = (function(){
	
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
			
		},
		bindUI: function(){
			var openid=$("input[name='openid']").val();
			//初始化历史选择城市列表
			var historylist=eval("("+localStorage.getItem('history')+")");
			if(historylist){
				for(var i=0;i<(historylist.length>=3?3:historylist.length);i++){
					var historyitem=historylist[i];
					$("#pastchoice").append("<li data-cityid="+historyitem['cityid']+">"+historyitem['cityname']+"</li>");
				}
			}
			//初始化热门城市列表
			$.ajax({
    			url:ctx+'/city/getHotCitys',
    			type:"POST",
    			dataType: "json",
    			success:function(result){
    				var hotcitys=eval("("+result+")")["hotCityList"];
    				for(var i=0;i<hotcitys.length;i++){
    					$("#hotcity").append('<li data-cityid="'+hotcitys[i]["cId"]+'">'+hotcitys[i]["cName"]+"</li>");
    				}
    			}
			});
			//初始化城市字母列表
			for(var i=65;i<=90;i++){
	        	if(i!=73&&i!=79&&i!=85&&i!=86){
	        		var _this=String.fromCharCode(i);
	        		$(".letterlist").append('<li id="'+_this+'"><span class="city-btn">'+_this+'</span></li>');
	        	}
	        }
			/*for(var i=65;i<=90;i++){
				var _this=String.fromCharCode(i);
				var oDate=new Date();
				$.ajax({
        			data:{"keywords":_this},
        			url:ctx+'/city/getAllCitys',
        			type:"POST",
        			dataType: "json",
        			async:false,
        			cache :false,
        			success:function(result){
        				if(result.length!=0){
        					$(".letterlist").append('<li id="'+_this+'"><span class="city-btn">'+_this+'</span></li>');
        				}
        			}
        		});
			}*/
	        //点击字母栏
	        $(".city-btn").live(CLICK,function(){
	        	if($(this).parents("li").hasClass("thisletter_open")){
	        		$(this).parents("li").removeClass("thisletter_open");
	        	}else{
	        		if($(this).parents("li").find(".thelettercity").length==0){
		        		$(this).after("<ul class='thelettercity'></ul>");
		        		var thisletter=$(this).html();
		        		$.ajax({
		        			data:{"keywords":thisletter},
		        			url:ctx+'/city/getAllCitys',
		        			type:"POST",
		        			dataType: "json",
		        			success:function(result){
		        				for(var i=0;i<result.length;i++){
		        		        	$("#"+thisletter+" .thelettercity").append('<li data-cityid="'+result[i]["id"]+'">'+result[i]["name"]+'</li>');
		        		        }
		        			}
		        		});
		        	}
	        		$(".letterlist>li").removeClass("thisletter_open");
	        		$(this).parents("li").addClass("thisletter_open");
	        	}
	        });
	        //我的位置
	        $("#myGis").on(CLICK,function(){
	        	getlocation(function(json){
	        		if(json.status==0){
						localStorage.setItem("currentPosition",json.result.formatted_address);
						var oDate=new Date();
						window.location.href=ctx+"/?openid="+openid+"&now="+oDate.getTime();
					}
	        	});
	        });
	      //历史选择
	        $("#pastchoice").delegate("li",CLICK,selectcity);
	       //热门城市
	        $("#hotcity").delegate("li",CLICK,selectcity);
	      //城市字母列表
	        $(".thelettercity li").live(CLICK,selectcity);
	        function selectcity(){
	        	var position={};
	        	position.posname=$(this).html();
	        	position.posid=$(this).attr("data-cityid");
	        	localStorage.setItem("currentPosition",JSON.stringify(position));
				for(var i=0;i<$("#pastchoice li").length;i++){
			    	if($("#pastchoice li").eq(i).html()==$(this).html()){
						$("#pastchoice li").eq(i).remove();
						i--;
					}
				}
				if($("#pastchoice li").length==0){
					$("#pastchoice").append("<li data-cityid="+$(this).attr("data-cityid")+">"+$(this).html()+"</li>");
				}else{
					$("#pastchoice li").first().before("<li data-cityid="+$(this).attr("data-cityid")+">"+$(this).html()+"</li>");
				}
				for(var i=0;i<$("#pastchoice li").length;i++){
					if(i>=3){
						$("#pastchoice li").eq(i).remove();
					}
				}
				var history = [];
				var json={};
				for(var i=0;i<$("#pastchoice li").length;i++){
					json={};
					json.cityname=$("#pastchoice li").eq(i).html();
					json.cityid=$("#pastchoice li").eq(i).attr("data-cityid");
					history.push(json);
				}
				localStorage.setItem("history",JSON.stringify(history));
				var oDate=new Date();
				window.location.href=ctx+"/?openid="+openid+"&now="+oDate.getTime();
			}
	        /*点击搜索输入框*/
	        $("#citySearch").on(CLICK,function(){
	        	$(".manualSelect").hide();
	        	$(".inputSearchLayer").show();
	        	$("#citySearchInp").focus();
	        });
	        $("#cancleSearch").on(CLICK,function(){
	        	$(".manualSelect").show();
	        	$(".inputSearchLayer").hide();
	        });
	        $("#citySearchInp").on("keyup",function(){
	        	var timer=null;
	        	if(timer){
        			clearTimeout(timer);
        		}
	        	timer=setTimeout(function(){
	        		var data={};
	        		data.keywords=$("#citySearchInp").val();
	        		if($("#citySearchInp").val()!=""){
		        		$.ajax({
			        		data:data,
		        			url:ctx+'/city/getAllCitys',
		        			type:"POST",
		        			dataType: "json",
		        			success:function(result){
		        				if(result.length!=0){
		        					$(".cityEmpty").hide();
		        					$(".searchedCityList").show();
		        					$(".searchedCityList").empty();
			        				for(var i=0;i<result.length;i++){
			        					var cityDetail = "";
			        					if(result[i]["areaNameDetail"]=="#"){
			        						cityDetail=result[i]["name"];
			        					}else{
				        					var cityname=result[i]["areaNameDetail"].split("#");
				        					cityDetail=cityname[1]+" , "+cityname[0];
			        					}
			        		        	$(".searchedCityList").append('<li class="clearfix" data-cityid="'
			        		        			+result[i]["id"]
			        		        			+'" data-city="'+result[i]["name"]
			        		        			+'"><p class="searchedName">'
			        		        			+cityDetail
			        		        			+'</p><span class="searchedType">城市</span></li>');
			        		        }
		        				}else{
		        					$(".searchedCityList").hide();
		        					$(".cityEmpty").show();
		        				}
		        			}
			        	});
		        	 }else{
		        		 $(".cityEmpty").hide();
	 					 $(".searchedCityList").hide();
		        	 }
	        	},350);
	        });
	        $(".searchedCityList").delegate("li",CLICK,function(){
	        	var position={};
	        	position.posname=$(this).attr("data-city");
	        	position.posid=$(this).attr("data-cityid");
	        	localStorage.setItem("currentPosition",JSON.stringify(position));
	        	var oDate=new Date();
				window.location.href=ctx+"/?openid="+openid+"&now="+oDate.getTime();
	        });
		}
	};
}());