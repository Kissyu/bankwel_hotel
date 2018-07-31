/**
 * Created by bankwel on 2016/9/5.
 */
$(function(){
    accountEdit.init();
});
var accountEdit = (function(){
    var me = false;
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
            //编辑子账户
            $('.edit-btn').on('click',function() {
                var subadminName =$('.sub-account-name').val().trim();
                var reg =/^([\u4e00-\u9fa5]{2,6}|([a-zA-Z]+\s?){3,20})$/g;
                var subadminPhone = $('.sub-account-num').val().trim();
                var subadminMail = $('.sub-account-mail').val().trim();
                if(subadminName == '' ) {
                    $.toast('用户名不能为空');
                }else if(!reg.test(subadminName)) {
                    $.toast('请输入中文名长度2-6，英文名长度3-20');
                }else if(subadminPhone == '') {
                    $.toast('手机号码不能为空');
                }else if(subadminMail!=''&&(!validate('.sub-account-mail','EMAIL'))) {
                    $.toast('请输入正确的邮箱格式');
                }else {
                    var data= {};
                    data.openid = $('#openid').val();
                    data.user_id = $('#userId').val();
                    data.true_name = subadminName;
                    data.mobilephone = subadminPhone;
                    data.email = subadminMail;
                    data.employee_code = $('.sub-account-id').val().trim();
                    data.department = $('.sub-account-department').val().trim();
                    $.ajax({
                        type: 'GET',
                        url:ctx+'/hotel/api/v1/company/modifyUser',
                        data: data,
                        dataType: 'json',
                        success: function(result) {
                            if(result.code == 1) {
                                $.toast('修改成功');
                                window.location.href = ctx+"/hotel/wx/v1/company/queryAllUser?openid="+$('#openid').val();
                            }else {
                                $.toast(result.msg);
                            }
                        },
                        error: function() {
                        }
                    });
                }
            });
        }
    };
}());