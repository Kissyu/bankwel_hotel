$(function(){
	InvoiceInfo.init();
});
var InvoiceInfo = (function(){
	
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
			var billTitle={
				toolbarTemplate: '<header class="bar bar-nav">\
		          <button class="button button-link pull-right close-picker">确定</button>\
		          <h1 class="title">请选择发票抬头</h1>\
		          </header>',
				cols: [
					{
						textAlign: 'center',
						values: ['北京银库信息服务有限公司', '北京银库科技有限公司']
					}
				]
			}
			$("#billTitle").picker(billTitle);
			$("#selectBillTitle").live(CLICK,function(){
				$("#billTitle").picker('open');
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
						detailAddress:$("#city-picker").val(),
						address:$("#detailAdd").val(),
						//发票是否注明酒店名和入离时间
						flag:$(".fillTime").hasClass("oncheck")?1:0,
						addInvoiceToken:$("input[name='addInvoiceToken']").val()
					}
					var invoiceId=$("input[name='invoiceId']").val();
					var openid=$("input[name='openid']").val();
					data.openid = openid;
					data.id=invoiceId;
					var url = ctx+'/account/addOrUpdateInvoice';
					$.ajax({
						type: "get",
						data: data,
						url: url,
						dataType: "json",
						success: function(result,state) {
							$("#completeFill").removeClass("clicked");
							if(result.code==0){
								var openid = result.data;
								window.location.href = ctx+'/account/InvoiceList?openid='+openid;
							}else{
								$.alert(result.message);
							}
						}
					});
				}
			});
		}
	};
}());