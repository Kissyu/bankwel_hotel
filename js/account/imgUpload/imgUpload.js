/**
 * Created by bankwel on 2016/8/29.
 */
$(function(){
    imgUpload.init();
});
var imgUpload = (function(){

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
            var data={};
            //点击更换图片
            var inputFile = document.getElementById("uploadImg");
            var imgFile;
            var upimg = new Image();
            var imgCompress;
            inputFile.addEventListener('change', function (e) {
                $('.admin-avatar .logoImg').attr('background','url('+ctx+'/hotel/img/loading.gif) no-repeat');
                var file = inputFile.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.addEventListener('load', function (e) {
                    imgFile = this.result;
                    upimg.src = imgFile;
                    /*imgCompress = compress(upimg);*/
                    imgCompress = imgFile.split(",")[1];
                    data.openid = openid;
                    data.logo64 = imgCompress;
                    $.ajax({
                        url: ctx+'/hotel/wx/v1/company/uploadLogo',
                        async: false,
                        type: 'post',
                        data: data,
                        dataType: 'json',
                        success: function(result){
                            if(result.code == 1){
                                $('.admin-avatar .logoImg').attr('background','url('+ctx+'/hotel/img/loading.gif) no-repeat');
                                window.location.href = ctx+'/hotel/wx/v1/user/userCenterMain?openid='+openid;
                            }else{
                                $.toast(result.msg);
                                return;
                            }
                        },
                    });
                });

            });
        }
    };
}());