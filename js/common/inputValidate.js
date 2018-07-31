/**defaultInput---待验证输入框
 * defaultTip---输入提示框
 * defaultError---输入错误警告框
 * inputValue---待验证输入框的内容
 * MIN_LENGTH, MAX_LENGTH---验证长度
 * validateType---验证正则or验证函数
 * 
 * @authors ren-wuming
 * @date    2015-11-6
 * @version 
 */
(function($) {
	"use strict";

	$.fn.inputValidate = function(validateType, MIN_LENGTH, MAX_LENGTH, submit_btn) {
		var $defaultInput = $(this);
		var $defaultTip = $(this).parent().find(".input-tip");
		var $defaultWriteTip = $(this).parent().find(".input-writetip");
		var $defaultError = $(this).parent().find(".input-error");
		var $defaultEmpty = $(this).parent().find(".input-empty");
		var inputValue;//验证内容
		
		if($defaultInput.val()!=""){
			//若内容不为空，隐藏写入提示
			$defaultWriteTip.hide();
		}
		//blur时验证输入值
		$defaultInput.on("blur", function() {
			hideAllOut();
			//去掉尾部空格
			var _val = $.trim($defaultInput.val());
			$defaultInput.val(_val);
			inputValue = $defaultInput.val();
			//输入内容验证
			if(!inputValue) {
				//若内容为空，显示写入提示
				$defaultWriteTip.show();
				//显示输入提示
				$defaultTip.show();
				//隐藏错误提示
				$defaultError.hide();
				//输入框置为false
				$defaultInput.attr("checkresult", false);
				return;
			} else {
				//隐藏输入提示
				$defaultTip.hide();
			}
			if(validate(inputValue, validateType)==true) {
				$defaultError.hide();
			} else {
				$defaultError.show();
			}
		});
		$defaultInput.on("focus", function() {
			if(!inputValue) {
				//显示输入提示
				$defaultTip.show();
			}
			inputValue = $defaultInput.val();
			//隐藏empty提示
			$defaultEmpty.hide();
			//隐藏写入提示
			$defaultWriteTip.hide();
		});
		$defaultWriteTip.on("click",function(){
			$defaultInput.focus();
		})
		//提交按键提交时,显示empty提示
		if(submit_btn) {
			submit_btn.on("click", function() {
				//触发blur事件、验证输入值
				$defaultInput.trigger("blur");
				inputValue = $defaultInput.val();
				//显示empty提示
				if(!inputValue) {
					hideAllOut();
					$defaultEmpty.show();
				}
			});
		}
		//隐藏所有提示框，除了$defaultWriteTip
		function hideAllOut(){
			$defaultTip.hide();
			$defaultError.hide();
			$defaultEmpty.hide();
		}
			
		//具体内容验证函数
		function validate(inputValue, validateType) {
			var RESULT = false;
			//验证内容的正则是否符合
			if(validateType == "") {
				RESULT = true;
			} else if(validateType == "PHONE") {
				RESULT = PHONE.test(inputValue);
			} else if(validateType == "EMAIL") {
				RESULT = EMAIL.test(inputValue);
			} else if(validateType == "DOUBLE_2") {
				RESULT = DOUBLE_2.test(inputValue);
			} else if(validateType == "CHINESE") {
				RESULT = CHINESE.test(inputValue);
			} else if(validateType == "ENGLISH") {
				RESULT = ENGLISH.test(inputValue);
			} else if(typeof validateType == 'function') {
				RESULT = validateType(inputValue);
			} else {
				RESULT = validateType.test(inputValue);
			}
			//验证内容的长度是否符合
			if(MIN_LENGTH && !isNaN(MIN_LENGTH)) {
				RESULT = RESULT && !(checkLength(inputValue)<MIN_LENGTH);
			}
			if(MAX_LENGTH && !isNaN(MAX_LENGTH)) {
				RESULT = RESULT && !(checkLength(inputValue)>MAX_LENGTH);
			}
			
			$defaultInput.attr("checkresult", RESULT);
			return RESULT;
		}
		//计算验证内容的长度
		function checkLength(inputValue) {
	        var chart = inputValue.replace(/^\s*|\s*$/g, "");                        
	        var arr = (chart.match(/[\u4e00-\u9fa5]/g)) || [];//汉字长度
	        return chart.length + arr.length;			
		}
		
	};
	
	$.fn.checkResult = function() {
		var _result = $(this).attr("checkresult");
		if(_result == "true") return true;
		else return false;
	};
	
})(Zepto);
