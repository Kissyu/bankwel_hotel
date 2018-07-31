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
            var modifyInvoId = getUrlParam('invoice_id');
            var modifyInvoTit = decodeURI(getUrlParam('invoiceTitle'));
            var modifyInvoAddress = decodeURI(getUrlParam('invoiceAddress'));;
            $('#modifyInvoiceId').val(modifyInvoId);
            $('#invoice-name').val(modifyInvoTit);
            $('#invoice-address').val(modifyInvoAddress);
            //修改发票信息提交
            $('.invoice-line-link').on(CLICK,function() {
                if($('#invoice-name').val()=='') {
                    $.toast('请完善发票名称');
                }else if($('#invoice-address').val()=='') {
                    $.toast('请完善发票地址');
                }else {
                    $.ajax({
                        data: {
                            openid: openid,
                            invoice_id:modifyInvoId,
                            title : $('#invoice-name').val(),
                            address : $('#invoice-address').val()
                        },
                        url: ctx+'/hotel/api/v1/company/modifyInvoice',
                        type: 'GET',
                        dataType: 'json',
                        success: function(result) {
                            if(result.code == 1) {
                                window.location.href = ctx+"/hotel/wx/v1/company/queryAllInvoice?openid="+openid;
                            }if(result.code == 2) {
                                $.toast(result.msg);
                            }
                        }
                    });
                }
            });
        }
    };
}());
