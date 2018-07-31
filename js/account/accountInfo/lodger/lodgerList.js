$(function(){
	LodgerList.init();
});
var LodgerList = (function(){
	
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
			/*点击删除并跳转到住户列表界面*/
			$(".deletelodger").on(CLICK,function(){
				var data={
						}
			    var openid=$("input[name='openid']").val();
				var id = $(this).next().val();
				data.openid = openid;
				data.id = id;
				$.ajax({
					type: "post",
					url:ctx+"/account/deleteLodger",
					data: data,
					dataType: "json",
					success: function(result,state) {
						window.location.href = ctx+'/account/lodgerList?openid='+openid;
					}
				});
			});
		}
	};
}());