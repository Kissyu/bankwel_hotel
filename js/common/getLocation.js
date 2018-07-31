//点击我的位置
function getlocation(sucFn){ 
//获取经纬度 
	var data={}; 
	var options = {
		enableHighAccuracy:true,
		timeout:2000,
		maximumAge:30000
	};
	navigator.geolocation.getCurrentPosition(displayPosition,handleError,options); 
	function displayPosition(pos){
		data.location=pos.coords["latitude"]+','+pos.coords["longitude"];
		data.output = 'json';
		data.ak = 'AbKpNygBtj2wEj8ruvXWOk9ZkeiGQbto';
		jsonp({
			url:'http://api.map.baidu.com/geocoder/v2/',
			data:data,
			cbName:'callback',
			success:sucFn
		});
	}
	function handleError(err){
		switch(err.code){
			case 1:{
				$.alert("用户未授权使用地理定位功能");
				break;
			}
			case 2:{
				$.alert("不能确定位置");
				break;
			}
			case 3:{
				$.alert("请求位置的尝试已超时");
				break;
			}
			default:{
				break;
			}
		}
	}
}