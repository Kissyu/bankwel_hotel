/**
 * Created by bankwel on 2016/9/2.
 */
$(function(){
    LodgerList.init();
});
var LodgerList = (function(){

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
            //返回上一步
            $(".lastStep").on(CLICK,function(){
                var priceId=sessionStorage.getItem('price_id');
                var checkInTime=sessionStorage.getItem('checkintime');
                var leaveTime=sessionStorage.getItem('leavetime');
                window.location.href = ctx+"/hotel/wx/v1/hotel/newOrderPage?openid="+openid+"&price_id="+priceId+"&checkintime="+checkInTime+"&leavetime="+leaveTime;
            });
            $.ajax({
                data: {
                    openid: openid
                },
                type: 'GET',
                url: ctx+'/hotel/api/v1/user/queryAllContact',
                success: function(result) {
                    var lodgerList = result.data.contactList;
                    var html='';
                    if(lodgerList) {
                        for(var i = 0;i<lodgerList.length;i++) {
                            html+='<li class="fnradio clearfix">'
                                +'<span class="selecticon fl"><i></i></span>'
                                +'<span class="modiname fl" data-id="'+lodgerList[i].contact_id+'">'+lodgerList[i].name+'</span>'
                                +'<span class="deleteLodger fr">删除</span>'
                                +'</li>';
                        }
                        $('.accountInfoList').append(html);
                    }
                    /*初始化已选择入住人*/
                    var check=JSON.parse(sessionStorage.getItem('checked'));
                    var logerNum = sessionStorage.getItem('lodgerNum');
                    if(check){
                        for(var i=0;i<logerNum;i++){
                            for(var j=0;j<$(".fnradio").length;j++){
                                if(check[i]['id']==$(".fnradio .modiname").eq(j).attr("data-id")){
                                    $(".fnradio").eq(j).addClass("oncheck");
                                }
                            }
                        }
                    }else{
                        for(var j=0;j<$(".fnradio").length;j++){
                            if($(".fnradio .modiname").eq(j).html()==sessionStorage.getItem("userName")){
                                $(".fnradio").eq(j).addClass("oncheck");
                            }
                        }
                    }
                }
            });
            /*选择入住人*/
            $(".accountInfoList").delegate('.fnradio',CLICK,function(ev){
                if($(ev.target).hasClass("deleteLodger")){//删除联系人
                    var _this=$(this);
                    $.confirm("确定删除该入住人吗？",function(){
                        $.ajax({
                            data: {
                                openid: openid,
                                name:_this.children(".modiname").html(),
                                contact_id:_this.children(".modiname").attr("data-id")
                            },
                            type: 'GET',
                            url: ctx+'/hotel/api/v1/user/deleteContact',
                            dataType:'json',
                            success: function(result) {
                                if(result.code==1){
                                    _this.remove();
                                }else{
                                    $.alert(result.msg);
                                }
                            }
                        });
                    })
                }else{
                    var thisCheck = $(this);
                    var logerNum = sessionStorage.getItem('lodgerNum');
                    if(logerNum){
                        if(thisCheck.hasClass("oncheck")){
                            thisCheck.removeClass("oncheck");
                        }else{
                            if($(".fnradio.oncheck").length>=parseInt(logerNum)){
                                $.toast("每间房只需填写1人");
                            }else{
                                thisCheck.addClass("oncheck");
                            }
                        }
                    }
                }
            });
            /*点击完成*/
            $("#completeFill").on(CLICK,function(){
                var logerNum = sessionStorage.getItem('lodgerNum');
                var checked=[];
                var checkjson={};
                if($(".fnradio.oncheck").length == 0) {
                    $.toast("请选择入住人");
                }else if(Number(logerNum)>$(".fnradio.oncheck").length){
                    $.toast("您的入住人信息不够，请继续添加");
                }else {
                    var priceId = sessionStorage.getItem('price_id');
                    for(var i=0;i<$(".fnradio.oncheck").length;i++){
                        checkjson={};
                        checkjson.name=$(".fnradio.oncheck .modiname").eq(i).html();
                        checkjson.id=$(".fnradio.oncheck .modiname").eq(i).attr("data-id");
                        checked.push(checkjson);
                    }
                    sessionStorage.setItem('checked',JSON.stringify(checked));
                    window.location.href = ctx+'/hotel/wx/v1/hotel/newOrderPage?openid='+openid+'&price_id='+priceId+'&checkintime='+sessionStorage.getItem('checkintime')+'&leavetime='+sessionStorage.getItem('leavetime');
                }
            });
        }
    };
}());