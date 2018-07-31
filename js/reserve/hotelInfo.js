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
			
		},
		bindUI: function(){
			$(".subbtn").live(CLICK,function(){
				if(Number($(this).next(".roomnum").html())<=0)
					return;
				else{
					$(this).next(".roomnum").html(Number($(this).next(".roomnum").html())-1);
				}
			});
			$(".addbtn").live(CLICK,function(){
				$(this).prev(".roomnum").html(Number($(this).prev(".roomnum").html())+1);				
			});
			$(".reservebtn a").on(CLICK,function(){
				var num=0;
				for(var i=0;i<$(".roomnum").length;i++){
					num+=parseInt($(".roomnum").eq(i).html());
				}
				if(num==0){
					$.toast("请您确定房型");
				}else if(!$(this).hasClass("clicked")){
					$(this).addClass("clicked");
					var data ={};
					data.openid = $("input[name='openid']").val();
					data.rid = $("input[name='recomondHotel']").val();
					var str=null;
					var arr=[];
					for(var i=0;i<$(".roomtable tr").length;i++){
						arr[i]=$(".hotelcost").eq(i).attr("data-house-id")+":"+$(".roomnum").eq(i).html();
					}
					str=arr.join(",");
					data.house=str;
					$.ajax({
						type: "post",
						url:ctx+'/hotel/bookHotelInfo',
						data: data,
						dataType: "json",
						success: function(result,state) {
							console.info(result);
							if(result.code == 0){
								window.location.href=ctx+'/hotel/fillOrder?openid='+result.data.openid;
								$(".reservebtn a").removeClass("clicked");
							}else{
								$.alert(result.message,function(){WeixinJSBridge.invoke('closeWindow')});
							}
						}
					});
				}
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
		}
	};
}());