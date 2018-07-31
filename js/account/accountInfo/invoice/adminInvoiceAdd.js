/**
 * Created by bankwel on 2016/9/7.
 */
$(function(){
    invoiceAdd.init();
});
var invoiceAdd = (function(){

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
            var openid = $('#openid').val();
            //发票信息提交
            $('.invoice-line-link').on(CLICK,function() {
                if($('#invoice-name').val()=='') {
                    $.toast('请完善发票名称');
                }else if($('#invoice-address').val()=='') {
                    $.toast('请完善发票地址');
                }else {
                    $.ajax({
                        type: 'GET',
                        data: {
                            openid: openid,
                            title : $('#invoice-name').val(),
                            address : $('#invoice-address').val()
                        },
                        url: ctx+'/hotel/api/v1/company/addInvoice',
                        dataType: 'json',
                        success: function(result) {
                            var code = result.code;
                            if(code == 1) {
                                $.toast('发票保存成功');
                                window.location.href= ctx+"/hotel/wx/v1/company/queryAllInvoice?openid="+openid;
                            }else if(code == 2) {
                                $.toast(result.msg);
                            }
                        }
                    });
                }
            });
        }
    };
}());
