/**
 * Created by bankwel on 2016/8/29.
 */
$(function(){
    accountManagement.init();
});
var accountManagement = (function(){

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
            var openid=$('#openid').val();
            //点击展开
            $(".account-li-box").on("click",".account-tit", function() {
                $(this).find('i').toggleClass('bg-toggole');
                $(this).next('.account-detail').toggle();
                $('.account-detail p em').each(function(index,ele) {
                    if($('.account-detail p em').eq(index).html()=='null') {
                        $(this).html('');
                    }
                });
            });
            //删除子账户
            $('.account-li-box').on('click','.delete-ico',function() {
                var data = {};
                data.openid =openid;
                data.user_id = $(this).parent().parent().next('.userId').val();
                $.ajax({
                    type: "get",
                    url:ctx+'/hotel/api/v1/company/deleteUser',
                    data: data,
                    dataType: "json",
                    success: function(result) {
                        if(result.code == 1) {
                            window.location.href=window.location.href;
                            window.location.reload;
                        }else {
                            $.toast(result.msg);
                        }
                    }
                })
            });
            //编辑子账户
            $('.account-li-box').on('click','.alter-ico',function() {
                var userId = $(this).parent().parent().next('.userId').val();
                var editName = $(this).parent().parent().prevAll('.account-tit').find('span').html();
                var editMobile = $(this).parent().parent().prev().find('.mobile em').html();
                var editEmail = $(this).parent().parent().prev().find('.emial em').html();
                if(editEmail == 'null') {
                    editEmail ='';
                }
                var editEmployee = $(this).parent().parent().prev().find('.jobNum em').html();
                if(editEmployee == 'null') {
                    editEmployee ='';
                }
                var editDepartment = $(this).parent().parent().prev().find('.department em').html();
                if(editDepartment =='null') {
                    editDepartment ='';
                }
                localStorage.setItem('editOpenid',openid);
                localStorage.setItem('editUserId',userId);
                localStorage.setItem('editTrue_name',editName);
                localStorage.setItem('editMobilephone',editMobile);
                localStorage.setItem('editEmail',editEmail);
                localStorage.setItem('editEmployee_code',editEmployee);
                localStorage.setItem('editDepartment',editDepartment);
                window.location.href = ctx+"/hotel/api/v1/company/userDetailPage?openid="+ openid +"&user_id=" +userId;
            });
            //添加
        }
    };
}());