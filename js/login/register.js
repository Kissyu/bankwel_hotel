/**
 * Created by bankwel on 2016/8/31.
 */
$(function() {
	$Reg.init();
});
var register = $Reg = function() {
	var me = null,p_caption = 1;
	return {
		init: function() {
			this.initVars();
			this.renderUI();
			this.bindUI();
		},
		initVars: function() {
			me = this;
		},
		renderUI: function() {
		},
		bindUI: function() {
		},
	};
}();