const http = require('http');
const fs = require('fs');
const mysql = require('mysql2');
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
			function param(str) {
				return url.searchParams.get(str);
			}
			if(url.searchParams.get("case") == "getFlights") {
				connection.query('SELECT * FROM flight', generalQueryFunc);
			} else if(url.searchParams.get("case") == "getLogIn") {
				var proc = null;
				var type = url.searchParams.get("type");
				if(type == "0") proc = "LogIn_Cust";
				else if(type == "1") proc = "LogIn_Agen";
				else if(type == "2") proc = "LogIn_Staf";
				if(url.searchParams.get("token") == "null") {
					connection.query("CALL "+proc+"(NULL, ?, ?);", [param("key"), param("password")], generalQueryFunc);
					connection.unprepare("CALL "+proc+"(NULL, ?, ?);");
				} else {
					connection.query("CALL "+proc+"(?, ?, ?);", [param("token"), param("key"), param("password")], generalQueryFunc);
					connection.unprepare("CALL "+proc+"(?, ?, ?);");
				}
			} else if(url.searchParams.get("case") == "postLogOut") {
				connection.query("CALL LogOut(?)", [param("token")], generalQueryFunc);
				connection.unprepare("CALL LogOut(?)");
			} else if(url.searchParams.get("case") == "get_cust_ViewFlights") {
				connection.query("CALL Cust_ViewFlights(?, ?);", [param("token"), param("email")], generalQueryFunc);
				connection.unprepare("CALL Cust_ViewFlights(?, ?);");
			} else if(url.searchParams.get("case") == "get_cust_SearchFlights") {
				connection.query("CALL Cust_SearchFlights(?, ?, ?, ?, ?, ?);", [param("token"), param("email"), param("deploc"), param("depdate"), param("arrloc"), param("arrdate")],  generalQueryFunc);
				connection.unprepare("CALL Cust_SearchFlights(?, ?, ?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "post_cust_PurchaseTicket") {
				connection.query("CALL Cust_PurchaseTicket(?, ?, ?, ?, ?);", [param("token"), param("email"), param("flightnum"), param("airline"), param("deptime")], generalQueryFunc);
				connection.unprepare("CALL Cust_PurchaseTicket(?, ?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "post_cust_RateFlight") {
				connection.query("CALL Cust_RateFlight(?, ?, ?, ?, ?);", [param("token"), param("email"), param("ticketID"), param("rating"), param("comment")], generalQueryFunc);
				connection.unprepare("CALL Cust_RateFlight(?, ?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "get_cust_TrackSpending") {
				connection.query("CALL Cust_TrackSpending(?, ?, ?, ?);", [param("token"), param("email"), param("startdate"), param("enddate")], generalQueryFunc);
				connection.unprepare("CALL Cust_TrackSpending(?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "get_agen_ViewFlights") {
				connection.query("CALL Agen_ViewFlights(?, ?);", [param("token"), param("id")], generalQueryFunc);
				connection.unprepare("CALL Agen_ViewFlights(?, ?);");
			} else if(url.searchParams.get("case") == "get_agen_SearchFlights") {
				connection.query("CALL Agen_SearchFlights(?, ?, ?, ?, ?, ?);", [param("token"), param("id"), param("deploc"), param("depdate"), param("arrloc"), param("arrdate")], generalQueryFunc);
				connection.unprepare("CALL Agen_SearchFlights(?, ?, ?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "post_agen_PurchaseTicket") {
				connection.query("CALL Agen_PurchaseTicket(?, ?, ?, ?, ?, ?);", [param("token"), param("id"), param("email"), param("flightnum"), param("airline"), param("deptime")], generalQueryFunc);
				connection.unprepare("CALL Agen_PurchaseTicket(?, ?, ?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "get_agen_TrackSpending") {
				connection.query("CALL Agen_TrackSpending(?, ?, ?, ?);", [param("token"), param("id"), param("startdate"), param("enddate")], generalQueryFunc);
				connection.unprepare("CALL Agen_TrackSpending(?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "get_agen_GetTopCustomers_Tix") {
				connection.query("CALL Agen_GetTopCustomers_Tix(?, ?);", [param("token"), param("id")], generalQueryFunc);
				connection.unprepare("CALL Agen_GetTopCustomers_Tix(?, ?);");
			} else if(url.searchParams.get("case") == "get_agen_GetTopCustomers_Commish") {
				connection.query("CALL Agen_GetTopCustomers_Commish(?, ?);", [param("token"), param("id")], generalQueryFunc);
				connection.unprepare("CALL Agen_GetTopCustomers_Commish(?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_ViewFlights") {
				connection.query("CALL Staf_ViewFlights(?, ?, ?, ?);", [param("token"), param("username"), param("startdate"), param("enddate")], generalQueryFunc);
				connection.unprepare("CALL Staf_ViewFlights(?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "post_staf_CreateFlight") {
				connection.query("CALL Staf_CreateFlight(?, ?, ?, ?, ?, ?, ?);", [param("token"), param("username"), param("baseprice"), param("deploc"), param("depdate"), param("arrloc"), param("arrdate")], generalQueryFunc);
				connection.unprepare("CALL Staf_CreateFlight(?, ?, ?, ?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "post_staf_ChangeFlightStatus") {
				connection.query("CALL Staf_ChangeFlightStatus(?, ?, ?, ?, ?);", [param("token"), param("username"), param("status"), param("flightnum"), param("deptime")], generalQueryFunc);
				connection.unprepare("CALL Staf_ChangeFlightStatus(?, ?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "post_staf_CreateAirplane") {
				connection.query("CALL Staf_CreateAirplane(?, ?, ?);", [param("token"), param("username"), param("numseats")], generalQueryFunc);
				connection.unprepare("CALL Staf_CreateAirplane(?, ?, ?);");
			} else if(url.searchParams.get("case") == "post_staf_CreateAirport") {
				connection.query("CALL Staf_CreateAirport(?, ?, ?, ?);", [param("token"), param("username"), param("name"), param("city")], generalQueryFunc);
				connection.unprepare("CALL Staf_CreateAirport(?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "post_staf_ViewFlightReviews") {
				connection.query("CALL Staf_ViewFlightRatings(?, ?, ?, ?);", [param("token"), param("username"), param("flightnum"), param("deptime")], generalQueryFunc);
				connection.unprepare("CALL Staf_ViewFlightRatings(?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_GetAgen_Tix") {
				connection.query("CALL Staf_GetTopAgen_Tix(?, ?);", [param("token"), param("username")], generalQueryFunc);
				connection.unprepare("CALL Staf_GetTopAgen_Tix(?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_GetAgen_Commish") {
				connection.query("CALL Staf_GetTopAgen_Commish(?, ?);", [param("token"), param("username")], generalQueryFunc);
				connection.unprepare("CALL Staf_GetTopAgen_Commish(?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_GetTopCustomers") {
				connection.query("CALL Staf_GetTopCustomers(?, ?);", [param("token"), param("username")], generalQueryFunc);
				connection.unprepare("CALL Staf_GetTopCustomers(?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_GetCustomers") {
				connection.query("CALL Staf_GetCustomers(?, ?);", [param("token"), param("username")], generalQueryFunc);
				connection.unprepare("CALL Staf_GetCustomers(?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_GetCustFlights") {
				connection.query("CALL Staf_GetCustFlights(?, ?, ?);", [param("token"), param("username"), param("email")], generalQueryFunc);
				connection.unprepare("CALL Staf_GetCustFlights(?, ?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_GetRevenue") {
				connection.query("CALL Staf_GetRevenue(?, ?, ?, ?);", [param("token"), param("username"), param("startdate"), param("enddate")], generalQueryFunc);
				connection.unprepare("CALL Staf_GetRevenue(?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_GetRevenue_byMonth") {
				connection.query("CALL Staf_GetRevenue_byMonth(?, ?, ?, ?);", [param("token"), param("username"), param("startdate"), param("enddate")], generalQueryFunc);
				connection.unprepare("CALL Staf_GetRevenue_byMonth(?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_GetRevenue_byType") {
				connection.query("CALL Staf_GetRevenue_byType(?, ?);", [param("token"), param("username")], generalQueryFunc);
				connection.unprepare("CALL Staf_GetRevenue_byType(?, ?);");
			} else if(url.searchParams.get("case") == "get_staf_GetTopDestinations") {
				connection.query("CALL Staf_GetTopDestinations(?, ?);", [param("token"), param("username")], generalQueryFunc);
				connection.unprepare("CALL Staf_GetTopDestinations(?, ?);");
			} else if(url.searchParams.get("case") == "get_gen_SearchFlights") {
				connection.query("CALL Gen_SearchFlights(?, ?);", [param("deploc"), param("arrloc")], generalQueryFunc);
				connection.unprepare("CALL Gen_SearchFlights(?, ?);");
			} else if(url.searchParams.get("case") == "post_cust_register") {
				connection.query("CALL Register_Customer(?, ?, ?, ?, ?, ?, ?, ?, ?);", [param("name"), param("email"), param("pw"), param("addr_buildnum"), param("addr_street"), param("addr_city"), param("addr_state"), param("phonenum"), param("dob")], generalQueryFunc);
				connection.unprepare("CALL Register_Customer(?, ?, ?, ?, ?, ?, ?, ?, ?);");
			} else if(url.searchParams.get("case") == "post_agen_register") {
				connection.query("CALL Register_BookingAgent(?, ?);", [param("email"), param("pw")], generalQueryFunc);
				connection.unprepare("CALL Register_BookingAgent(?, ?);");
			} else if(url.searchParams.get("case") == "post_staf_register") {
				connection.query("CALL Register_AirlineStaff(?, ?, ?, ?, ?, ?);", [param("username"), param("airline_name"), param("pw"), param("first_name"), param("last_name"), param("dob")], generalQueryFunc);
				connection.unprepare("CALL Register_AirlineStaff(?, ?, ?, ?, ?, ?);");
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
