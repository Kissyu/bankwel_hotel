$(function(){
	Com.init();
});
var Com = (function(){
	
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
			$(".myradio").live(CLICK,function(){
				if($(this).hasClass("oncheck")){
					$(this).removeClass("oncheck");
				}else{
					$(this).addClass("oncheck");
				}
			});
		}
	};
}());
//加0
function toDou(num){
	if(num<10)
		return '0'+num;
	else
		return ''+num;
}
//验证
function validate(theinput, validateType,MIN_LENGTH,MAX_LENGTH){
	//邮箱验证正则
	var EMAIL = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
	//手机号码验证正则
	var PHONE = /^((13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8})$|^((1709007|1709505|1709807|1709722)[0-9]{4})$/;
	var NAME=/^(([\u4E00-\u9FA5]{2,5}(?:\·[\u4E00-\u9FA5]{2,5})*)$|^[a-zA-Z](\w+\s?){1,20})$/;
	var inputValue = $(theinput).val();
	var RESULT = false;
	//验证内容的正则是否符合
	if(inputValue==""){
		RESULT = true;
	}else{
		if(validateType == "") {
			RESULT = true;
		} else if(validateType == "PHONE") {
			RESULT = PHONE.test(inputValue);
		} else if(validateType == "EMAIL") {
			RESULT = EMAIL.test(inputValue);
		} else if(validateType == "NAME"){
			RESULT = NAME.test(inputValue);
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
	}
	return RESULT;
	//计算验证内容的长度
	function checkLength(inputValue) {
        var chart = inputValue.replace(/^\s*|\s*$/g, "");                        
        var arr = (chart.match(/[\u4e00-\u9fa5]/g)) || [];//汉字长度
        return chart.length + arr.length;			
	}
}
/**
 * 验证身份证合法性
 * @name    identifyCard
 * @param   {String}    身份证号
 * @return  {Integer}	1/2，1表示验证通过，2表示验证不通过
*/
//====================== ================//
function identifyCard (targetValue) {
	// 创建检查对象
	var CheckIdCard = {
		// Wi 加权因子 Xi 余数0~10对应的校验码 Pi省份代码
		Wi : [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ],
		Xi : [ 1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2 ],
		Pi : [ 11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42,
				43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 71, 81, 82,
				91 ],
		// 检验18位身份证号码出生日期是否有效
		// parseFloat过滤前导零，年份必需大于等于1900且小于等于当前年份，用Date()对象判断日期是否有效。
		brithday18 : function (sIdCard) {
			var year = parseFloat(sIdCard.substr(6, 4));
			var month = parseFloat(sIdCard.substr(10, 2));
			var day = parseFloat(sIdCard.substr(12, 2));
			var checkDay = new Date(year, month - 1, day);
			var nowDay = new Date();
			if (1900 <= year && year <= nowDay.getFullYear()
					&& month == (checkDay.getMonth() + 1)
					&& day == checkDay.getDate()) {
				return true;
			}
		},
		// 检验15位身份证号码出生日期是否有效
		brithday15 : function (sIdCard) {
			var year = parseFloat(sIdCard.substr(6, 2));
			var month = parseFloat(sIdCard.substr(8, 2));
			var day = parseFloat(sIdCard.substr(10, 2));
			var checkDay = new Date(year, month - 1, day);
			if (month == (checkDay.getMonth() + 1) && day == checkDay.getDate()) {
				return true;
			}
		},
		// 检验校验码是否有效
		validate : function (sIdCard) {
			var aIdCard = sIdCard.split("");
			var sum = 0;
			for ( var i = 0; i < CheckIdCard.Wi.length; i++) {
				sum += CheckIdCard.Wi[i] * aIdCard[i]; // 线性加权求和
			}
			var index = sum % 11;// 求模，可能为0~10,可求对应的校验码是否于身份证的校验码匹配
			if (CheckIdCard.Xi[index] == aIdCard[17].toUpperCase()) {
				return true;
			};
		},
		// 检验输入的省份编码是否有效
		province : function (sIdCard) {
			var p2 = sIdCard.substr(0, 2);
			for ( var i = 0; i < CheckIdCard.Pi.length; i++) {
				if (CheckIdCard.Pi[i] == p2) {
					return true;
				};
			};
		}
	};
	// 去除字符串的前后空格，允许用户不小心输入前后空格
	var sIdCard = targetValue.replace(/^\s*|\s*$/g, "");
	if (sIdCard !== "") {
		// 判断是否全为18或15位数字，最后一位可以是大小写字母X
		if (sIdCard.match(/^\d{14,17}(\d|X)$/gi) == null) {   // 位数不对
			return 0;
		} else if (sIdCard.length == 18) {   // 18位身份证
			if (CheckIdCard.province(sIdCard)
				&& CheckIdCard.brithday18(sIdCard)
				&& CheckIdCard.validate(sIdCard)) {   // 成功
				return 1;
			} else {    // 失败
				return 2;
			};
		} else if (sIdCard.length == 15) {   // 15位身份证
			if (CheckIdCard.province(sIdCard)
				&& CheckIdCard.brithday15(sIdCard)) {   // 成功
				return 1;
			} else {	// 失败
				return 2;
			};
		};
	};
};
/**
 * 验证密码强度
 * @name    getStrength
 * @param   {String}    密码
 * @return  {Integer}	密码强度级别
*/
function getStrength(str) {
	var num = [];	// 包含数字
	var aStr = [];	// 包含大写字母
	var AStr = [];	// 包含小写字母
	var ts = [];	// 其他字符
	var ind = 0;
	for ( var i = 0; i < str.length; i++) {
		var iN = str.charCodeAt(i);
		if (iN >= 48 && iN <= 57) {
			num.push(iN);
			continue;
		}
		if (iN >= 65 && iN <= 90) {
			aStr.push(iN);
			continue;
		}
		if (iN >= 97 && iN <= 122) {
			AStr.push(iN);
			continue;
		}
		if (iN < 48 || iN > 57 && iN < 65 || iN > 90 && iN < 97 || iN > 122) {
			ts.push(iN);
		}
	}
	var zd = [ num, aStr, AStr,ts ];
	for ( var i = 0; i < zd.length; i++) {
		if (zd[i].length > 0) {
			ind++;
		}
	}
	return ind;
}