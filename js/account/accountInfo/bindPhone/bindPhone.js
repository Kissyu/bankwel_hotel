$(function(){
	bindPhone.init();
});
var bindPhone = (function(){
	
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
			me.changeJcaptchas();
		},
		//验证码图片的改变
		changeJcaptchas: function(){
			var openid = $("input[name='openid']").val();
			$('#jcaptchaPic').attr('src', ctx + '/jcaptcha/modiBindPhone?openid='+openid);
		},
		bindUI: function() {
			/*判断获取的是新手机验证码还是旧手机验证码*/
			var newOrold=false;
			/*点击验证码*/
			$(".veriCode").on(CLICK,function(){
				me.changeJcaptchas();
			});
			$(".getbox input").on("focus",function(){
				$(this).siblings(".verify-error").hide();
			});
			/*点击获取手机验证码，显示图片验证码弹窗*/
			$(".getCode").on(CLICK,function() {
				me.changeJcaptchas();
				if($('#phoneNum').val()===''){
					$.toast("手机号不能为空，请填写完整！");
				}else if(!validate("#phoneNum",'PHONE')){
					$.toast("手机号格式错误，请重新输入！");
				}else {
					$("#authcode").val("");
					$("#js_mask").show();
					$("#authcode_layer").show();
				}
			});
			/*验证码层点击确定*/
			$("#vertify_letter").on(CLICK,function() {
				if($("#authcode").val() === "") {
					$.toast("验证码不能为空,请输入完整！");
				}else{
					$.ajax({
						type: "post",
						data: {"jcaptchaCode":$("#authcode").val()},
						url:ctx+'/account/checkJcaptcha',
						dataType: "json",
						success: function(result,state) {
							var code = result.code;
							if(code==0){
								$("#js_mask").hide();
								$("#authcode_layer").hide();
								var _this=$("#getCode");
								var data = {
									openid:$("#openid").val(),
									mobile:$("#phoneNum").val(),
									type:'oldMobileCheck',
									sign:"newMobile"
								};
								$.ajax({
									type: "post",
									data: data,
									url:ctx+'/account/sendMessage',
									dataType: "json",
									success: function(result,state) {
										var code = result.code;
										if(code==-101){
											$.toast("两次短信发送的间隔为一分钟！");
										}else if(code==-8){
											$.toast(result.message);
										}else{
											_this.hide().siblings("input").addClass("countdown");
											_this.siblings(".toGray").show();
											var showTime=_this.siblings(".toGray").children("var");
											var restTime = 59;
											showTime.html(restTime);
											clearInterval(_this.timer);
											_this.timer = setInterval(function(){
												restTime--;
												showTime.html(restTime);
												if(restTime<=0){
													clearInterval(_this.timer);
													_this.show();
													_this.siblings("input").removeClass("countdown");
													_this.siblings(".toGray").hide();
												}
											},1000);
										}
									}
								});
							}else {
								$.toast("验证码错误，请重新输入！");
							}
						}
					});
				}
			});
			/*关闭验证*/
			$(".close_mask").on(CLICK,function() {
				$("#js_mask").hide();
				$("#authcode_layer").hide();
			});
			/*点击立即绑定*/
			$("#bindNow").on(CLICK,function(){
				$(".getCode").show();
				$(".getCode").siblings("input").removeClass("countdown");
				$(".toGray").hide();
				if($("#phoneNum").val()==""||$("#messageCode").val()==""){
					$.toast("信息填写不完整，请输入完整！");
				}else if(!validate("#phoneNum",'PHONE')){
					$.toast("请输入有效的手机号！");
				}else{
					var dataNew={
						openid:$("#openid").val(),
						mobile:$("#phoneNum").val(),
						mobileCode:$("#messageCode").val(),
						bindPhoneToken:$("#bindPhoneToken").val(),
					};
					$.ajax({
						type: "post",
						data: dataNew,
						url: ctx+'/account/checkMobileCodeOnce',
						dataType: "json",
						success: function(result,state) {
							var openid = result.data;
							var code = result.code;
							switch(code){
								case 0:
									window.location.href = ctx+'/account/modiBindPhoneSuc?openid='+openid;
									break;
								case -2:
									$("#messageCode").siblings(".verify-error").show();
									break;
								default:
									$.alert(result.message);
									break;
							}
						}
					});
				}
			});
		}
	};
}());