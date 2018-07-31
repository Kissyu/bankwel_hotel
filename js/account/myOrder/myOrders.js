/**
 * Created by bankwel on 2016/8/29.
 */
$(function(){
    orders.init();
});
var orders = (function(){
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
            var openid = $('#openid').val();
            if(openid =='') {
                openid = getUrlParam('openid');
            }
            var data = {};
            data.openid = openid;
            data.status = getUrlParam('status');
            data.sorttype = '';
            sessionStorage.setItem('orderStatus',data.status);
            sessionStorage.setItem('ordersort',data.sorttype);
            /*订单列表加载*/
            var loading = false;
            var nomore=false;
            var pageNum=2;
            addItems(sessionStorage.getItem('ordersort'),sessionStorage.getItem('orderStatus'),1);
            /*点击直接支付*/
            /*$('#content').on(CLICK,'.payNow',function() {
                var data = {};
                data.openid = openid;
                data.order_id = $(this).find('.order-num').attr('data-orderId');
                $.ajax({
                    type: "get",
                    url:'/hotel/api/v1/order/orderPayment',
                    data: data,
                    dataType: "json",
                    success: function(result) {
                        if(result.code == 1) {
                            sessionStorage.setItem('orderId',data.order_id);
                            window.location.href= '/hotel/wx/v1/pay/generatorPayInfo?openid='+openid+'&prepay_id='+result.data.wxResult.prepay_id;
                        }else {
                            $.toast(result.msg);
                        }
                    }
                })
            });*/
            /*过滤订单弹窗*/
            $(".type-all").on("opened",function(){
                $(".modal-overlay-visible").on(CLICK,function(){
                    $.closeModal('.popup.type-all.modal-in');
                });
            });
            $(".order-all").on("opened",function(){
                $(".modal-overlay-visible").on(CLICK,function(){
                    $.closeModal('.popup.order-all.modal-in');
                });
            });
            $(".sortpopupbox").on(CLICK,"li",function(){
                $(this).siblings("li").removeClass("curSortStandard");
                $(this).addClass("curSortStandard");
                $.closeModal('.popup.modal-in');
            });
            sessionStorage.setItem('ordersort','');
            sessionStorage.setItem('orderStatus','');
            /*点击筛订单类型进行查询*/
            $('.type-all li').on(CLICK,function() {
                $(".sortpopupbox li").removeClass("curSortStandard");
                $(this).addClass("curSortStandard");
                $.closeModal('.popup.modal-in');
                var status = $(this).attr('data-type');
                var sortType = sessionStorage.getItem('ordersort');
                sessionStorage.setItem('orderStatus',status);
                $('.order-content').empty();
                addItems(sortType,status,1);
                nomore=false;
                loading = false;
                pageNum=2;
            });
            /*点击正序或者倒序*/
            $('.order-all li').on(CLICK,function() {
                var sortType = $(this).attr('data-order');
                sessionStorage.setItem('ordersort',sortType);
                var orderStatus = sessionStorage.getItem('orderStatus');
                $('.order-content').empty();
                addItems(sortType,orderStatus,1);
                nomore=false;
                loading = false;
                pageNum=2;
            });
            function addItems(sortType,status,pageNum) {
                $(".nomoredata").hide();
                $('.infinite-scroll-preloader').show();
                var data = {};
                data.openid = openid;
                data.status = status;
                data.sorttype = sortType;
                data.page_id = pageNum;
                $.ajax({
                    data:data,
                    url: ctx+'/hotel/wx/v1/user/queryOrderListByPage',
                    type: "GET",
                    dataType: "html",
                    success: function (result) {
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').hide();
                        var itemNum = result.match(/orders-list/g) || [];
                        if (pageNum == 1) {
                            $(".order-content").empty().html(result);
                            if (itemNum.length == 0) {
                                $(".nomoredata").html("没有相关的订单");
                            } else {
                                $(".nomoredata").html("没有更多数据了");
                            }
                        } else {
                            $(".order-content").append(result);
                        }
                        if (itemNum.length < 10) {
                            nomore = true;
                            $(".nomoredata").show();
                            return;
                        }
                    }
                });
            }
            var container = document.getElementById("content");
            container.onscroll = function () {
                var scrollTop = container.scrollTop;
                var scrollHeight = container.scrollHeight;
                var height = container.offsetHeight;
                var scrollB = scrollTop + height;
                if (scrollB >= scrollHeight - 150) {
                    if (loading) return;
                    loading = true;
                    setTimeout(function () {
                        loading = false;
                        if (nomore) {
                            return;
                        }
                        addItems(sessionStorage.getItem('ordersort'),sessionStorage.getItem('orderStatus'),pageNum);
                        pageNum++;
                    }, 1000);
                }
            };
        }
    };
}());




