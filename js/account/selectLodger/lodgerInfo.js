$(function(){
	Lodger.init();
});
var Lodger = (function(){
	
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
			/*点击保存并跳转到信息列表界面*/
			$("#completeFill").on(CLICK,function(){
				var data={
						lodgerName:$("#lodgerName").val(),
						lastName:$("#lastName").val(),
						firstName:$("#firstName").val(),
						idCard:$("#idCard").val(),
						addLodgerToken:$("#addLodgerToken").val()
						}
			    var openid=$("input[name='openid']").val();
				data.openid = openid;
				
				var url = ctx + '/account/addOrUpdateLodger'
				$.ajax({
					type: "post",
					url:url,
					data: data,
					dataType: "json",
					success: function(result,state) {
						if(result.code==0){
							window.location.href = ctx+'/account/selectLodger?openid='+openid;
						}else{
							alert(result.message);
						}
					}
				});
			})
		}
	};
}());