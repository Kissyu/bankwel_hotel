$(function() {
    $Reg.init();
});
var register = $Reg = function() {

    var me = null,p_caption = 1;
   
    return {
        /**
         * 页面初始化
         */
        init: function() {
            this.initVars();
            this.renderUI();
            this.bindUI();
        },
        /**
         * 变量初始化
         */
        initVars: function() {
            me = this;
        },
        /**
         * 渲染页面控件
         */
        renderUI: function() {
            /**
             * 添加或修改数据
             */
        	$("#p_nickname").inputValidate("");
        	$("#p_pass").inputValidate("");
        },
        bindUI: function() {
        	//切换验证码
            $('#jcaptchaPic').on(CLICK,function() {
                me.changeCaptcha();
            });
            // 密码验证
            $("#p_pass").on('blur', function(event) { // blur时候显示强度
                var tempStr = $(this).val().replace(/^\s*|\s*$/g, "");
                var $passStrong = $(this).parents(".passItem").find('.pass-str');
                if (tempStr !== "") { // 输入值
                    if (!/[\u4e00-\u9fa5]/.test(tempStr)) {
                        if (tempStr.length >= 4 && tempStr.length <= 16) { //输入合法判断其强度
                            var kinds = getStrength(tempStr);
                            $passStrong.show(); //显示密码强度
                            if (kinds == 4) {
                                if (tempStr.length >= 8) { //显示强
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(2).addClass('power');
                                } else { //显示中
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(1).addClass('middle');
                                }
                            } else if (kinds == 3) {
                                if (tempStr.length >= 12) { //显示强
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(2).addClass('power');
                                } else { //显示中
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(1).addClass('middle');
                                }
                            } else if (kinds == 2) {
                                if (tempStr.length >= 8) { //显示中
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(1).addClass('middle');
                                } else { //显示弱
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(0).addClass('weak');
                                }
                            } else { //显示弱
                                $passStrong.find("span").removeClass();
                                $passStrong.find("span").eq(0).addClass('weak');
                            };
                        }else{
                        	$passStrong.hide();
                        }
                    }else{
                    	$passStrong.hide();
                    }
                }else{
                	$passStrong.hide();
                }
            });  
            // 点击获取短信验证码
            $("#getCode").on(CLICK,function(){
            	if($('#phone').val()===""){
            		$.toast("请输入手机号！");
            	}else if(!validate("#phone",'PHONE')){
            		$.toast("请输入正确的手机号！");
            	}else{
	            	$.ajax({
	            		url:ctx + '/logon/register/getSmsVerifyCode',
	            		type:'post',
	            		data:{mobile:$('#phone').val()},
	            		success:function(result){
	            			if(result.code==0){
		            			_this=$("#getCode");
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
            	}
            });
            // 点击注册按钮
            $("#register").on(CLICK,function() {
            	$(".getCode").show();
				$(".getCode").siblings("input").removeClass("countdown");
				$(".toGray").hide();
            	if($("#p_nickname").val()===""){
            		$.toast("请输入账户名！");
            	}else if(!(validate("#p_nickname",'PHONE')||me.checkNickName())){
            		$.toast("请输入符合规范的账户名！");
            	}else if($('#phone').val()===""){
            		$.toast("请输入手机号！");
            	}else if(!validate("#phone",'PHONE')){
            		$.toast("请输入正确的手机号！");
            	}else if($("#p_pass").val()===""){
            		$.toast("请输入密码！");
            	}else if(!me.checkPass()){
            		$.toast("请输入包含4-16位字符的密码！");
            	}else if($("#p_confirm_pass").val()===""){
            		$.toast("请再次输入密码！");
            	}else if($("#p_confirm_pass").val()!=$("#p_pass").val()){
            		$.toast("两次输入的密码不一致！");
            	}else if($("#jcaptchaCode").val()==""){
            		$.toast("请输入图片验证码");
            	}else if($("#smsVerifycode").val()==""){
            		$.toast("请输入短信验证码！");
            	}else if(!$(".agreedeal").hasClass("oncheck")){
            		$.toast("请同意嘀嘀客栈注册及服务协议！");
            	}else{
	            	var data = $('#regForm').serialize();
	            	$.ajax({
	            		url:ctx + '/logon/register/submitInfo',
	            		type:'post',
	            		data:data,
	            		dataType: 'json',
	            		success:function(result){
	            			if(result.code == 0){
	            				$.alert("注册成功！",function(){
	            					window.location.href = ctx + result.data;
	            				});
	            			}else{
	            				$.alert("注册失败：" +result.message);
	            				me.changeCaptcha();
	            				return;
	            			}
	            		}
	            	});
            	}
            });
        },
        changeCaptcha: function() {
            $('#jcaptchaPic').attr('src', ctx + '/jcaptcha/logon?t=' + new Date().getTime());
        },
        checkNickName:function(){
        	var chart = $("#p_nickname").val().replace(/^\s*|\s*$/g, "");
            	// 先验证用户名是否符合规则
            if (/^([\u4e00-\u9fa5]|[0-9a-zA-z]|\_)*$/g.test(chart)) { // 合法字符
                var arr = (chart.match(/[\u4e00-\u9fa5]/g)) || [];//汉字长度
                var num = (chart.length + arr.length);
                if (4 <= num && num <= 18) { // 验证用户名长度已合法
                	if(!(/^[^\_0-9]/.test(chart))){
                		return false;
                	}else{
                		return true;
                	}                       
                } else { // 长度不合法
                	return false;
                }
            } else { // 特殊字符
            	return false;
            }
        },
        checkPass:function(){
        	var tempStr =  $("#p_pass").val().replace(/^\s*|\s*$/g, "");
        	if (!/[\u4e00-\u9fa5]/.test(tempStr)) {
        		if (tempStr.length >= 4 && tempStr.length <= 16) {
        			return true;
        		}else{
        			return false;
        		}
        	}else{
        		return false;
        	}
        }
    };
}();