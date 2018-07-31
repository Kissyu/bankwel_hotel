$(function(){
    HDetail.init();
});
var HDetail = (function(){
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
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationType: 'fraction'
            });
        },
        bindUI: function(){
            $(document).delegate(".showMoreFacility",CLICK,function(){
                $(".moreFacilityBox").show();
                $(this).hide();
            });
            $(document).delegate(".hidMoreFacility",CLICK,function(){
                $(".moreFacilityBox").hide();
                $(".showMoreFacility").show();
            });
            var checkInTime = null;
            var leaveTime = null;

            var oToday=new Date();
            var oTomorrow=new Date();
            oTomorrow.setDate(oToday.getDate()+1);
            var today=oToday.getFullYear()+'-'+toDou(oToday.getMonth()+1)+'-'+toDou(oToday.getDate());
            var tomorrow=oTomorrow.getFullYear()+'-'+toDou(oTomorrow.getMonth()+1)+'-'+toDou(oTomorrow.getDate());

            if(sessionStorage.getItem('checkintime')){
                checkInTime = sessionStorage.getItem('checkintime');
            }else if(getUrlParam('checkintime')){
                checkInTime = getUrlParam('checkintime');
            }else{
                checkInTime = today;
            }
            if(sessionStorage.getItem('leavetime')){
                leaveTime = sessionStorage.getItem('leavetime');
            }else if(getUrlParam('leavetime')){
                leaveTime = getUrlParam('leavetime');
            }else{
                leaveTime = tomorrow;
            }

            /*点击预定*/
            $(document).delegate(".reserveNow",CLICK,function(){
                var priceId = $(".price_id").val();
                var openid = $('#open_id').val();
                sessionStorage.setItem('price_id',priceId);
                sessionStorage.setItem('hotel_id',$('#hotelId').val());
                window.location.href = ctx+"/hotel/wx/v1/hotel/newOrderPage?openid="+openid+"&price_id="+priceId+"&checkintime="+checkInTime+"&leavetime="+leaveTime;
            });
            function getUrlParam(name)
            {
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r!=null) return unescape(r[2]); return null; //返回参数值
            }
        }
    };
}());