/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

$(function(){
    QIndex.init();
});
var QIndex = (function(){
    var openid=$("#open_id").val();
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
            /*选择入住和离店时间*/
            function formatDate(num){
                var oDate=new Date();
                oDate.setDate(oDate.getDate()+(num));
                var targetDay=oDate.getFullYear()+'-'+toDou(oDate.getMonth()+1)+'-'+toDou(oDate.getDate());
                return targetDay;
            }
            var yesterday=formatDate(-1);
            var today=formatDate(0);
            var tomorrow=formatDate(1);
            var maxInDay=formatDate(30);
            var maxOutDay=formatDate(60);
            $("#checkintime").val(today); //默认选中当前的日期
            $("#leavetime").val(tomorrow); //默认选中下一天
            $("#checkintime").change(calcRestDay);
            $("#leavetime").change(calcRestDay);
            $("#checkintime").calendar({
                minDate:[yesterday],
                maxDate:[maxInDay],
                value:[today]
            });
            $("#leavetime").calendar({
                minDate:[today],
                maxDate:[maxOutDay],
                value:[tomorrow]
            });
            /*选择目的地*/
            if(localStorage.getItem("currentPosition")){ //如果获取当前位置
                var location=eval("("+localStorage.getItem("currentPosition")+")");
                $("#locationAdd").html(location["posname"]);
                $("#locationAdd").attr("data-cityid",location["posid"]);  //当前城市的id
            }
            $("#mylocation").on(CLICK,function(){
                var openid=$("input[name='openid']").val();
                localStorage.removeItem("KEYWORD");
                localStorage.removeItem("KEYWORDNAV");
                localStorage.removeItem("KEYWORDID");
                localStorage.removeItem("HOTELID");
                localStorage.removeItem("KEYWORDLIST");
                localStorage.removeItem("METROLINELIST");
                window.location.href=ctx+"/hotel/wx/v1/city/cityListPage?openid="+openid;  //跳转到城市搜索页
            });
            /*我的位置*/
            $("#locate").on(CLICK,function(){
                getlocation(function(json){  //获取当前位置成功之后的处理函数
                    if(json.data.cityName){
                        $("#locationAdd").html(json.data.address_detail);
                        $("#locationAdd").attr("data-cityid",json.data.city_id);
                        var position={};
                        position.posname=json.data.address_detail;
                        position.posid=json.data.city_id;
                        localStorage.setItem("currentPosition",JSON.stringify(position));
                        clearArea();
                    }
                });
            });
            /*选择关键字/位置/商圈*/
            if(localStorage.getItem("KEYWORD")){
                $("#areaInp").siblings(".input-writetip").hide();
                $("#areaInp").html(localStorage.getItem("KEYWORD"));
                $("#area").siblings(".cancelSelect").show();
                $("#area").addClass("jsKeywordInp");
            }
            $("#area").on(CLICK,function(){
                if(!localStorage.getItem("currentPosition")){
                    $.toast("请先选择目的地");
                }else{
                    var openid=$("input[name='openid']").val();
                    window.location.href=ctx+"/hotel/wx/v1/keyword/keyWordFilterPage?openid="+openid;
                }
            });
            //点击×按钮
            $("#areaDelete").on(CLICK,clearArea);
            function clearArea(){
                $("#areaInp").html("");
                $("#area").children(".input-writetip").show();
                $("#areaDelete").hide();
                localStorage.removeItem("KEYWORD");
                localStorage.removeItem("KEYWORDID");
                localStorage.removeItem("HOTELID");
                localStorage.removeItem("KEYWORDNAV");
                localStorage.removeItem("KEYWORDLIST");
                localStorage.removeItem("METROLINELIST");
                var deleteTimer = setTimeout(function(){
                    $("#area").removeClass("jsKeywordInp");
                    clearTimeout(deleteTimer);
                },30);
            }
            //价格星级弹出层点击确定
            $("#confirmStarPrice a").on(CLICK,function(){
                getPriceStar();
                var starIndexArr=[];
                for(var i=0;i<$(".selectedstar").length;i++){
                    starIndexArr.push($(".selectedstar").eq(i).index());
                }
                if($(".selectedprice").index()==0) {
                    sessionStorage.setItem("PRICE",'');
                }else{
                    sessionStorage.setItem("PRICE",$(".selectedprice").index());
                }
                if(starIndexArr[0]=='0') {
                    sessionStorage.setItem("STAR",'');
                }else{
                    sessionStorage.setItem("STAR",starIndexArr);
                }
                $.closeModal('.popup.priceStarpopup.modal-in');
            });
            //点击价格与星级的×按钮
            $("#priceDelete").on(CLICK,function(){
                var bedtype=$(this).siblings(".bedtype");
                bedtype.children(".deleteItem").html("");
                bedtype.children(".input-writetip").show();
                $(this).hide();
                sessionStorage.removeItem("PRICE");
                sessionStorage.removeItem("STAR");
                $(".choosePrice li").removeClass("selectedprice");
                $(".chooseStar").children().removeClass("selectedstar");
                $(".choosePrice li").eq(0).addClass("selectedprice");
                $(".chooseStar").children().eq(0).addClass("selectedstar");
                var deleteTimer = setTimeout(function(){
                    bedtype.removeClass("jsKeywordInp")
                    clearTimeout(deleteTimer);
                },30);
            });
            /*点击开始搜索*/
            $("#searchNow").on(CLICK,function(){
                /*必须选择关键词上商圈星级就进行查询*/
                if($("#locationAdd").html()==""){
                    $.toast("请您选择目的地");
                    return;
                }else{
                    var searchData={};
                    searchData.openid = openid;
                    if(sessionStorage.getItem('PRICE')){
                        searchData.choosePrice = sessionStorage.getItem('PRICE');
                    }else{
                        searchData.choosePrice = "";
                    }
                    if(sessionStorage.getItem('STAR')){
                        searchData.choosestar = sessionStorage.getItem('STAR');
                    }else{
                        searchData.choosestar = "";
                    }
                    //入住时长选择
                    sessionStorage.setItem("checkintime",$("#checkintime").val());  //入住时间选择
                    sessionStorage.setItem("leavetime",$("#leavetime").val());  //离店时间选择
                    sessionStorage.setItem('timeDay',$('.staytime .livedate').html().replace(/[^0-9]/ig,"")); //入住天数

                    searchData.checkintime=$("#checkintime").val();
                    searchData.leavetime=$("#leavetime").val();
                    searchData.sorttype = '';
                    searchData.city_id = $('#locationAdd').attr('data-cityid');
                    searchData.section_id = localStorage.getItem('KEYWORDID')?localStorage.getItem('KEYWORDID'):"";
                    searchData.hotel_id = localStorage.getItem('HOTELID')?localStorage.getItem('HOTELID'):"";
                    searchData.keyword = localStorage.getItem('KEYWORD')?localStorage.getItem('KEYWORD'):"";

                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function(r){
                        if(this.getStatus() == BMAP_STATUS_SUCCESS){
                            searchData.lat = r.point.lat;
                            searchData.lng = r.point.lng;
                            toQueryList();
                        }
                        else {
                            searchData.lat="";
                            searchData.lng="";
                            toQueryList();
                        }
                    },{enableHighAccuracy: true});
                    function toQueryList(){
                        sessionStorage.setItem("thelat",searchData.lat);
                        sessionStorage.setItem("thelng",searchData.lng);
                        var arr=[];
                        for(var i in searchData){
                            arr.push(i+"="+searchData[i]);
                        }
                        //跳转到酒店列表首页
                        window.location.href=ctx+"/hotel/wx/v1/hotel/queryHotelList?"+arr.join("&");
                    }
                }
            });
            function calcRestDay(){
                var livein=$("#checkintime").val().split('-');
                var oDate1=new Date();
                oDate1.setFullYear(livein[0],livein[1]-1,livein[2]);
                timein=oDate1.getTime();
                var leave=$("#leavetime").val().split('-');
                var oDate2=new Date();
                oDate2.setFullYear(leave[0],leave[1]-1,leave[2]);
                var timeleave=oDate2.getTime();
                var totalday=(timeleave-timein)/86400000;
                if(totalday<=0){
                    oDate1.setDate(oDate1.getDate()+1);
                    $("#leavetime").val(oDate1.getFullYear()+'-'+toDou(oDate1.getMonth()+1)+'-'+toDou(oDate1.getDate()));
                    $(".livedate").html("共"+1+"晚");
                }else{
                    $(".livedate").html("共"+parseInt(totalday)+"晚");
                }
            }
        }
    };
}());