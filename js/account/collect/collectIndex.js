/**
 * Created by bankwel on 2016/9/4.
 */
$(function(){
    collectIndex.init();
});
var collectIndex = (function(){

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
            var openid=$('#open_id').val();
            //获取收藏酒店列表
            $('.infinite-scroll-preloader').show();
            $.ajax({
                data:{
                    openid: openid
                },
                type: 'GET',
                dataType: 'json',
                url:ctx+'/hotel/api/v1/user/queryAllFavByPage',
                success: function(result) {
                    if(result.code == 1) {
                        var collectLis = result.data.favList;
                        var html='';
                        $('.infinite-scroll-preloader').hide();
                        if(collectLis.length!=0) {
                            for(var i = 0 ; i < collectLis.length ; i ++) {
                                var tags = collectLis[i].tags_show.split(',');
                                var txt='';
                                for(var j = 0 ; j < tags.length; j++) {
                                    txt +='<i class="inlineblock">'+tags[j]+'&nbsp;&nbsp;</i>';
                                }
                                html+='<div class="collect-box clearfix">'
                                        +'<div class="bgc-gray"></div>'
                                        +'<div class="collect-container">'
                                            +'<a href="javascript:;" class="fl">'
                                                +'<div class="collect-hotel-img fl" data-hotelId="'+collectLis[i].hotel_id+'">'
                                                    +'<img src="'+collectLis[i].logo+'" alt="collect-img">'
                                                +'</div>'
                                                +'<div class="collect-hotel fl clearfix">'
                                                    +'<h3>'+ collectLis[i].name +'</h3>'
                                                    +'<div class="hotel-stars">'
                                                        +'<em class="inlineblock" data-star="">'+txt+'</em>'
                                                    +'</div>'
                                                +'</div>'
                                                +'<div class="hotel-price">'
                                                    +'<em class="hotel-price inlineblock"><i class="inlineblock">'+ collectLis[i].price_show +'</i></em>'
                                                +'</div>'
                                            +'</a>'
                                        +'<div class="delete-collect fl"><span class="inlineblock" data-favId="'+ collectLis[i].fav_id +'"></span></div>'
                                        +'</div>'
                                    +'</div>';
                            }
                            $('.collect-order-content').append(html);
                        }else {
                            $('.nomoredata').show();
                        }
                    }else {
                        $.toast(result.msg);
                    }
                }
            });
            //点击删除收藏
            $('.collect-order-content').on(CLICK,'.delete-collect span',function() {
                var favId = $(this).attr('data-favId');
                $.ajax({
                    data: {
                        openid: openid,
                        fav_id:favId
                    },
                    url: ctx+'/hotel/api/v1/user/removeFav',
                    type: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        window.location.href=window.location.href;
                        window.location.reload;
                    }
                });
            });
            //点击收藏详情
            $('.collect-order-content').on(CLICK,'.collect-container a',function() {
               var hotelId = $(this).find('.collect-hotel-img').attr('data-hotelId');
                window.location.href = ctx+'/hotel/wx/v1/hotel/queryHotelDetail?openid='+openid+'&hotel_id='+hotelId;
            });
        }
    };
}());