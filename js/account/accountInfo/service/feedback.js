/**
 * Created by bankwel on 2016/9/1.
 */
$(function(){
    feedback.init();
});
var feedback = (function(){

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
            var openid = $('#openid').val();
            //提交反馈意见
            $('.feedback-submit-btn').on('click',function() {
               $(this).addClass('toggle-btn');
                if($('.feedback-input').val().trim()==''){
                    $.toast('请填写您的意见');
                    $(this).removeClass('toggle-btn');
                }else {
                    $.ajax({
                        data: {
                            openid: $('#openid').val(),
                            content: $('.feedback-input').val()
                        },
                        type: 'GET',
                        dataType: 'json',
                        url: ctx+'/hotel/api/v1/user/savefeedback',
                        success: function(result) {
                            if(result.code == 1) {
                                window.location.href = ctx+"/hotel/wx/v1/user/userCenterMain?openid="+openid;
                            }
                            else {
                                $.toast(result.msg);
                            }
                        },
                        error: function() {}
                    });
                }
            });
        },
    };
}());