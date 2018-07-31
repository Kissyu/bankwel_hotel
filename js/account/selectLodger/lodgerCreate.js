/**
 * Created by bankwel on 2016/9/7.
 */
$(function(){
    regularUpdate.init();
});
var regularUpdate = (function(){

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
            /*添加常住联系人*/
            $('#completeFill').on(CLICK,function() {
                var reg1 =/^([\u4e00-\u9fa5]{2,6}|([a-zA-Z]+\s?){3,20})$/g;
                if($('#lodgerName').val().trim() =='') {
                    $.toast('请填写常住联系人姓名');
                }else if(!reg1.test($('#lodgerName').val().trim())) {
                    $.toast('请输入中文名长度2-6，英文名长度3-20');
                }else {
                    $.ajax({
                        data:{
                            openid: openid,
                            name: $('#lodgerName').val()
                        },
                        type: "GET",
                        url: ctx+'/hotel/api/v1/user/addContact',
                        success: function(result) {
                            if(result.code==1) {
                                console.log(1);
                                window.location.href = ctx+'/hotel/wx/v1/order/choiceContact?openid='+openid;
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