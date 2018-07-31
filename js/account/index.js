/**
 * Created by bankwel on 2016/8/29.
 */
$(function(){
    account.init();
});
var account = (function(){

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
            //账户退出
            $('.exit-btn').click(function() {
                $(this).toggleClass('btn-toggle');
            });
        }
    };
}());
