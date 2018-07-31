/**
 * Created by bankwel on 2016/9/4.
 */
$(function(){
    orders.init();
});
var orders = (function(){

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
            var openid = $('#open_id').val();
            /*点击查看百度地图*/
            $('.baidumap-ico').on(CLICK,function() {
                var jing = $('#order-lat').val();
                var wei = $('#order-lng').val();
                sessionStorage.setItem('jing',jing);
                sessionStorage.setItem('wei',wei);
                window.location.href = ctx+'/hotel/wx/v1/geo/hotelMapPage';
            });
            /*点击确认入住*/
            if($('.button-1').hasClass('status-30')) {
                $('.status-30').on(CLICK,function() {
                    var orderId = $('.book-info-list').attr('data-orderId');
                    var data = {};
                    data.openid = openid;
                    data.order_id = orderId;
                    $.ajax({
                        type: "get",
                        url:ctx+'/hotel/api/v1/order/checkin',
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
                    });
                });
            }
            /*点击进行支付*/
            $('.status-10').on(CLICK,function() {
                var orderId = $('.book-info-list').attr('data-orderId');
                var data = {};
                data.openid = openid;
                data.order_id = orderId;
                $.ajax({
                    type: "get",
                    url:ctx+'/hotel/api/v1/order/orderPayment',
                    data: data,
                    dataType: "json",
                    success: function(result) {
                        if(result.code == 1) {
                            sessionStorage.setItem('orderId',orderId);
                            window.location.href= ctx+'/hotel/wx/v1/pay/generatorPayInfo?openid='+openid+'&prepay_id='+result.data.wxResult.prepay_id;
                        }else {
                            $.toast(result.msg);
                        }
                    }
                })
            });
            /*点击取消订单*/
            $('.status-cancel').on(CLICK,function(){
                var orderId = $('.book-info-list').attr('data-orderId');
                var data = {};
                data.openid = openid;
                data.order_id = orderId;
                $.ajax({
                    type: "get",
                    url:ctx+'/hotel/api/v1/order/userCancel',
                    data: data,
                    dataType: "json",
                    success: function(result) {
                        if(result.code == 1) {
                            $.toast('订单取消成功，返回到订单列表');
                            window.location.href= ctx+'/hotel/wx/v1/user/queryOrderList?openid='+openid+'&status=&sorttype=';
                        }else {
                            $.toast(result.msg);
                        }
                    }
                })
            });
        }
    };
}());




