$(function(){
	modiBind.init();
});
var modiBind = (function(){
	
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
			/*修改信息首页的手机星号*/
			var phonefour = $('#oldPhoneNum').val();
			if(phonefour){
				$('#oldPhoneNum').val(phonefour.substring(0,3)+'****'+phonefour.substring(7,11));
			}
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
			/*旧手机号获取后不能更改*/
			if($("#oldPhoneNum").val()!=='') {
				$("#oldPhoneNum").attr('readonly','readonly');
			}
			$(".getbox input").on("focus",function(){
				$(this).siblings(".verify-error").hide();
			});
			/*点击获取手机验证码，显示图片验证码弹窗*/
			$(".getCode").on(CLICK,function() {
				me.changeJcaptchas();
				if($(this).attr("id")==='getOldCode'){
					newOrold=false;
					$("#authcode").val("");
					$("#js_mask").show();
					$("#authcode_layer").show();
					
				}else{//新手机号页面
					newOrold=true;
					if($("#newPhoneNum").val()===''){
						$.toast("新手机号不能为空，请填写完整！");
					}else if($('#newPhoneNum').val()==$("#oldPhoneNum").attr("data-value")) {
						$.toast("新手机号和原手机号不能相同!");
					}else if(!validate("#newPhoneNum",'PHONE')){
						$.toast("请输入有效的新手机号！");
					}else {
						$("#authcode").val("");
						$("#js_mask").show();
						$("#authcode_layer").show();
					}
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
								var _this=null;
								var mobile=null;
								var sign=null;
								if(!newOrold){
									_this=$("#getOldCode");
									mobile = $("#oldPhoneNum").attr("data-value");
									sign = "oldMobile";
								}else{
									_this=$("#getNewCode");
									mobile = $("#newPhoneNum").val();
									sign = "newMobile";
								}
								var data = {
									openid:$("#openid").val(),
									type:'oldMobileCheck',
									mobile:mobile,
									sign:sign
								};
								$.ajax({
									type: "post",
									data: data,
									url:ctx+'/account/sendMessage',
									dataType: "json",
									success: function(result,state) {
										var code = result.code;
										if(code==-3){
											$.toast("新手机号和原手机号相同！");
										}else if(code==-101){
											$.toast("两次短信发送的间隔为一分钟！");
										}else if(code==-8){
											$.toast("此手机号已被绑定！");
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
			/*点击提交*/
			$("#sureChange").on(CLICK,function(){
				$(".getCode").show();
				$(".getCode").siblings("input").removeClass("countdown");
				$(".toGray").hide();
				if($("#oldPhoneNum").val()==""||$("#newPhoneNum").val()===""||$("#oldMessageCode").val()==""||$("#newMessageCode").val()===""){
					$.toast("信息填写不完整，请输入完整！");
				}else if(!validate("#newPhoneNum",'PHONE')){
					$.toast("请输入有效的新手机号！");
				}else{
					var dataNew={
						openid:$("#openid").val(),
						newMobile:$("#newPhoneNum").val(),
						newMobileCode:$("#newMessageCode").val(),
						oldMobileCode:$("#oldMessageCode").val(),
						modiBindPhoneToken:$("#modiBindPhoneToken").val(),
					};
					$.ajax({
						type: "post",
						data: dataNew,
						url: ctx+'/account/checkMobileCode',
						dataType: "json",
						success: function(result,state) {
							var openid = result.data;
							var code = result.code;
							switch(code){
								case 0:
									window.location.href = ctx+'/account/modiBindPhoneSuc?openid='+openid;
									break;
								case -2:
									$("#oldMessageCode").siblings(".verify-error").show();
									break;
								case -7:
									$("#newMessageCode").siblings(".verify-error").show();
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