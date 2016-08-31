var request = require('request');
var parseString = require('xml2js').parseString;
var currencies = ["USD", "EUR", "JPY", "GBP", "AUD", "CHF", "CAD", "MXN", "CNY"];
var json = [];
var countdown = currencies.length;

var getConversionArray = function(currencies) {
	var arr = [];
	for (var i = 0; i < currencies.length; i++) {
		for (var j = 0; j < currencies.length; j++) {
			if (i != j) {
				arr.push(currencies[i] + currencies[j]);
			}
		}
	}
	var str = JSON.stringify(arr);
	str = str.substring(1, str.length - 1);
	str = "(" + str + ")";
	return str;
}

var url = "http://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.xchange where pair in " + getConversionArray(currencies) + "&env=store://datatables.org/alltableswithkeys";

console.log(url);

/*for (var i = 0; i < currencies.length; i++) {
	var currency = currencies[i];
	var temp = url.replace("TARGET_CURRENCY", currency);
	request(temp, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var quotes = JSON.parse(body).quotes;
			console.log(JSON.parse(body));
			json.push(JSON.parse('{\"' + currency + '\" : ' + quotes + '}'));
			if (--countdown == 0) {
				console.log(json);
			}
		}
	})
}*/
