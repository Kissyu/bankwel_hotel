/*
 * Copyright (c) 2016. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * Created by Administrator on 2016/8/31.
 */
$(function(){
    Modi.init();
});
var Modi = (function(){
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
            $(".modipopup").on("opened",function(){
                $(".modal-overlay-visible").on(CLICK,function(){
                    $.closeModal('.popup.modipopup.modal-in');
                });
            });
            /*修改入离店日期*/
            //初始化
            var oDate=new Date();
            var oYesterday=new Date();
            oYesterday.setDate(oYesterday.getDate()-1);
            var yesterday=oYesterday.getFullYear()+'-'+toDou(oYesterday.getMonth()+1)+'-'+toDou(oYesterday.getDate());
            var today=oDate.getFullYear()+'-'+toDou(oDate.getMonth()+1)+'-'+toDou(oDate.getDate());
            $("#liveinday").val($(".startday").attr("data-start"));
            $(".totallive em").html($(".totalday").html());
            $(".leavedate em").html($(".endday").attr("data-end"));
            $(".liveintip i").html(calWeek($("#liveinday").val()));
//			$(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
            $(".leavedate i").html(calWeek($(".leavedate em").html()));
            /*/*$("#liveinday").calendar({
             minDate:[yesterday],
             value:[today]
             });*/
            /*$("#liveinday").on("change",function(){
             calWeek($("#liveinday").val(),$(".liveintip i"));
             });*/
            //前一天
            if(!compareToday($("#liveinday").val())){
                $(".prevday").addClass("cannotclick");
            }
            $(".prevday").on(CLICK,function(){
                if(compareToday($("#liveinday").val())){
                    $("#liveinday").val(modiDate($("#liveinday").val(),1,false));
                    $(".liveintip i").html(calWeek($("#liveinday").val()));
                    if(!compareToday($("#liveinday").val())){
                        $(".prevday").addClass("cannotclick");
                    }
                    $(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
                    $(".leavedate i").html(calWeek($(".leavedate em").html()));
                }
            });
            //后一天
            $(".nextday").on(CLICK,function(){
                $("#liveinday").val(modiDate($("#liveinday").val(),1,true));
                $(".liveintip i").html(calWeek($("#liveinday").val()));
                if(compareToday($("#liveinday").val())){
                    $(".prevday").removeClass("cannotclick");
                }
                $(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
                $(".leavedate i").html(calWeek($(".leavedate em").html()));
            });
            //减住一天
            if(parseInt($(".totallive em").html())<=1){
                $(".subdays").addClass("cannotclick");
            }
            $(".subdays").on(CLICK,function(){
                if(parseInt($(".totallive em").html())>1){
                    $(".totallive em").html(parseInt($(".totallive em").html())-1);
                    $(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
                    $(".leavedate i").html(calWeek($(".leavedate em").html()));
                    if(parseInt($(".totallive em").html())<=1){
                        $(".subdays").addClass("cannotclick");
                    }
                }
            });
            //加住一天
            $(".adddays").on(CLICK,function(){
                if(parseInt($(".totallive em").html())<28){
                    $(".totallive em").html(parseInt($(".totallive em").html())+1);
                    $(".leavedate em").html(modiDate($("#liveinday").val(),parseInt($(".totallive em").html()),true));
                    $(".leavedate i").html(calWeek($(".leavedate em").html()));
                    if(parseInt($(".totallive em").html())>1){
                        $(".subdays").removeClass("cannotclick");
                    }
                    if(parseInt($(".totallive em").html())==28){
                        $(".adddays").addClass("cannotclickright");
                    }
                }

            });
            //比较所选日期与今天的大小
            function compareToday(value){
                var oToday=new Date();
                var select=value.split('-');
                var oSelect=new Date();
                oSelect.setFullYear(select[0],select[1]-1,select[2]);
                if(oSelect.getTime()<=oToday.getTime()){
                    return false;
                }else{
                    return true;
                }
            }
            //前后移动日期
            function modiDate(date,num,modiway){
                var thedate=date.split('-');
                var oDate2=new Date();
                oDate2.setFullYear(thedate[0],thedate[1]-1,thedate[2]);
                if(modiway){
                    oDate2.setDate(oDate2.getDate()+num);
                }else{
                    oDate2.setDate(oDate2.getDate()-num);
                }
                return oDate2.getFullYear()+'-'+toDou(oDate2.getMonth()+1)+'-'+toDou(oDate2.getDate());
            }

        }
    };
}());
/*将日期转化为几月几日*/
function transformDate(value){
    var select=value.split('-');
    var oSelect=new Date();
    oSelect.setFullYear(select[0],select[1]-1,select[2]);
    var dateFormat="";
    dateFormat = (oSelect.getMonth()+1)+"月"+oSelect.getDate()+"日";
    return dateFormat;
}
//依据日期算星期几
function calWeek(date){
    var livein=date.split('-');
    var oDate1=new Date();
    oDate1.setFullYear(livein[0],livein[1]-1,livein[2]);
    return toWeek(oDate1.getDay());
}
function toWeek(week){
    switch(week){
        case 0:
            return "日";
            break;
        case 1:
            return "一";
            break;
        case 2:
            return "二";
            break;
        case 3:
            return "三";
            break;
        case 4:
            return "四";
            break;
        case 5:
            return "五";
            break;
        case 6:
            return "六";
            break;
    }
}
