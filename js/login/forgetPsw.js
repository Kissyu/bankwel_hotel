/**
 * Created by bankwel on 2016/8/30.
 */
$(function(){
    forgetPsw.init();
});
var forgetPsw = (function(){
    var me = null;
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
        bindUI: function() {
            $('.lastStep').on(CLICK,function() {
               window.location.href = ctx+'/hotel/wx/v1/company/loginPage?openid='+$("#open_id").val();
            });
            /*点击获取手机验证码，显示图片验证码弹窗*/
            $(".get-check-num .getVertify").on(CLICK,function() {
                if($('.mobile-num').val() == '') {
                    $.toast('请输入您的手机号');
                }else {
                    var _this = $(this);
                    $.ajax({
                        type: "get",
                        data: {
                            mobile: $('.mobile-num').val(),
                            type: 'forgetPass'
                        },
                        url: ctx+'/hotel/api/v1/sms/sendSmscode',
                        dataType: "json",
                        success: function(result,state) {
                            var code = result.code;
                            var checkTxt = '秒后重新获取';
                            if(code ==1) {  //成功
                                _this.addClass('toGray');
                                var restTime = 89;
                                _this.html(restTime+checkTxt);
                                clearInterval(_this.timer);
                                _this.timer = setInterval(function(){
                                    restTime--;
                                    _this.html(restTime+checkTxt);
                                    if(restTime<=0){
                                        clearInterval(_this.timer);
                                        _this.removeClass('toGray').html('获取验证码');
                                    }
                                },1000);
                            }else {
                                $.toast(result.msg);
                            }
                        }
                    });
                }
            });
            function checkPass(){
                var tempStr =  $("#new-psw").val().replace(/^\s*|\s*$/g, "");
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
            /*点击立即提交*/
            $(".forgetPsw-submit").on(CLICK,function(){
                /*$(".get-check-num .getVertify").removeClass('toGray').html('获取验证码');*/
                if($("#check-num").val()==""||$("#new-psw").val()==""||$("#recheck-new-psw").val()==""||$("mobile-num").val()==""){
                    $.toast('信息填写不完整，请填写完整');
                }else if(!checkPass()){
                    $.toast('密码为4-16字符，建议使用字母数字和符号组合');
                }else if($('#new-psw').val() !== $('#recheck-new-psw').val()){
                    $.toast('两次输入不一致，清重新输入');

                }else {
                    var dataNew={
                        openid:$("#open_id").val(),
                        mobilephone:$("#mobile-num").val(),
                        password: $('#new-psw').val(),
                        smscode: $('#check-num').val()
                    };
                    $.ajax({
                        type: "GET",
                        url: ctx+'/hotel/api/v1/user/resetPassword',
                        data: dataNew,
                        dataType: "json",
                        success: function(result) {
                            if(result.code == 1) {
                                $.toast('重置密码成功');
                                window.location.href = ctx+'/hotel/wx/v1/company/welcome?openid='+$("#open_id").val();
                            }else {
                                $.toast(result.msg);
                            }
                        }
                    });
                }
            });
        }
    };
}());