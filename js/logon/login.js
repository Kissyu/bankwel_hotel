$(function() {
    $Log.init();
});
var login = $Log = function() {

    var me = null;
   
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
        renderUI: function() {},
        /**
         * 添加或修改数据
         */
        bindUI: function() {
            $('#jcaptchaPic').on(CLICK,function() {
                me.changeCaptcha();
            });
            // 点击登陆按钮
            $("#login").on(CLICK,function() {
             	 var loginName = $('#js-login-name');
             	 var loginPass = $('#js-login-pass');
             	 var jcaptchaCode = $('#jcaptchaCode');
             	 var postFlag = false;
                var _self = this;
                if (loginName.val() === "" ) {
                	$.toast("请输入账户名");
                }else if(loginPass.val() === "") {
                	$.toast("请输入密码");
                }else if($("#jcaptchaCode").val()==""){
            		$.toast("请输入图片验证码");
            	}else if(!(validate("#js-login-name",'PHONE')||me.checkNickName())){
                	$.toast("请输入符合规范的账户名");
                }else if(!validate("#js-login-pass",'',4,16)){
                	$.toast("请输入包含4-16位字符的密码");
                }else
                {
                    var data = {
                        userName: loginName.val(),
                        password: loginPass.val(),
                        jcaptchaCode:jcaptchaCode.val()
                    };
                    if (postFlag) {
                        return false;
                    } else {
                        postFlag = true;
                        $.ajax({
                        	url:ctx + '/logon/login',
                        	type:'POST',
                        	dataType:'json',
                        	data:data,
                        	success:function(result){
                                if (result.code == -1) { //服务器错误
                                   $.alert(result.message || '服务器忙，请稍后再试！');
                                    postFlag = false;
                                    return;
                                } else if (result.code == -2) { //重试超3次,需验证码登录
                                	$.alert(result.message || '用户名或密码错误');
                                    me.changeCaptcha();
                                    postFlag = false;
                                    return;
                                } else if (result.code == -4) { //验证码错误
                                	$.alert(result.message || '验证码错误');
                                    me.changeCaptcha();
                                    postFlag = false;
                                    return;
                                }
                                var nextpage =  ctx + result.data;
                        		if (/\?/.test(result.message)) {
                                  window.location.href = nextpage + "&t=" + new Date().getTime();
                        		} else {
                                  window.location.href = nextpage + "?t=" + new Date().getTime();
                        		}
                        	}
                        });
                    };
                } 
            });
        },
        changeCaptcha: function() {
            $('#jcaptchaPic').attr('src', ctx + '/jcaptcha/logon?t=' + new Date().getTime());
        },
        checkNickName:function(){
        	var chart = $("#js-login-name").val().replace(/^\s*|\s*$/g, "");
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
        }
    };
}();
