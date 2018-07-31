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
			var chineseName = /^([\u4E00-\u9FA5]{2,5}(?:\·[\u4E00-\u9FA5]{2,5})*)$/;
			var englishName = /^[a-zA-Z](\w+\s?){1,20}$/;
			/*点击保存并跳转到信息列表界面*/
			$("#completeFill").on(CLICK,function(){
				if($("#lodgerName").val()==""){
					$.toast("请输入中文名！");
				}else if(!chineseName.test($("#lodgerName").val())){
					$.toast("请输入正确的中文名！");
				}else if($("#lastName").val()!=""&&(!englishName.test($("#lastName").val()))){
					$.toast("请输入正确的英文姓！");
				}else if($("#firstName").val()!=""&&(!englishName.test($("#firstName").val()))){
					$.toast("请输入正确的英文名！");
				}else if($("#idCard").val()!=""&&(identifyCard($("#idCard").val())!=1)){
					$.toast("请输入正确的身份证号！");
				}else{
					var data={
							lodgerName:$("#lodgerName").val(),
							lastName:$("#lastName").val(),
							firstName:$("#firstName").val(),
							idCard:$("#idCard").val(),
							id:$("#loger_id").val(),
							openid:$("input[name='openid']").val(),
							addLodgerToken:$("#addLodgerToken").val()
							};
					var url=ctx+"/account/addOrUpdateLodger";
					$.ajax({
						type: "post",
						url:url,
						data: data,
						dataType: "json",
						success: function(result,state) {
							if(result.code==0){
								var openid = result.data;
								window.location.href = ctx+'/account/lodgerList?openid='+openid;
							}else{
								$.alert(result.message);
							}
						}
					});
				}
				
			})
		}
	};
}());