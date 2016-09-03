var request = require('request');
var creds = require('./credentials.json');
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

var arbitrage = function(data) {
	for (var i = 0; i < data.length; i++) {
		var mySymbol = data[i].Name.substring(0, 3);
		var myTarget = data[i].Name.substring(4, 7);
		for (var j = 0; j < data.length; j++) {
			var leg1Symbol = data[j].Name.substring(0, 3);
			var leg1Target = data[j].Name.substring(4, 7);
			if (leg1Symbol == myTarget && leg1Target != mySymbol) {
				for (var k = 0; k < data.length; k++) {
					if (data[k].Name === leg1Target + "_" + mySymbol) {
						var res = data[i].Rate * data[j].Rate * data[k].Rate;
					if (res > 1)
						console.log(res + ": " + data[i].Name + " " + data[i].Rate + " -> " 
					+ data[j].Name + " " + data[j].Rate + " -> " + data[k].Name + " " + data[k].Rate);
					}
				}				
			}
		}
		
	}
}

function buildHeader(myURL) {
	return {
		url: myURL,
		headers: {
			'Authorization': 'Bearer ' + creds.API_Key
		}
	};
}

function priceCallback(error, response, body) {
	if (!error && response.statusCode == 200) {
		var ultimate = [];
		var obj = JSON.parse(body).prices;
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].bids) {
				var symb = obj[i].instrument;
				ultimate.push({
					Name: symb,
					Rate: obj[i].bids[0].price,
					Order: "sell " + symb			
				});
				ultimate.push({
					Name: symb.substring(4, 7) + "_" + symb.substring(0, 3),
					Rate: 1 / (obj[i].asks[0].price),
					Order: "buy " + symb
				});
			}
		}
		arbitrage(ultimate);
	}
}

function pairCallback(error, response, body) {
	if (!error && response.statusCode == 200) {
		var obj = JSON.parse(body).instruments;
		var pairs = "";
		for (var i = 0; i < obj.length; i++) {
			pairs = pairs + "," + obj[i].name;
		}
		pairs = pairs.substring(0, pairs.length - 1);
		request(buildHeader("https://api-" + creds.env + ".oanda.com/v3/accounts/" + creds.accountID + "/pricing?instruments=" + pairs), priceCallback);
	}
}

request(buildHeader("https://api-" + creds.env + ".oanda.com/v3/accounts/" + creds.accountID + "/instruments"), pairCallback);
