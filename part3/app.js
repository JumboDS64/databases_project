const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
//const xhr = require("xmlhttprequest")

//remember to sanitize all variables before inserting them into sql queries!
//https://www.dotnetcurry.com/nodejs/1144/nodejs-html-static-pages-website

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((request, response) => {
	var url = new URL(request.url, `http://${request.headers.host}`);
	//console.log(url.pathname);
	if(/^\/[a-zA-Z0-9\/]*.html$/.test(url.pathname)) {
		sendFileContent(response, url.pathname.substring(1), "text/html");
	} else if(/^\/[a-zA-Z0-9\/]*.css$/.test(url.pathname)){
		sendFileContent(response, url.pathname.substring(1), "text/css");
	} else if(/^\/[a-zA-Z0-9\/]*.js$/.test(url.pathname)){
		sendFileContent(response, url.pathname.substring(1), "text/javascript");
	} else if(url.pathname == "/request") {
		if(url.searchParams != null) {
			var connection = mysql.createConnection({
				host				: 'localhost',
				user				: 'root',
				password		: 'secret',
				database		: 'sys'
			});
			connection.connect(function(err) {
				if (err) throw err;
				console.log("Connected!");
			});
			if(url.searchParams.get("case") == "getFlights") {
				connection.query('SELECT * FROM flight', generalQueryFunc);
			} else if(url.searchParams.get("case") == "getLogIn") {
				var proc = null;
				var type = url.searchParams.get("type");
				if(type == "0") proc = "LogIn_Cust";
				else if(type == "1") proc = "LogIn_Agen";
				else if(type == "2") proc = "LogIn_Staf";
				if(url.searchParams.get("token") == "null") {
					connection.query("CALL "+proc+"(NULL, \'" + url.searchParams.get("key") + "\', \'" + url.searchParams.get("password") + "\');", generalQueryFunc);
				} else {
					connection.query("CALL "+proc+"(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("key") + "\', \'" + url.searchParams.get("password") + "\');", generalQueryFunc);
				}
			} else if(url.searchParams.get("case") == "postLogOut") {
				connection.query("CALL LogOut(\'" + url.searchParams.get("token") + "\')", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_cust_ViewFlights") {
				connection.query("CALL Cust_ViewFlights(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("email") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_cust_SearchFlights") {
				connection.query("CALL Cust_SearchFlights(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("email") + "\', \'" + url.searchParams.get("deploc") + "\', \'" + url.searchParams.get("depdate") + "\', \'" + url.searchParams.get("arrloc") + "\', \'" + url.searchParams.get("arrdate") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_cust_PurchaseTicket") {
				connection.query("CALL Cust_PurchaseTicket(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("email") + "\', \'" + url.searchParams.get("flightnum") + "\', \'" + url.searchParams.get("airline") + "\', \'" + url.searchParams.get("deptime") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_cust_RateFlight") {
				connection.query("CALL Cust_RateFlight(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("email") + "\', \'" + url.searchParams.get("ticketID") + "\', " + url.searchParams.get("rating") + ", \'" + url.searchParams.get("comment") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_cust_TrackSpending") {
				connection.query("CALL Cust_TrackSpending(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("email") + "\', \'" + url.searchParams.get("startdate") + "\', \'" + url.searchParams.get("enddate") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_ViewFlights") {
				connection.query("CALL Agen_ViewFlights(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("id") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_SearchFlights") {
				connection.query("CALL Agen_SearchFlights(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("id") + "\', \'" + url.searchParams.get("deploc") + "\', \'" + url.searchParams.get("depdate") + "\', \'" + url.searchParams.get("arrloc") + "\', \'" + url.searchParams.get("arrdate") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_agen_PurchaseTicket") {
				connection.query("CALL Agen_PurchaseTicket(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("id") + "\', \'" + url.searchParams.get("email") + "\', \'" + url.searchParams.get("flightnum") + "\', \'" + url.searchParams.get("airline") + "\', \'" + url.searchParams.get("deptime") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_TrackSpending") {
				connection.query("CALL Agen_TrackSpending(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("id") + "\', \'" + url.searchParams.get("startdate") + "\', \'" + url.searchParams.get("enddate") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_GetTopCustomers_Tix") {
				connection.query("CALL Agen_GetTopCustomers_Tix(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("id") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_GetTopCustomers_Commish") {
				connection.query("CALL Agen_GetTopCustomers_Commish(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("id") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_ViewFlights") {
				connection.query("CALL Staf_ViewFlights(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("username") + "\', \'" + url.searchParams.get("startdate") + "\', \'" + url.searchParams.get("enddate") + "\');", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_staf_CreateFlight") {
				connection.query("CALL Staf_CreateFlight(\'" + url.searchParams.get("token") + "\', \'" + url.searchParams.get("username") + "\', \'" + url.searchParams.get("baseprice") + "\', \'" + url.searchParams.get("deploc") + "\', \'" + url.searchParams.get("depdate") + "\', \'" + url.searchParams.get("arrloc") + "\', \'" + url.searchParams.get("arrdate") + "\');", generalQueryFunc);
			}
			connection.end();
		} 
	} else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.write("Unrecognized filetype!");
		response.end();
	}
	function generalQueryFunc(error, results, fields) {
		if (error) throw error;
		response.write(JSON.stringify(results));
		response.end();
	}
	function sendFileContent(response, fileName, contentType){
		fs.readFile(fileName, function(err, data){
			if(err){
				response.writeHead(404, {'Content-Type': 'text/html'});
				response.write("File not found!");
			}
			else{
				response.writeHead(200, {'Content-Type': contentType});
				response.write(data);
			}
			response.end();
		});
	}
	/**function makeid(length) { //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
		var result           = [];
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
		}
		return result.join('');
	}**/
	function sqlDate(date) { //https://stackoverflow.com/questions/20083807/javascript-date-to-sql-date-object
		var pad = function(num) { return ('00'+num).slice(-2) };
		var out;
		out = date.getUTCFullYear()         + '-' +
			pad(date.getUTCMonth() + 1)  + '-' +
			pad(date.getUTCDate())       + ' ' +
			pad(date.getUTCHours())      + ':' +
			pad(date.getUTCMinutes())    + ':' +
			pad(date.getUTCSeconds());
		return out;
	}
	Date.prototype.addMinutes = function(m) { //based on https://stackoverflow.com/questions/1050720/adding-hours-to-javascript-date-object
		this.setTime(this.getTime() + (m*60*1000));
		return this;
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
