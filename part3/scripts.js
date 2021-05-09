/**function myFunction() {
	console.log("Console message");
	document.getElementById("buto").innerHTML = "doondi";
	request_getFlights();
}**/
var cust_sesToken = null;
var cust_email = null;
var agen_sesToken = null;
var agen_id = null;
var staf_sesToken = null;
var staf_username = null;
/**addEventListener("beforeunload", function(event) {
	request_logOut_cust();
});**/
function init() {
	var datenow = new Date();
	document.getElementById("staf_viewflights_start").value = convertJSDateToSQL(correctTheDamnDate_toString(datenow));
	datenow.setDate(datenow.getDate() + 30);
	document.getElementById("staf_viewflights_end").value = convertJSDateToSQL(correctTheDamnDate_toString(datenow));
}

function toggleTab(tabName) {
	var allTabContents = document.getElementsByClassName("aTab");
	for(var i = 0; i < allTabContents.length; i++) {
		allTabContents[i].style.display = "none";
	}
	document.getElementById(tabName).style.display = "block";
}
function toggleTab_login(tabPrefix) {
	document.getElementById(tabPrefix + "_out").style.display = "none";
	document.getElementById(tabPrefix + "_in").style.display = "block";
}
function toggleTab_logout(tabPrefix) {
	document.getElementById(tabPrefix + "_out").style.display = "block";
	document.getElementById(tabPrefix + "_in").style.display = "none";
}

/*function request_getFlights() {
 	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			renderData_flights(resJson);
		}
	};
	document.getElementById("flightsTable").innerHTML = "Loading...";
	xhr.open("GET", "request?case=getFlights", true);
	xhr.send();
}*/
function request_gen_SearchFlights() {
 	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			renderData_flights_gen(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=get_gen_SearchFlights&deploc=" + encodeURIComponent(document.getElementById("gen_search_flights_deploc").value) + "&arrloc=" + encodeURIComponent(document.getElementById("gen_search_flights_arrloc").value), true);
	xhr.send();
}

function request_logIn(type) {
 	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			//console.log(resJson);
			if(type == 0) {
				cust_sesToken = resJson[0][0].vtoken;
				if(cust_sesToken != null) {
					writeStatusBar("Customer log-in successful!");
					toggleTab_login("tabCust");
				} else {
					writeStatusBar("Customer log-in failed.");
				}
			} else if(type == 1) {
				agen_sesToken = resJson[0][0].vtoken;
				if(agen_sesToken != null) {
					writeStatusBar("Booking agent log-in successful!");
					toggleTab_login("tabAgen");
				} else {
					writeStatusBar("Booking agent log-in failed.");
				}
			} else if(type == 2) {
				staf_sesToken = resJson[0][0].vtoken;
				if(staf_sesToken != null) {
					writeStatusBar("Airline staff log-in successful!");
					toggleTab_login("tabStaf");
				} else {
					writeStatusBar("Airline staff log-in failed.");
				}
			}
		}
	};
	var urlToken = "null";
	if(type == 0) {
		if(cust_sesToken != null) urlToken = cust_sesToken;
		cust_email = document.getElementById("login_cust_email").value;
		xhr.open("GET", "request?case=getLogIn&type=0&token=" + urlToken + "&key=" + encodeURIComponent(cust_email) + "&password=" + encodeURIComponent(document.getElementById("login_cust_pw").value), true);
	}
	else if(type == 1) {
		if(agen_sesToken != null) urlToken = agen_sesToken;
		agen_id = document.getElementById("login_agen_id").value;
		xhr.open("GET", "request?case=getLogIn&type=1&token=" + urlToken + "&key=" + encodeURIComponent(agen_id) + "&password=" + encodeURIComponent(document.getElementById("login_agen_pw").value), true);
	}
	else if(type == 2) {
		if(staf_sesToken != null) urlToken = staf_sesToken;
		staf_username = document.getElementById("login_staf_username").value;
		xhr.open("GET", "request?case=getLogIn&type=2&token=" + urlToken + "&key=" + encodeURIComponent(staf_username) + "&password=" + encodeURIComponent(document.getElementById("login_staf_pw").value), true);
	}
	xhr.send();
}
function request_logOut(type) {
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			if(type == 0) {
				cust_sesToken = null;
				toggleTab_logout("tabCust");
			} else if(type == 1) {
				agen_sesToken = null;
				toggleTab_logout("tabAgen");
			} else if(type == 2) {
				staf_sesToken = null;
				toggleTab_logout("tabStaf");
			}
		}
	};
	if(type == 0) {
		xhr.open("GET", "request?case=postLogOut&token="+cust_sesToken, true);
	} else if(type == 1) {
		xhr.open("GET", "request?case=postLogOut&token="+agen_sesToken, true);
	} else if(type == 2) {
		xhr.open("GET", "request?case=postLogOut&token="+staf_sesToken, true);
	}
	xhr.send();
}
function request_cust_register() {
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			writeStatusBar("Customer registered!");
		}
	};
	xhr.open("POST", "request?case=post_cust_register" + "&name=" + encodeURIComponent(document.getElementById("regi_cust_name").value) + "&email=" + encodeURIComponent(document.getElementById("regi_cust_email").value) + "&pw=" + encodeURIComponent(document.getElementById("regi_cust_pw").value) + "&addr_buildnum=" + encodeURIComponent(document.getElementById("regi_cust_addr_buildnum").value) + "&addr_street=" + encodeURIComponent(document.getElementById("regi_cust_addr_street").value) + "&addr_city=" + encodeURIComponent(document.getElementById("regi_cust_addr_city").value) + "&addr_state=" + encodeURIComponent(document.getElementById("regi_cust_addr_state").value) + "&phonenum=" + encodeURIComponent(document.getElementById("regi_cust_phonenum").value) + "&dob=" + encodeURIComponent(document.getElementById("regi_cust_dob").value), true);
	xhr.send();
}
function request_agen_register() {
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			writeStatusBar("Booking agent registered!");
		}
	};
	xhr.open("POST", "request?case=post_agen_register" + "&email=" + encodeURIComponent(document.getElementById("regi_agen_email").value) + "&pw=" + encodeURIComponent(document.getElementById("regi_agen_pw").value), true);
	xhr.send();
}
function request_staf_register() {
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			writeStatusBar("Airline staff registered!");
		}
	};
	xhr.open("POST", "request?case=post_staf_register" + "&username=" + encodeURIComponent(document.getElementById("regi_staf_username").value) + "&airline_name=" + encodeURIComponent(document.getElementById("regi_staf_airlinename").value) + "&pw=" + encodeURIComponent(document.getElementById("regi_staf_pw").value) + "&first_name=" + encodeURIComponent(document.getElementById("regi_staf_firstname").value) + "&last_name=" + encodeURIComponent(document.getElementById("regi_staf_lastname").value) + "&dob=" + encodeURIComponent(document.getElementById("regi_staf_dob").value), true);
	xhr.send();
}

