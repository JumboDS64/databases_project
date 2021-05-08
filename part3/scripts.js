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

function request_getFlights() {
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
}


function request_getCheckValidSession() {
	return true;

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
			console.log(resJson); //will add barchart later
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
			console.log(resJson); //will add barchart later
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
			console.log(resJson); //will add chart later
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
			console.log(resJson); //will add chart later
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
	xhr.open("POST", "request?case=get_staf_CreateFlight&token="+staf_sesToken+"&username="+staf_username+"&baseprice="+encodeURIComponent(document.getElementById("staf_createflight_baseprice").value)+"&deploc="+encodeURIComponent(document.getElementById("staf_createflight_deploc").value)+"&depdate="+encodeURIComponent(document.getElementById("staf_createflight_depdate").value)+"&arrloc="+encodeURIComponent(document.getElementById("staf_createflight_arrloc").value)+"&arrdate="+encodeURIComponent(document.getElementById("staf_createflight_arrdate").value), true);
	xhr.send();
}

function writeStatusBar(text) {
	document.getElementById("statusBar").innerHTML = text;
}
 
 
function renderData_flights(json) {
	var tableBase = document.getElementById("theTable");
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
		var button_buyTix = document.createElement("button");
		button_buyTix.setAttribute("onclick", "cust_fillPurchaseTicketFields(\'"+json[i].flight_num+"\', \'"+json[i].airline_name+"\', \'"+correctTheDamnDateString(json[i].dep_datetime)+"\');");
		button_buyTix.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_buyTix);
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
		var button_buyTix = document.createElement("button");
		button_buyTix.setAttribute("onclick", "agen_fillPurchaseTicketFields(\'"+json[i].flight_num+"\', \'"+json[i].airline_name+"\', \'"+correctTheDamnDateString(json[i].dep_datetime)+"\');");
		button_buyTix.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_buyTix);
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
	//newRow.appendChild(create_simpleTableHeader(""));
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
		//var button_buyTix = document.createElement("button");
		//button_buyTix.setAttribute("onclick", "agen_fillPurchaseTicketFields(\'"+json[i].flight_num+"\', \'"+json[i].airline_name+"\', \'"+correctTheDamnDateString(json[i].dep_datetime)+"\');");
		//button_buyTix.appendChild(document.createTextNode("Select"));
		//newRow.appendChild(button_buyTix);
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
		var button_buyTix = document.createElement("button");
		button_buyTix.setAttribute("onclick", "cust_fillRateFlightFields(\'"+json[i].ticket_ID+"\');");
		button_buyTix.appendChild(document.createTextNode("Select"));
		newRow.appendChild(button_buyTix);
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