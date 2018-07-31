$(function(){
	Invoice.init();
});
var Invoice = (function(){
	
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
			$("#city-picker").cityPicker({
		        toolbarTemplate: '<header class="bar bar-nav">\
		        <button class="button button-link pull-right close-picker">确定</button>\
		        <h1 class="title">请选择详细地址</h1>\
		        </header>'
		      });
			  var billvalue={
		          toolbarTemplate: '<header class="bar bar-nav">\
		          <button class="button button-link pull-right close-picker">确定</button>\
		          <h1 class="title">请选择发票明细</h1>\
		          </header>',
		          cols: [
		            {
		              textAlign: 'center',
		              values: ['代订房费', '代订住宿费']
		            }
		          ]
		        }
			  $("#billDetail").picker(billvalue);
			  $("#rightGo").live(CLICK,function(){
			  	$("#billDetail").picker('open');
			  });
		},
		bindUI: function(){
			$("#phone").on("keyup",function(){
				$(this).val($(this).val().replace(/[^\d-]/g,""));
			});
			$("#completeFill").on(CLICK,function(){
				if($("#billTitle").val()==""){
					$.toast("请输入发票抬头");
				}else if($("#recipient").val()==""){
					$.toast("请输入收件信息");
				}else if($("#phone").val()==""){
					$.toast("请输入联系方式");
				}else if(!validate("#phone","PHONE")){
					$.toast("请输入正确的联系方式");
				}else if($("#city-picker").val()==""||$("#detailAdd").val()==""){
					$.toast("请输入详细地址");
				}else if(!$(this).hasClass("clicked")){
					$(this).addClass("clicked");
					var data={
						detail:	$("#billDetail").val(),
						header:	$("#billTitle").val(),
						recipient:	$("#recipient").val(),
						mobile:	$("#phone").val(),
						address:$("#city-picker").val()+" "+$("#detailAdd").val(),
						//发票是否注明酒店名和入离时间
						flag:$(".fillTime span").hasClass("oncheck")?1:0
					}
					var openid=$("input[name='openid']").val();
					var contact=$("input[name='contact']").val();
					var mobile=$("input[name='mobile']").val();
					data.openid = openid;
					$.ajax({
						type: "post",
						data: data,
						url:ctx+'/hotel/saveInvoiceInfo',
						dataType: "json",
						success: function(result,state) {
							var invoiceId = result.data.id;
							window.location.href = ctx+'/hotel/fillOrder?openid='+openid+'&invoiceId='+invoiceId+'&header='+$("#billTitle").val();
							$("#completeFill").removeClass("clicked");
						}
					});
				}
			});
		}
	};
}());