function request_cust_ViewFlights() {
	if(cust_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			renderData_ticketflights_cust(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=get_cust_ViewFlights&token="+cust_sesToken+"&email="+cust_email, true);
	xhr.send();
}
function request_agen_ViewFlights() {
	if(agen_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			renderData_ticketflights_agen(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=get_agen_ViewFlights&token="+agen_sesToken+"&id="+agen_id, true);
	xhr.send();
}
function request_staf_ViewFlights() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			renderData_flights_staf(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=get_staf_ViewFlights&token="+staf_sesToken+"&username="+staf_username+"&startdate="+encodeURIComponent(document.getElementById("staf_viewflights_start").value)+"&enddate="+encodeURIComponent(document.getElementById("staf_viewflights_end").value), true);
	xhr.send();
}
/**function request_staf_GetRevenue() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson); //chart later
			
		}
	};
	xhr.open("GET", "request?case=get_staf_GetRevenue&token="+staf_sesToken+"&username="+staf_username+"&startdate="+encodeURIComponent(document.getElementById("staf_viewflights_start").value)+"&enddate="+encodeURIComponent(document.getElementById("staf_viewflights_end").value), true);
	xhr.send();
}**/
function request_staf_GetRevenue_byMonth() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			var nuJson = {
				title: {
					text: "Revenue by month (total = " + resJson[1][0].total_rev + ")"
				},
				axisY:{
					minimum: 0
				},
				data: [
					{
						type: "column",
						dataPoints: [
						]
					}
				]
			};
			for(var i = 0; i < resJson[0].length; i++) {
				nuJson.data[0].dataPoints.push({ label: resJson[0][i].mon, y: resJson[0][i].rev });
			}
			var chart = new CanvasJS.Chart("stafChart", nuJson);
			chart.render();
		}
	};
	xhr.open("GET", "request?case=get_staf_GetRevenue_byMonth&token="+staf_sesToken+"&username="+staf_username+"&startdate="+encodeURIComponent(document.getElementById("staf_viewflights_start").value)+"&enddate="+encodeURIComponent(document.getElementById("staf_viewflights_end").value), true);
	xhr.send();
}
function request_staf_GetRevenue_byType() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			var nuJson = {
				title: {
					text: "Revenue in the past month"
				},
				data: [
					{
						type: "pie",
						dataPoints: [
							{ label: "Direct", y: resJson[0][0].rev_direct_month },
							{ label: "Indirect", y: resJson[0][0].rev_indirect_month }
						]
					}
				]
			};
			var chart = new CanvasJS.Chart("stafChart", nuJson);
			chart.render();
			nuJson = {
				title: {
					text: "Revenue in the past year"
				},
				data: [
					{
						type: "pie",
						dataPoints: [
							{ label: "Direct", y: resJson[0][0].rev_direct_year },
							{ label: "Indirect", y: resJson[0][0].rev_indirect_year }
						]
					}
				]
			};
			var chart = new CanvasJS.Chart("stafChart2", nuJson);
			chart.render();
		}
	};
	xhr.open("GET", "request?case=get_staf_GetRevenue_byType&token="+staf_sesToken+"&username="+staf_username, true);
	xhr.send();
}
function request_staf_GetTopDestinations() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			var nuJson = {
				title: {
					text: "Top 3 destinations in the past 3 months"
				},
				axisY:{
					minimum: 0
				},
				data: [
					{
						type: "column",
						dataPoints: [
						]
					}
				]
			};
			for(var i = 0; i < resJson[0].length; i++) {
				nuJson.data[0].dataPoints.push({ label: resJson[0][i].city, y: resJson[0][i].tix });
			}
			var chart = new CanvasJS.Chart("stafChart", nuJson);
			chart.render();
			nuJson = {
				title: {
					text: "Top 3 destinations in the past year"
				},
				axisY:{
					minimum: 0
				},
				data: [
					{
						type: "column",
						dataPoints: [
						]
					}
				]
			};
			for(var i = 0; i < resJson[0].length; i++) {
				nuJson.data[0].dataPoints.push({ label: resJson[0][i].city, y: resJson[0][i].tix });
			}
			var chart = new CanvasJS.Chart("stafChart2", nuJson);
			chart.render();
		}
	};
	xhr.open("GET", "request?case=get_staf_GetTopDestinations&token="+staf_sesToken+"&username="+staf_username, true);
	xhr.send();
}
function request_cust_SearchFlights() {
	if(cust_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			renderData_flights_cust(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=get_cust_SearchFlights&token="+cust_sesToken+"&email="+cust_email+"&deploc="+encodeURIComponent(document.getElementById("cust_search_flights_deploc").value)+"&depdate="+encodeURIComponent(document.getElementById("cust_search_flights_depdate").value)+"&arrloc="+encodeURIComponent(document.getElementById("cust_search_flights_arrloc").value)+"&arrdate="+encodeURIComponent(document.getElementById("cust_search_flights_arrdate").value), true);
	xhr.send();
}
function request_agen_SearchFlights() {
	if(agen_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			renderData_flights_agen(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=get_agen_SearchFlights&token="+agen_sesToken+"&id="+agen_id+"&deploc="+encodeURIComponent(document.getElementById("agen_search_flights_deploc").value)+"&depdate="+encodeURIComponent(document.getElementById("agen_search_flights_depdate").value)+"&arrloc="+encodeURIComponent(document.getElementById("agen_search_flights_arrloc").value)+"&arrdate="+encodeURIComponent(document.getElementById("agen_search_flights_arrdate").value), true);
	xhr.send();
}
function cust_fillPurchaseTicketFields(flightnum, airline, deptime) {
	document.getElementById("cust_purchase_ticket_flightnum").value = flightnum;
	document.getElementById("cust_purchase_ticket_airline").value = airline;
	document.getElementById("cust_purchase_ticket_deptime").value = convertJSDateToSQL(deptime);
}
function agen_fillPurchaseTicketFields(flightnum, airline, deptime) {
	document.getElementById("agen_purchase_ticket_flightnum").value = flightnum;
	document.getElementById("agen_purchase_ticket_airline").value = airline;
	document.getElementById("agen_purchase_ticket_deptime").value = convertJSDateToSQL(deptime);
}
function cust_fillRateFlightFields(ticket_ID, flightnum, airline, deptime) {
	document.getElementById("cust_rateFlight_ticketID").value = ticket_ID;
}

function convertJSDateToSQL(date) {
	return date.substring(0, 10)+" "+date.substring(11, 19);
}
function request_cust_PurchaseTicket() {
	if(cust_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			writeStatusBar("Purchase successful!");
		}
	};
	xhr.open("POST", "request?case=post_cust_PurchaseTicket&token="+cust_sesToken+"&email="+cust_email+"&flightnum="+encodeURIComponent(document.getElementById("cust_purchase_ticket_flightnum").value)+"&airline="+encodeURIComponent(document.getElementById("cust_purchase_ticket_airline").value)+"&deptime="+encodeURIComponent(document.getElementById("cust_purchase_ticket_deptime").value), true);
	xhr.send();
}
function request_agen_PurchaseTicket() {
	if(agen_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			writeStatusBar("Purchase successful!");
		}
	};
	xhr.open("POST", "request?case=post_agen_PurchaseTicket&token="+agen_sesToken+"&id="+agen_id+"&email="+encodeURIComponent(document.getElementById("agen_purchase_ticket_email").value)+"&flightnum="+encodeURIComponent(document.getElementById("agen_purchase_ticket_flightnum").value)+"&airline="+encodeURIComponent(document.getElementById("agen_purchase_ticket_airline").value)+"&deptime="+encodeURIComponent(document.getElementById("agen_purchase_ticket_deptime").value), true);
	xhr.send();
}
function request_cust_RateFlight() {
	if(cust_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
		}
	};
	xhr.open("POST", "request?case=post_cust_RateFlight&token="+cust_sesToken+"&email="+cust_email+"&ticketID="+encodeURIComponent(document.getElementById("cust_rateFlight_ticketID").value)+"&rating="+encodeURIComponent(document.getElementById("cust_rateFlight_rating").value)+"&comment="+encodeURIComponent(document.getElementById("cust_rateFlight_comment").value), true);
	xhr.send();
}
function request_cust_TrackSpending() {
	if(cust_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			var nuJson = {
				title: {
					text: "Spending by month"
				},
				axisY:{
					minimum: 0
				},
				data: [
					{
						type: "column",
						dataPoints: [
						]
					}
				]
			};
			for(var i = 0; i < resJson[0].length; i++) {
				nuJson.data[0].dataPoints.push({ label: resJson[0][i].mon, y: resJson[0][i].spent });
			}
			var chart = new CanvasJS.Chart("custChart", nuJson);
			chart.render();
		}
	};
	xhr.open("GET", "request?case=get_cust_TrackSpending&token="+cust_sesToken+"&email="+cust_email+"&startdate="+encodeURIComponent(document.getElementById("cust_trackspending_start").value)+"&enddate="+encodeURIComponent(document.getElementById("cust_trackspending_end").value), true);
	xhr.send();
}
function request_agen_TrackSpending() {
	if(agen_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			var nuJson = {
				title: {
					text: "Commission by month"
				},
				axisY:{
					minimum: 0
				},
				data: [
					{
						type: "column",
						dataPoints: [
						]
					}
				]
			};
			for(var i = 0; i < resJson[0].length; i++) {
				nuJson.data[0].dataPoints.push({ label: resJson[0][i].mon, y: resJson[0][i].rev });
			}
			var chart = new CanvasJS.Chart("agenChart", nuJson);
			chart.render();
		}
	};
	xhr.open("GET", "request?case=get_agen_TrackSpending&token="+agen_sesToken+"&id="+agen_id+"&startdate="+encodeURIComponent(document.getElementById("agen_trackspending_start").value)+"&enddate="+encodeURIComponent(document.getElementById("agen_trackspending_start").value), true);
	xhr.send();
}
function request_agen_GetTopCustomers_Tix() {
	if(agen_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			var nuJson = {
				title: {
					text: "Top 5 customers by tickets bought"
				},
				axisY:{
					minimum: 0
				},
				data: [
					{
						type: "column",
						dataPoints: [
						]
					}
				]
			};
			for(var i = 0; i < resJson[0].length; i++) {
				nuJson.data[0].dataPoints.push({ label: resJson[0][i].customer_email, y: resJson[0][i].sum_tickets });
			}
			var chart = new CanvasJS.Chart("agenChart", nuJson);
			chart.render();
		}
	};
	xhr.open("GET", "request?case=get_agen_GetTopCustomers_Tix&token="+agen_sesToken+"&id="+agen_id, true);
	xhr.send();
}
function request_agen_GetTopCustomers_Commish() {
	if(agen_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			var nuJson = {
				title: {
					text: "Top 5 customers by commission earned from"
				},
				axisY:{
					minimum: 0
				},
				data: [
					{
						type: "column",
						dataPoints: [
						]
					}
				]
			};
			for(var i = 0; i < resJson[0].length; i++) {
				nuJson.data[0].dataPoints.push({ label: resJson[0][i].customer_email, y: resJson[0][i].sum_price });
			}
			var chart = new CanvasJS.Chart("agenChart", nuJson);
			chart.render();
		}
	};
	xhr.open("GET", "request?case=get_agen_GetTopCustomers_Commish&token="+agen_sesToken+"&id="+agen_id, true);
	xhr.send();
}
function request_staf_CreateFlight() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
		}
	};
	xhr.open("POST", "request?case=post_staf_CreateFlight&token="+staf_sesToken+"&username="+staf_username+"&baseprice="+encodeURIComponent(document.getElementById("staf_createflight_baseprice").value)+"&deploc="+encodeURIComponent(document.getElementById("staf_createflight_deploc").value)+"&depdate="+encodeURIComponent(document.getElementById("staf_createflight_depdate").value)+"&arrloc="+encodeURIComponent(document.getElementById("staf_createflight_arrloc").value)+"&arrdate="+encodeURIComponent(document.getElementById("staf_createflight_arrdate").value), true);
	xhr.send();
}
function request_staf_ChangeFlightStatus() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
		}
	};
	xhr.open("POST", "request?case=post_staf_ChangeFlightStatus&token="+staf_sesToken+"&username="+staf_username+"&status="+encodeURIComponent(document.getElementById("staf_changeflightstatus_status").value)+"&flightnum="+encodeURIComponent(document.getElementById("staf_changeflightstatus_flightnum").value)+"&deptime="+encodeURIComponent(document.getElementById("staf_changeflightstatus_deptime").value), true);
	xhr.send();
}
function staf_fillChangeFlightFields(flightnum, deptime) {
	document.getElementById("staf_changeflightstatus_flightnum").value = flightnum;
	document.getElementById("staf_changeflightstatus_deptime").value = convertJSDateToSQL(deptime);
	document.getElementById("staf_viewflightreviews_flightnum").value = flightnum;
	document.getElementById("staf_viewflightreviews_deptime").value = convertJSDateToSQL(deptime);
}
function request_staf_CreateAirplane() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
		}
	};
	xhr.open("POST", "request?case=post_staf_CreateAirplane&token="+staf_sesToken+"&username="+staf_username+"&status="+encodeURIComponent(document.getElementById("staf_changeflightstatus_status").value)+"&numseats="+encodeURIComponent(document.getElementById("staf_createairplane_numseats").value), true);
	xhr.send();
}
function request_staf_CreateAirport() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
		}
	};
	xhr.open("POST", "request?case=post_staf_CreateAirport&token="+staf_sesToken+"&username="+staf_username+"&name="+encodeURIComponent(document.getElementById("staf_createairport_name").value)+"&city="+encodeURIComponent(document.getElementById("staf_createairport_city").value), true);
	xhr.send();
}
function request_staf_ViewFlightReviews() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			renderData_flightReviews_staf(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=post_staf_ViewFlightReviews&token="+staf_sesToken+"&username="+staf_username+"&flightnum="+encodeURIComponent(document.getElementById("staf_viewflightreviews_flightnum").value)+"&deptime="+encodeURIComponent(document.getElementById("staf_viewflightreviews_deptime").value), true);
	xhr.send();
}
function request_staf_GetAgen_Tix() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			var nuJson = {
				title: {
					text: "Top 5 booking agents by tickets sold"
				},
				axisY:{
					minimum: 0
				},
				data: [
					{
						type: "column",
						dataPoints: [
						]
					}
				]
			};
			for(var i = 0; i < resJson[0].length; i++) {
				nuJson.data[0].dataPoints.push({ label: resJson[0][i].booking_agent_ID, y: resJson[0][i].sum_tickets });
			}
			var chart = new CanvasJS.Chart("stafChart", nuJson);
			chart.render();
		}
	};
	xhr.open("GET", "request?case=get_staf_GetAgen_Tix&token="+staf_sesToken+"&username="+staf_username, true);
	xhr.send();
}
function request_staf_GetAgen_Commish() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			var nuJson = {
				title: {
					text: "Top 5 booking agents by commission earned"
				},
				axisY:{
					minimum: 0
				},
				data: [
					{
						type: "column",
						dataPoints: [
						]
					}
				]
			};
			for(var i = 0; i < resJson[0].length; i++) {
				nuJson.data[0].dataPoints.push({ label: resJson[0][i].booking_agent_ID, y: resJson[0][i].sum_price });
			}
			var chart = new CanvasJS.Chart("stafChart", nuJson);
			chart.render();
		}
	};
	xhr.open("GET", "request?case=get_staf_GetAgen_Commish&token="+staf_sesToken+"&username="+staf_username, true);
	xhr.send();
}
function request_staf_GetTopCustomers() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			renderData_customersByTix_staf(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=get_staf_GetTopCustomers&token="+staf_sesToken+"&username="+staf_username, true);
	xhr.send();
}
function request_staf_GetCustomers() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			renderData_customers_staf(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=get_staf_GetCustomers&token="+staf_sesToken+"&username="+staf_username, true);
	xhr.send();
}
function request_staf_GetCustFlights() {
	if(staf_sesToken == null) return; //poo
	let xhr = new XMLHttpRequest();
 	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var resJson = JSON.parse(this.response);
			console.log(resJson);
			renderData_ticketflights_staf(resJson[0]);
		}
	};
	xhr.open("GET", "request?case=get_staf_GetCustFlights&token="+staf_sesToken+"&username="+staf_username+"&email="+encodeURIComponent(document.getElementById("staf_viewcustomerflights_email").value), true);
	xhr.send();
}
function staf_fillCustFlightsField(email) {
	document.getElementById("staf_viewcustomerflights_email").value = email;
}

