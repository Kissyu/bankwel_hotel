$(function(){
	Order.init();
});
var Order = (function(){
	
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
			// 加载flag
			var loading = false;
		    var nomore=false;
		    var pageNum=2;
			var curState=$(".selectedType").index();
			var openid=$("input[name='openid']").val();
			addItems(curState,1);
			/*选择显示不同状态的订单列表*/
			$(".orderType li").on(CLICK,function(){
				$(".orderType li").removeClass("selectedType");
				$(this).addClass("selectedType");
				curState=$(this).index();
				addItems(curState,1);
				pageNum=2;
				nomore=false;
				loading = false;
				$('.infinite-scroll-preloader').show();
                $(".nomoredata").hide();
			});
			function addItems(curState,pageNum) {
		    	var data={};
				data.openid=openid;
				data.state=curState;
				data.pageNum=pageNum;
				$.ajax({
					type: "post",
					url: ctx + "/hotelOrder/getProgressingOrOldOrderList",
					data: data,
					dataType: "html",
					success: function(result,state) {
						var itemNum=result.match(/myorderItem/g)||[];
						if(pageNum==1){
							$("#order_result").empty().html(result);
							if(itemNum.length==0){
								$(".nomoredata").html("没有相关订单");
							}else{
								$(".nomoredata").html("没有更多数据了");
							}
						}else{
							$("#order_result").append(result);
						}
						if(itemNum.length<10){
							nomore=true;
			                  // 删除加载提示符
			                  $('.infinite-scroll-preloader').hide();
			                  $(".nomoredata").show();
			                  return;
						}
					}
				});     
		     }
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
			                  return;
			              }
			              addItems(curState,pageNum);
				    	  pageNum++;
			          }, 1000);
			    	  
			  	  }
		      };
		}
	};
}());