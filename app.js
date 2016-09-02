var request = require('request');
var currencies = ["USD", "EUR", "JPY", "GBP", "AUD", "CHF", "CAD", "MXN", "CNY"];

var getConversionArray = function(currencies) {
	var arr = [];
	for (var i = 0; i < currencies.length; i++) {
		for (var j = 0; j < currencies.length; j++) {
			if (i != j) {
				arr.push(currencies[i] + currencies[j]);
			}
		}
	}
	return arr;
}

var sanitizeConversionArray = function(arr) {
	var str = JSON.stringify(arr);
	str = str.substring(1, str.length - 1);
	str = "(" + str + ")";
	return str;
}

var arbitrage = function(currencies, data) {
	var len = currencies.length;
	var arr = [];
	for (var i = 0; i < data.length; i++) {
		var mySymbol = data[i].id.substring(0, 3);
		var myTarget = data[i].id.substring(3, 6);
		for (var j = 0; j < data.length; j++) {
			var leg1Symbol = data[j].id.substring(0, 3);
			var leg1Target = data[j].id.substring(3, 6);
			if (leg1Symbol == myTarget && leg1Target != mySymbol) {
				for (var k = 0; k < data.length; k++) {
					if (data[k].id == leg1Target + mySymbol) {
						var buy1 = data[i].Ask;
						var buy2 = data[j].Ask;
						var sell = data[k].Bid;
						var res = buy1 * buy2 * sell;
						console.log(res + ": " + data[i].id + "->" + data[j].id + "->" + data[k].id);
					}
				}				
			}
		}
		
	}
}

var url = "http://query.yahooapis.com/v1/public/yql?q=select * from " + 
"yahoo.finance.xchange where pair in " + sanitizeConversionArray(getConversionArray(currencies))
+ "&env=store://datatables.org/alltableswithkeys&format=json";

request(url, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var obj = JSON.parse(body).query.results.rate;
		arbitrage(currencies, obj);
	}
})

