/**
 * Created by bankwel on 2016/8/30.
 */
$(function() {
    $Log.init();
});
var login = $Log = function() {
    var me = null;
    var postFlag1= false;
    var postFlag2= false;
    return {
        init: function() {
            this.initVars();
            this.renderUI();
            this.bindUI();
        },
        initVars: function() {
            me = this;
        },
        renderUI: function() {

        },
        bindUI: function() {
            var openid = $('#openid').val();
            //如果曾经登录 记住手机号
            var mobileNum = localStorage.getItem('mobileNum');
            if(mobileNum!='') {
                $('#user-name').val(mobileNum);
            }
            // 点击登陆按钮
            $(".login-btn").on(CLICK,function() {
                var loginName = $('#user-name');
                var loginPass = $('#user-pass');
                var _self = this;
                if (loginName.val() == "" ) {
                    postFlag1=false;
                    $.toast('手机号不能为空');
                }else if(loginPass.val() == "") {
                    postFlag2 = false;
                    $.toast('请输入密码');
                } else {
                    postFlag1 = true;
                    postFlag2 = true;
                    var data = {
                        openid: $('#openid').val(),
                        username: loginName.val(),
                        password: loginPass.val(),
                        redirect: ''
                    };
                    if (postFlag1&&postFlag2) {
                        $.ajax({
                            url: ctx+'/hotel/api/v1/company/login',
                            type:'GET',
                            dataType:'json',
                            data:data,
                            success:function(result){
                                if(result.code == 1) {
                                    var userId = result.data.user_id;
                                    var userType = result.data.user_type;
                                    sessionStorage.setItem('userId',userId);
                                    sessionStorage.setItem('userType',userType);
                                    localStorage.setItem('mobileNum',loginName.val());
                                    window.location.href = result.redirect;
                                }else {
                                    $.toast(result.msg);
                                }
                            }
                        });
                    };
                }
            });
        },

    };
}();
