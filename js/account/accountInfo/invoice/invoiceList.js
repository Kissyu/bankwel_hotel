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
			var openid = $('#open_id').val();
			$.ajax({
				data: {
					openid: openid
				},
				url: ctx+'/hotel/api/v1/company/queryAllInvoiceByPage',
				type: 'GET',
				success: function(result) {
					if(result.code==1) {
						var html='';
						console.log(result.data);
						var invoiceList = result.data.invoice_list;
						if(invoiceList) {
							for(var i = 0; i<invoiceList.length;i++ ) {
								html+='<div class="invoice-info">'
										+'<p class="invoice-info-name" data-invoiceId="'+ invoiceList[i].invoice_id +'">'
										+'<span class="inlineblock">'+invoiceList[i].title +'</span>'
										+'<a href="javascript:;"><em class="inlineblock alter-invoice">修改</em></a>'
										+'<em class="inlineblock delete-invoice">删除</em></p>'
										+'<p class="invoice-info-location"><em class="inlineblock">地址: '+invoiceList[i].address+'</em></p>'
									+'</div>';
							}
							$('.lodger-box').append(html);
						}
					}else {
						$.toast(result.msg);
					}
				},
			});
			//修改发票
			$('.lodger-box').on(CLICK,'.alter-invoice',function() {
				var invoice_id = $(this).parent().parent().attr('data-invoiceid');
				var invoiceTitle = $(this).parent().prev().html();
				var invoiceAddress = $(this).parent().parent().next('.invoice-info-location').find('em').html();
				invoiceAddress = invoiceAddress.split(":")[1];
				window.location.href = ctx+"/hotel/wx/v1/company/invoiceDetailPage?openid="+openid+"&invoice_id="+invoice_id+"&invoiceTitle="+encodeURI(encodeURI(invoiceTitle))+"&invoiceAddress="+encodeURI(encodeURI(invoiceAddress));
			});
			//删除发票
			$('.lodger-box').on(CLICK,'.delete-invoice',function() {
				var delInvoiceId = $(this).parent().attr('data-invoiceId');
				var delInvoiceTitle = $(this).prevAll('span').html();
				var delInvoiceAddress = $(this).next('invoice-info-location').find('em').html();
				$.ajax({
					data: {
						openid: openid,
						invoice_id: delInvoiceId
					},
					url: ctx+'/hotel/api/v1/company/deleteInvoice',
					success: function(result) {
						var code = result.code;
						if(code == 1) {
							//强制刷新
							location=location;
						}else {
							$.toast(result.msg);
						}
					}
				});
			});
		}
	};
}());