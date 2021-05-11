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
	var extension = url.pathname.substring(url.pathname.lastIndexOf("."), url.pathname.length);
	if(extension == ".html") {
		sendFileContent(response, url.pathname.substring(1), "text/html");
	} else if(extension == ".css"){
		sendFileContent(response, url.pathname.substring(1), "text/css");
	} else if(extension == ".js"){
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
					connection.query("CALL "+proc+"(NULL, " + connection.escape(url.searchParams.get("key")) + ", " + connection.escape(url.searchParams.get("password")) + ");", generalQueryFunc);
				} else {
					connection.query("CALL "+proc+"(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("key")) + ", " + connection.escape(url.searchParams.get("password")) + ");", generalQueryFunc);
				}
			} else if(url.searchParams.get("case") == "postLogOut") {
				connection.query("CALL LogOut(" + connection.escape(url.searchParams.get("token")) + ")", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_cust_ViewFlights") {
				connection.query("CALL Cust_ViewFlights(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("email")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_cust_SearchFlights") {
				connection.query("CALL Cust_SearchFlights(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("email")) + ", " + connection.escape(url.searchParams.get("deploc")) + ", " + connection.escape(url.searchParams.get("depdate")) + ", " + connection.escape(url.searchParams.get("arrloc")) + ", " + connection.escape(url.searchParams.get("arrdate")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_cust_PurchaseTicket") {
				connection.query("CALL Cust_PurchaseTicket(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("email")) + ", " + connection.escape(url.searchParams.get("flightnum")) + ", " + connection.escape(url.searchParams.get("airline")) + ", " + connection.escape(url.searchParams.get("deptime")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_cust_RateFlight") {
				connection.query("CALL Cust_RateFlight(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("email")) + ", " + url.searchParams.get("ticketID") + ", " + connection.escape(url.searchParams.get("rating")) + ", " + connection.escape(url.searchParams.get("comment")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_cust_TrackSpending") {
				connection.query("CALL Cust_TrackSpending(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("email")) + ", " + connection.escape(url.searchParams.get("startdate")) + ", " + connection.escape(url.searchParams.get("enddate")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_ViewFlights") {
				connection.query("CALL Agen_ViewFlights(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("id")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_SearchFlights") {
				connection.query("CALL Agen_SearchFlights(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("id")) + ", " + connection.escape(url.searchParams.get("deploc")) + ", " + connection.escape(url.searchParams.get("depdate")) + ", " + connection.escape(url.searchParams.get("arrloc")) + ", " + connection.escape(url.searchParams.get("arrdate")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_agen_PurchaseTicket") {
				connection.query("CALL Agen_PurchaseTicket(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("id")) + ", " + connection.escape(url.searchParams.get("email")) + ", " + connection.escape(url.searchParams.get("flightnum")) + ", " + connection.escape(url.searchParams.get("airline")) + ", " + connection.escape(url.searchParams.get("deptime")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_TrackSpending") {
				connection.query("CALL Agen_TrackSpending(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("id")) + ", " + connection.escape(url.searchParams.get("startdate")) + ", " + connection.escape(url.searchParams.get("enddate")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_GetTopCustomers_Tix") {
				connection.query("CALL Agen_GetTopCustomers_Tix(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("id")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_agen_GetTopCustomers_Commish") {
				connection.query("CALL Agen_GetTopCustomers_Commish(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("id")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_ViewFlights") {
				connection.query("CALL Staf_ViewFlights(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ", " + connection.escape(url.searchParams.get("startdate")) + ", " + connection.escape(url.searchParams.get("enddate")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_staf_CreateFlight") {
				connection.query("CALL Staf_CreateFlight(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ", " + connection.escape(url.searchParams.get("baseprice")) + ", " + connection.escape(url.searchParams.get("deploc")) + ", " + connection.escape(url.searchParams.get("depdate")) + ", " + connection.escape(url.searchParams.get("arrloc")) + ", " + connection.escape(url.searchParams.get("arrdate")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_staf_ChangeFlightStatus") {
				connection.query("CALL Staf_ChangeFlightStatus(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ", " + connection.escape(url.searchParams.get("status")) + ", " + connection.escape(url.searchParams.get("flightnum")) + ", " + connection.escape(url.searchParams.get("deptime")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_staf_CreateAirplane") {
				connection.query("CALL Staf_CreateAirplane(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ", " + connection.escape(url.searchParams.get("numseats")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_staf_CreateAirport") {
				connection.query("CALL Staf_CreateAirport(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ", " + connection.escape(url.searchParams.get("name")) + ", " + connection.escape(url.searchParams.get("city")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_staf_ViewFlightReviews") {
				connection.query("CALL Staf_ViewFlightRatings(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ", " + connection.escape(url.searchParams.get("flightnum")) + ", " + connection.escape(url.searchParams.get("deptime")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_GetAgen_Tix") {
				connection.query("CALL Staf_GetTopAgen_Tix(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_GetAgen_Commish") {
				connection.query("CALL Staf_GetTopAgen_Commish(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_GetTopCustomers") {
				connection.query("CALL Staf_GetTopCustomers(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_GetCustomers") {
				connection.query("CALL Staf_GetCustomers(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_GetCustFlights") {
				connection.query("CALL Staf_GetCustFlights(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ", " + connection.escape(url.searchParams.get("email")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_GetRevenue") {
				connection.query("CALL Staf_GetRevenue(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ", " + connection.escape(url.searchParams.get("startdate")) + ", " + connection.escape(url.searchParams.get("enddate")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_GetRevenue_byMonth") {
				connection.query("CALL Staf_GetRevenue_byMonth(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ", " + connection.escape(url.searchParams.get("startdate")) + ", " + connection.escape(url.searchParams.get("enddate")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_GetRevenue_byType") {
				connection.query("CALL Staf_GetRevenue_byType(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_staf_GetTopDestinations") {
				connection.query("CALL Staf_GetTopDestinations(" + connection.escape(url.searchParams.get("token")) + ", " + connection.escape(url.searchParams.get("username")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "get_gen_SearchFlights") {
				connection.query("CALL Gen_SearchFlights(" + connection.escape(url.searchParams.get("deploc")) + ", " + connection.escape(url.searchParams.get("arrloc")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_cust_register") {
				connection.query("CALL Register_Customer(" + connection.escape(url.searchParams.get("name")) + ", " + connection.escape(url.searchParams.get("email")) + ", " + connection.escape(url.searchParams.get("pw")) + ", " + url.searchParams.get("addr_buildnum") + ", " + url.searchParams.get("addr_street") + ", " + url.searchParams.get("addr_city") + ", " + url.searchParams.get("addr_state") + ", " + connection.escape(url.searchParams.get("phonenum")) + ", " + connection.escape(url.searchParams.get("dob")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_agen_register") {
				connection.query("CALL Register_BookingAgent(" + connection.escape(url.searchParams.get("email")) + ", " + connection.escape(url.searchParams.get("pw")) + ");", generalQueryFunc);
			} else if(url.searchParams.get("case") == "post_staf_register") {
				connection.query("CALL Register_AirlineStaff(" + connection.escape(url.searchParams.get("username")) + ", " + url.searchParams.get("airline_name") + ", " + connection.escape(url.searchParams.get("pw")) + ", " + url.searchParams.get("first_name") + ", " + url.searchParams.get("last_name") + ", " + connection.escape(url.searchParams.get("dob")) + ");", generalQueryFunc);
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