function writeStatusBar(text) {
	document.getElementById("statusBar").innerHTML = text;
}
 
 
function renderData_flights_gen(json) {
	var tableBase = document.getElementById("genTable");
	tableBase.innerHTML = "";
	//document.getElementById("buto").innerHTML = json[0].flight_num;
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader("Flight #"));
	newRow.appendChild(create_simpleTableHeader("Status"));
	newRow.appendChild(create_simpleTableHeader("Base Price"));
	newRow.appendChild(create_simpleTableHeader("Airline"));
	newRow.appendChild(create_simpleTableHeader("Departure Loc."));
	newRow.appendChild(create_simpleTableHeader("Departure Time"));
	newRow.appendChild(create_simpleTableHeader("Arrival Loc."));
	newRow.appendChild(create_simpleTableHeader("Arrival Time"));
	tableBase.appendChild(newRow);
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		newRow.appendChild(create_simpleTableBox(json[i].flight_num));
		newRow.appendChild(create_simpleTableBox(json[i].status));
		newRow.appendChild(create_simpleTableBox(json[i].base_price));
		newRow.appendChild(create_simpleTableBox(json[i].airline_name));
		newRow.appendChild(create_simpleTableBox(json[i].dep_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].dep_datetime)));
		newRow.appendChild(create_simpleTableBox(json[i].arr_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].arr_datetime)));
		tableBase.appendChild(newRow);
	}
}
function renderData_flights_cust(json) {
	var tableBase = document.getElementById("custTable");
	tableBase.innerHTML = "";
	//document.getElementById("buto").innerHTML = json[0].flight_num;
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader(""));
	newRow.appendChild(create_simpleTableHeader("Flight #"));
	newRow.appendChild(create_simpleTableHeader("Status"));
	newRow.appendChild(create_simpleTableHeader("Base Price"));
	newRow.appendChild(create_simpleTableHeader("Airline"));
	newRow.appendChild(create_simpleTableHeader("Departure Loc."));
	newRow.appendChild(create_simpleTableHeader("Departure Time"));
	newRow.appendChild(create_simpleTableHeader("Arrival Loc."));
	newRow.appendChild(create_simpleTableHeader("Arrival Time"));
	tableBase.appendChild(newRow);
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		var button_select = document.createElement("button");
		button_select.setAttribute("onclick", "cust_fillPurchaseTicketFields(\'"+json[i].flight_num+"\', \'"+json[i].airline_name+"\', \'"+correctTheDamnDateString(json[i].dep_datetime)+"\');");
		button_select.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_select);
		newRow.appendChild(create_simpleTableBox(json[i].flight_num));
		newRow.appendChild(create_simpleTableBox(json[i].status));
		newRow.appendChild(create_simpleTableBox(json[i].base_price));
		newRow.appendChild(create_simpleTableBox(json[i].airline_name));
		newRow.appendChild(create_simpleTableBox(json[i].dep_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].dep_datetime)));
		newRow.appendChild(create_simpleTableBox(json[i].arr_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].arr_datetime)));
		tableBase.appendChild(newRow);
	}
}
function renderData_flights_agen(json) {
	var tableBase = document.getElementById("agenTable");
	tableBase.innerHTML = "";
	//document.getElementById("buto").innerHTML = json[0].flight_num;
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader(""));
	newRow.appendChild(create_simpleTableHeader("Flight #"));
	newRow.appendChild(create_simpleTableHeader("Status"));
	newRow.appendChild(create_simpleTableHeader("Base Price"));
	newRow.appendChild(create_simpleTableHeader("Airline"));
	newRow.appendChild(create_simpleTableHeader("Departure Loc."));
	newRow.appendChild(create_simpleTableHeader("Departure Time"));
	newRow.appendChild(create_simpleTableHeader("Arrival Loc."));
	newRow.appendChild(create_simpleTableHeader("Arrival Time"));
	tableBase.appendChild(newRow);
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		var button_select = document.createElement("button");
		button_select.setAttribute("onclick", "agen_fillPurchaseTicketFields(\'"+json[i].flight_num+"\', \'"+json[i].airline_name+"\', \'"+correctTheDamnDateString(json[i].dep_datetime)+"\');");
		button_select.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_select);
		newRow.appendChild(create_simpleTableBox(json[i].flight_num));
		newRow.appendChild(create_simpleTableBox(json[i].status));
		newRow.appendChild(create_simpleTableBox(json[i].base_price));
		newRow.appendChild(create_simpleTableBox(json[i].airline_name));
		newRow.appendChild(create_simpleTableBox(json[i].dep_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].dep_datetime)));
		newRow.appendChild(create_simpleTableBox(json[i].arr_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].arr_datetime)));
		tableBase.appendChild(newRow);
	}
}
function renderData_flights_staf(json) {
	var tableBase = document.getElementById("stafTable");
	tableBase.innerHTML = "";
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader(""));
	newRow.appendChild(create_simpleTableHeader("Flight #"));
	newRow.appendChild(create_simpleTableHeader("Status"));
	newRow.appendChild(create_simpleTableHeader("Base Price"));
	newRow.appendChild(create_simpleTableHeader("Departure Loc."));
	newRow.appendChild(create_simpleTableHeader("Departure Time"));
	newRow.appendChild(create_simpleTableHeader("Arrival Loc."));
	newRow.appendChild(create_simpleTableHeader("Arrival Time"));
	tableBase.appendChild(newRow);
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		var button_select = document.createElement("button");
		button_select.setAttribute("onclick", "staf_fillChangeFlightFields(\'"+json[i].flight_num+"\', \'"+correctTheDamnDateString(json[i].dep_datetime)+"\');");
		button_select.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_select);
		newRow.appendChild(create_simpleTableBox(json[i].flight_num));
		newRow.appendChild(create_simpleTableBox(json[i].status));
		newRow.appendChild(create_simpleTableBox(json[i].base_price));
		newRow.appendChild(create_simpleTableBox(json[i].dep_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].dep_datetime)));
		newRow.appendChild(create_simpleTableBox(json[i].arr_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].arr_datetime)));
		tableBase.appendChild(newRow);
	}
}
function renderData_ticketflights_cust(json) {
	var tableBase = document.getElementById("custTable");
	tableBase.innerHTML = "";
	//document.getElementById("buto").innerHTML = json[0].flight_num;
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader(""));
	newRow.appendChild(create_simpleTableHeader("Booking Agent"));
	newRow.appendChild(create_simpleTableHeader("Purchase Date"));
	newRow.appendChild(create_simpleTableHeader("Flight #"));
	newRow.appendChild(create_simpleTableHeader("Status"));
	newRow.appendChild(create_simpleTableHeader("Base Price"));
	newRow.appendChild(create_simpleTableHeader("Airline"));
	newRow.appendChild(create_simpleTableHeader("Departure Loc."));
	newRow.appendChild(create_simpleTableHeader("Departure Time"));
	newRow.appendChild(create_simpleTableHeader("Arrival Loc."));
	newRow.appendChild(create_simpleTableHeader("Arrival Time"));
	tableBase.appendChild(newRow);
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		var button_select = document.createElement("button");
		button_select.setAttribute("onclick", "cust_fillRateFlightFields(\'"+json[i].ticket_ID+"\');");
		button_select.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_select);
		newRow.appendChild(create_simpleTableBox(json[i].booking_agent_ID));
		newRow.appendChild(create_simpleTableBox(json[i].sold_date));
		newRow.appendChild(create_simpleTableBox(json[i].flight_num));
		newRow.appendChild(create_simpleTableBox(json[i].status));
		newRow.appendChild(create_simpleTableBox(json[i].base_price));
		newRow.appendChild(create_simpleTableBox(json[i].airline_name));
		newRow.appendChild(create_simpleTableBox(json[i].dep_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].dep_datetime)));
		newRow.appendChild(create_simpleTableBox(json[i].arr_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].arr_datetime)));
		tableBase.appendChild(newRow);
	}
}
function renderData_ticketflights_agen(json) {
	var tableBase = document.getElementById("agenTable");
	tableBase.innerHTML = "";
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader("Customer"));
	newRow.appendChild(create_simpleTableHeader("Purchase Date"));
	newRow.appendChild(create_simpleTableHeader("Flight #"));
	newRow.appendChild(create_simpleTableHeader("Status"));
	newRow.appendChild(create_simpleTableHeader("Base Price"));
	newRow.appendChild(create_simpleTableHeader("Airline"));
	newRow.appendChild(create_simpleTableHeader("Departure Loc."));
	newRow.appendChild(create_simpleTableHeader("Departure Time"));
	newRow.appendChild(create_simpleTableHeader("Arrival Loc."));
	newRow.appendChild(create_simpleTableHeader("Arrival Time"));
	tableBase.appendChild(newRow);
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		newRow.appendChild(create_simpleTableBox(json[i].customer_email));
		newRow.appendChild(create_simpleTableBox(json[i].sold_date));
		newRow.appendChild(create_simpleTableBox(json[i].flight_num));
		newRow.appendChild(create_simpleTableBox(json[i].status));
		newRow.appendChild(create_simpleTableBox(json[i].base_price));
		newRow.appendChild(create_simpleTableBox(json[i].airline_name));
		newRow.appendChild(create_simpleTableBox(json[i].dep_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].dep_datetime)));
		newRow.appendChild(create_simpleTableBox(json[i].arr_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].arr_datetime)));
		tableBase.appendChild(newRow);
	}
}
function renderData_ticketflights_staf(json) {
	var tableBase = document.getElementById("stafTable");
	tableBase.innerHTML = "";
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader(""));
	newRow.appendChild(create_simpleTableHeader("Customer"));
	newRow.appendChild(create_simpleTableHeader("Purchase Date"));
	newRow.appendChild(create_simpleTableHeader("Flight #"));
	newRow.appendChild(create_simpleTableHeader("Status"));
	newRow.appendChild(create_simpleTableHeader("Base Price"));
	newRow.appendChild(create_simpleTableHeader("Airline"));
	newRow.appendChild(create_simpleTableHeader("Departure Loc."));
	newRow.appendChild(create_simpleTableHeader("Departure Time"));
	newRow.appendChild(create_simpleTableHeader("Arrival Loc."));
	newRow.appendChild(create_simpleTableHeader("Arrival Time"));
	tableBase.appendChild(newRow);
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		var button_select = document.createElement("button");
		button_select.setAttribute("onclick", "staf_fillChangeFlightFields(\'"+json[i].flight_num+"\', \'"+correctTheDamnDateString(json[i].dep_datetime)+"\');");
		button_select.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_select);
		newRow.appendChild(create_simpleTableBox(json[i].customer_email));
		newRow.appendChild(create_simpleTableBox(json[i].sold_date));
		newRow.appendChild(create_simpleTableBox(json[i].flight_num));
		newRow.appendChild(create_simpleTableBox(json[i].status));
		newRow.appendChild(create_simpleTableBox(json[i].base_price));
		newRow.appendChild(create_simpleTableBox(json[i].airline_name));
		newRow.appendChild(create_simpleTableBox(json[i].dep_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].dep_datetime)));
		newRow.appendChild(create_simpleTableBox(json[i].arr_airport_name));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].arr_datetime)));
		tableBase.appendChild(newRow);
	}
}
function renderData_flightReviews_staf(json) {
	var tableBase = document.getElementById("stafTable");
	tableBase.innerHTML = "";
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader("Customer"));
	newRow.appendChild(create_simpleTableHeader("Review Date"));
	newRow.appendChild(create_simpleTableHeader("Rating (0-9)"));
	newRow.appendChild(create_simpleTableHeader("Comment"));
	tableBase.appendChild(newRow);
	var avrage = 0;
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		newRow.appendChild(create_simpleTableBox(json[i].customer_email));
		newRow.appendChild(create_simpleTableBox(correctTheDamnDateString(json[i].publish_date)));
		newRow.appendChild(create_simpleTableBox(json[i].stars));
		newRow.appendChild(create_simpleTableBox(json[i].comment));
		tableBase.appendChild(newRow);
		avrage += json[i].stars;
	}
	avrage /= json.length;
	newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableBox("Average rating:"));
	newRow.appendChild(create_simpleTableBox(""));
	newRow.appendChild(create_simpleTableBox(avrage));
	newRow.appendChild(create_simpleTableBox(""));
	tableBase.appendChild(newRow);
}
function renderData_customers_staf(json) {
	var tableBase = document.getElementById("stafTable");
	tableBase.innerHTML = "";
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader(""));
	newRow.appendChild(create_simpleTableHeader("Name"));
	newRow.appendChild(create_simpleTableHeader("Email"));
	tableBase.appendChild(newRow);
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		var button_select = document.createElement("button");
		button_select.setAttribute("onclick", "staf_fillCustFlightsField(\'"+json[i].email+"\');");
		button_select.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_select);
		newRow.appendChild(create_simpleTableBox(json[i].name));
		newRow.appendChild(create_simpleTableBox(json[i].email));
		tableBase.appendChild(newRow);
	}
}
function renderData_customersByTix_staf(json) {
	var tableBase = document.getElementById("stafTable");
	tableBase.innerHTML = "";
	var newRow = document.createElement("tr");
	newRow.setAttribute("class", "tableN_row");
	newRow.appendChild(create_simpleTableHeader(""));
	newRow.appendChild(create_simpleTableHeader("Name"));
	newRow.appendChild(create_simpleTableHeader("Email"));
	newRow.appendChild(create_simpleTableHeader("Tickets sold"));
	tableBase.appendChild(newRow);
	for(i in json) {
		newRow = document.createElement("tr");
		newRow.setAttribute("class", "tableN_row");
		var button_select = document.createElement("button");
		button_select.setAttribute("onclick", "staf_fillCustFlightsField(\'"+json[i].email+"\');");
		button_select.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_select);
		newRow.appendChild(create_simpleTableBox(json[i].name));
		newRow.appendChild(create_simpleTableBox(json[i].email));
		newRow.appendChild(create_simpleTableBox(json[i].sum_tickets));
		tableBase.appendChild(newRow);
	}
}
function correctTheDamnDateString(string) {
	var d1 = new Date(string);
	d1.setHours(d1.getHours() - 4); //uncorrect automatic timezone correction
	return JSON.stringify(d1).substring(1,25);
}
function correctTheDamnDate_toString(date) {
	var d1 = date;
	d1.setHours(d1.getHours() - 4); //uncorrect automatic timezone correction
	return JSON.stringify(d1).substring(1,25);
}

function create_simpleTableHeader(text) {
	var out = document.createElement("th");
	out.setAttribute("class", "tableN_elem");
	out.appendChild(document.createTextNode(text));
	return out;
}
function create_simpleTableBox(text) {
	var out = document.createElement("td");
	out.setAttribute("class", "tableN_elem");
	out.appendChild(document.createTextNode(text));
	return out;
}