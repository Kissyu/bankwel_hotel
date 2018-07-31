$(function(){
	Special.init();
});
var Special = (function(){
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
			$("#otherNeed").inputValidate("");
			$(".specialneedList").on(CLICK,"li",function(){
				$(".specialneedList li").removeClass("myNeed");
				$(".specialneedList li").eq($(this).index()).addClass("myNeed");
			});
		}
	};
}());