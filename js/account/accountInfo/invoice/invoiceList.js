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
			
		},
		bindUI: function(){
			
			$(".deletelodger").on(CLICK,function(){
				var thisNode = $(this);
				var data={}
				var invoiceId=thisNode.prev().prev().val();
				var openid=$("input[name='openid']").val();
				data.openid = openid;
				data.invoiceId=invoiceId;
				$.ajax({
					type: "post",
					data: data,
					url: ctx+'/account/deleteInvoice',
					dataType: "json",
					success: function(result,state) {
						window.location.href = ctx+'/account/InvoiceList?openid='+openid;
					}
				});
				
			});
		}
	};
}());