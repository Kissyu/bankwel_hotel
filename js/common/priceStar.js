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
    Price.init();
});
var Price = (function(){
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
            //初始化价格、星级
            var selectedPrice=sessionStorage.getItem("PRICE");
            var selectedStar=sessionStorage.getItem("STAR");
            if(selectedPrice||selectedStar){
                //如果价格或者星级存在
                $(".choosePrice li").removeClass("selectedprice");
                $(".choosePrice li").eq(selectedPrice).addClass("selectedprice");
                var seStarArr=selectedStar.split(",");
                for(var i=0;i<$(".chooseStar").children().length;i++){
                    $(".chooseStar").children().eq(i).removeClass("selectedstar");
                }
                for(var i=0;i<seStarArr.length;i++){
                    $(".chooseStar").children().eq(seStarArr[i]).addClass("selectedstar");
                }
                getPriceStar()
            }else{
                $(".choosePrice li").removeClass("selectedprice");
                $(".choosePrice li").eq(0).addClass("selectedprice");
                for(var i=0;i<$(".chooseStar").children().length;i++){
                    $(".chooseStar").children().eq(i).removeClass("selectedstar");
                }
                $(".chooseStar").children().eq(0).addClass("selectedstar");
            }
            /*选择价格、星级*/
            $(".choosePrice li").on(CLICK,function(){
                $(".choosePrice li").removeClass("selectedprice");
                $(this).addClass("selectedprice");
            });
            $(".chooseStar dd").on(CLICK,function(){
                if($(this).hasClass("selectedstar")){
                    $(this).removeClass("selectedstar");
                    if($(".selectedstar").length==0){
                        $(".chooseStar dt").addClass("selectedstar");
                    }
                }else{
                    $(".chooseStar dt").removeClass("selectedstar");
                    $(this).addClass("selectedstar");
                }
            });
            $(".chooseStar dt").on(CLICK,function(){
                $(".chooseStar dd").removeClass("selectedstar");
                $(this).addClass("selectedstar");
            });
            $(".priceStarpopup").on("opened",function(){
                $(".modal-overlay-visible").on(CLICK,function(){
                    $.closeModal('.popup.priceStarpopup.modal-in');
                });
            });
        }
    };
}());
//价格、星级
function getPriceStar(){
    var priceStar=[];
    if(!$(".selectedprice").index()==0){
        priceStar.push($(".selectedprice").html());
    }
    if(!$(".selectedstar").is("dt")){
        for(var i=0;i<$(".selectedstar").length;i++){
            priceStar.push($(".selectedstar").eq(i).html());
        }
    }
    $(".pricetarInp").html(priceStar.join(","));
    if(priceStar.length!=0){
        $("#pricetarInp").siblings(".input-writetip").hide();
        $("#pricetarInp").parent(".bedtype").siblings(".cancelSelect").show();
        $("#pricetarInp").parent(".bedtype").addClass("jsKeywordInp");
    }else{
        $("#pricetarInp").siblings(".input-writetip").show();
        $("#pricetarInp").parent(".bedtype").siblings(".cancelSelect").hide();
        $("#pricetarInp").parent(".bedtype").removeClass("jsKeywordInp");
    }
}