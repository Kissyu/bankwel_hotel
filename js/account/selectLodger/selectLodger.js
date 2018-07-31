$(function(){
	Invoice.init();
});
var Invoice = (function(){
	
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
			/*初始化已选择入住人*/
			var check=JSON.parse(sessionStorage.getItem('checked'));
			if(check){
				for(var i=0;i<check.length;i++){
					if($(".fnradio .modiname").eq(check[i]['index']).html()==check[i]['name']){
						$(".fnradio").eq(check[i]['index']).addClass("oncheck");
					}
				}
			}
			/*选择入住人*/
			$(".fnradio").live(CLICK,function(){
				var num = sessionStorage.getItem('loggerNum');
				if(num){
					if($(this).hasClass("oncheck")){
						$(this).removeClass("oncheck");
					}else{
						if($(".fnradio.oncheck").length>=parseInt(num)){
							$.toast("每间房只需填写1人");
						}else{
							$(this).addClass("oncheck");
						}
					}
				}
			});
			/*点击完成*/
			$("#completeFill").on(CLICK,function(){
				var checked=[];
				var checkjson={};
				for(var i=0;i<$(".fnradio.oncheck").length;i++){
					checkjson={};
					checkjson.name=$(".fnradio.oncheck .modiname").eq(i).html();
					checkjson.index=$(".fnradio.oncheck").eq(i).index();
					checked.push(checkjson);
				}
				sessionStorage.setItem('checked',JSON.stringify(checked));
				window.location.href=ctx+'/hotel/fillOrder?openid='+openid;
			});
		}
	};
}());