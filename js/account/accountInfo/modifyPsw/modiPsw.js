$(function(){
	PSW.init();
});
var PSW = (function(){
	
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
			$('#inpNewPsw').on('focus');
		},
		bindUI: function(){
			// 密码验证
            $("#inpNewPsw").on('blur', function(event) { // blur时候显示强度
                var tempStr = $(this).val().replace(/^\s*|\s*$/g, "");
                var $passStrong = $(this).parents(".pswItem").find('.pass-str');
                if (tempStr !== "") { // 输入值
                    if (!/[\u4e00-\u9fa5]/.test(tempStr)) {
                        if (tempStr.length >= 4 && tempStr.length <= 16) { //输入合法判断其强度
                            var kinds = getStrength(tempStr);
                            $passStrong.show(); //显示密码强度
                            if (kinds == 4) {
                                if (tempStr.length >= 8) { //显示强
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(2).addClass('power');
                                } else { //显示中
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(1).addClass('middle');
                                }
                            } else if (kinds == 3) {
                                if (tempStr.length >= 12) { //显示强
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(2).addClass('power');
                                } else { //显示中
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(1).addClass('middle');
                                }
                            } else if (kinds == 2) {
                                if (tempStr.length >= 8) { //显示中
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(1).addClass('middle');
                                } else { //显示弱
                                    $passStrong.find("span").removeClass();
                                    $passStrong.find("span").eq(0).addClass('weak');
                                }
                            } else { //显示弱
                                $passStrong.find("span").removeClass();
                                $passStrong.find("span").eq(0).addClass('weak');
                            };
                        }else{
                        	$passStrong.hide();
                        }
                    }else{
                    	$passStrong.hide();
                    }
                }else{
                	$passStrong.hide();
                }
            });
			//点击输入新密码
			$('.input-writetip').on('click',function() {
				$('#inpNewPsw').css('z-index','666').focus();;
			});
			//点击提交按钮
			$("#submitForPsw").on(CLICK,function(){
				if($("#inpOldPsw").val()==""){
					$.toast("请输入旧密码！");
				}else if(!validate("#inpOldPsw",'',4,16)){
					$.toast("请输入正确的旧密码！");
				}else if($("#inpNewPsw").val()==""){
					$.toast("请输入新密码！");
				}else if(!me.checkPass()){
					$.toast("请输入符合规范的新密码！");
				}else if($("#inpNewPswAgain").val()==""){
					$.toast("请再次输入新密码！");
				}else if($("#inpNewPswAgain").val()!=$("#inpNewPsw").val()||!validate("#inpNewPswAgain",'',4,16)){
					$.toast("新密码两次输入不一致！");
				}else if($("#inpNewPsw").val()==$("#inpOldPsw").val()){
					$.toast("新密码不能与旧密码相同！");
				}else{
					var data={
						openid:$("#openid").val(),
						oldPassword :$("#inpOldPsw").val(),
						password:$("#inpNewPsw").val()
					}
					$.ajax({
						type: "GET",
						url:ctx+"/hotel/api/v1/user/modifyPassword",
						data: data,
						dataType: "json",
						success: function(result,state) {
							var openid = result.data;
							if(result.code==1){
								//成功
								$.toast('密码修改成功');
								window.location.href = ctx+'/hotel/wx/v1/company/welcome?openid='+$("#openid").val();
							}else {
								$.toast(result.msg);
							}
						}
					});
				}
			});
		},
		checkPass:function(){
        	var tempStr =  $("#inpNewPsw").val().replace(/^\s*|\s*$/g, "");
        	if (!/[\u4e00-\u9fa5]/.test(tempStr)) {
        		if (tempStr.length >= 4 && tempStr.length <= 16) {
        			return true;
        		}else{
        			return false;
        		}
        	}else{
        		return false;
        	}
        }
	};
}());