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
			/*发票抬头*/
			var comInfoList =  eval ("(" + sessionStorage.getItem('comInfoList') + ")");
			var invoiceTit= new Array();
			for(var k in comInfoList) {
				invoiceTit.push(comInfoList[k][' title']);
			}
			var billTitle={
				toolbarTemplate: '<header class="bar bar-nav">\
		          <button class="button button-link pull-right close-picker">确定</button>\
		          <h1 class="title">请选择发票抬头</h1>\
		          </header>',
				cols: [
					{
						textAlign: 'center',
						values: invoiceTit
					}
				]
			};
			$("#billTitle").picker(billTitle);
			$("#selectBillTitle").live(CLICK,function(){
				$("#billTitle").picker('open');
			});
			/*初始化所在地区*/
			$("#city-picker").cityPicker({
				toolbarTemplate: '<header class="bar bar-nav">\
		        <button class="button button-link pull-right close-picker">确定</button>\
		        <h1 class="title">请选择所在地区</h1>\
		        </header>'
			});
			var invoiceType=['旅游费用','代订房费', '代订住宿费'];
			var billvalue={
				toolbarTemplate: '<header class="bar bar-nav">\
		          <button class="button button-link pull-right close-picker">确定</button>\
		          <h1 class="title">请选择发票明细</h1>\
		          </header>',
				cols: [
					{
						textAlign: 'center',
						values: invoiceType
					}
				]
			}
			$("#billDetail").picker(billvalue);
			$("#rightGo").live(CLICK,function(){
				$("#billDetail").picker('open');
			});
			/*初始化发票信息*/
			var lastInvLis =  eval ("(" + sessionStorage.getItem('lastInv') + ")");
			if(!sessionStorage.getItem("noNeedInvoice")&&lastInvLis["invoice_title"]!="null"&&lastInvLis["invoice_title"]!="undefined"){
				$("#needInvoice").attr("checked",true);
				$('.invoice-box').show();
			}
			if(lastInvLis){
				for(var i in lastInvLis){
					if(lastInvLis[i]=="null"||lastInvLis[i]=="undefined"){
						lastInvLis[i]="";
					}
				}
				$('#recipient').val(lastInvLis['invoice_true_name']);
				$('#phone').val(lastInvLis['invoice_mobilephone']);
				$('#city-picker').val(lastInvLis['invoice_pcd']);
				$('#detailAdd').val(lastInvLis['invoice_address']);
				if(lastInvLis['invoice_type']!=""){
					$("#billDetail").val(invoiceType[lastInvLis['invoice_type']-1]);
				}
				$("#billTitle").val(lastInvLis['invoice_title']);
				if(lastInvLis['invoice_is_timedetail']=='1'){
					$("#needTime").attr("checked",true);
				}else{
					$("#needTime").removeAttr("checked");
				}
			}
		},
		renderUI: function(){

		},
		bindUI: function(){
			var openid= $('#openid').val();
			//是否开发票
			$("#needInvoice").on("change",function(){
				if($("#needInvoice").attr("checked")=="true"||$("#needInvoice").attr("checked")==false){
					$('.invoice-box').hide();
					$("#needInvoice").removeAttr("checked");
				}else{
					$('.invoice-box').show();
				}
			});
			$("#needTime").on("change",function(){
				if($("#needTime").attr("checked")=="true"){
					$("#needTime").removeAttr("checked");
				}
			});
			$("#phone").on("keyup",function(){
				$(this).val($(this).val().replace(/[^\d-]/g,""));
			});
			$("#completeFill").on(CLICK,function(){
				if($("#needInvoice").attr("checked")==false){
					sessionStorage.setItem('noNeedInvoice',true);
					window.location.href = ctx+'/hotel/wx/v1/hotel/newOrderPage?openid='+openid+'&price_id='+sessionStorage.getItem('price_id')+'&checkintime='+sessionStorage.getItem('checkintime')+'&leavetime='+sessionStorage.getItem('leavetime');
				}else{
					if($("#billTitle").val()==""){
						$.toast("请输入发票抬头");
					}else if($("#recipient").val()==""){
						$.toast("请输入收件信息");
					}else if($("#phone").val()==""){
						$.toast("请输入联系方式");
					}else if(!validate("#phone","PHONE")){
						$.toast("请输入正确的联系方式");
					}else if($("#city-picker").val()==""||$("#detailAdd").val()==""){
						$.toast("请完善您的地址");
					}else if(!$(this).hasClass("clicked")){
						$(this).addClass("clicked");
						sessionStorage.removeItem('noNeedInvoice');

						var invoiceInfo={};
						var invoiceType=['旅游费用','代订房费', '代订住宿费'];
						for(var i=0;i<invoiceType.length;i++){
							if($("#billDetail").val()==invoiceType[i]){
								invoiceInfo.invoice_type=i+1;
							}
						}
						/*获取发票抬头的id*/
						var comInfoList =  eval ("("+sessionStorage.getItem('comInfoList')+")");
						for(var k in comInfoList) {
							if($('#billTitle').val()==comInfoList[k][' title']){
								$('#billTitle').attr('data-invoiceId',comInfoList[k]['invoice_id']);
							}
						}
						invoiceInfo.invoice_true_name=$('#recipient').val();
						invoiceInfo.invoice_mobilephone=$('#phone').val();
						invoiceInfo.invoice_pcd=$('#city-picker').val();
						invoiceInfo.invoice_address=$('#detailAdd').val();
						invoiceInfo.invoice_title=$("#billTitle").val();
						invoiceInfo.invoice_is_timedetail=($("#needTime").attr("checked")!=false)?1:0;
						sessionStorage.setItem("lastInv",JSON.stringify(invoiceInfo));

						window.location.href = ctx+'/hotel/wx/v1/hotel/newOrderPage?openid='+openid+'&price_id='+sessionStorage.getItem('price_id')+'&checkintime='+sessionStorage.getItem('checkintime')+'&leavetime='+sessionStorage.getItem('leavetime');
					}
				}
			});
		}
	};
}());