drop procedure GetPopFlights_3Month;
delimiter //
create procedure GetPopFlights_3Month(airline varchar(60))
begin
	SELECT airport.city, COUNT(*) AS tix
		FROM ticket
		LEFT JOIN flight
		ON ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND ticket.dep_datetime = flight.dep_datetime
		LEFT JOIN airport
			ON airport.name = flight.arr_airport_name
		WHERE ticket.airline_name = airline
			AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -3 MONTH)
			AND ticket.sold_date <= current_timestamp()
		GROUP BY airport.city
		ORDER BY tix DESC;
end //
delimiter ;

drop procedure GetPopFlights_Year;
delimiter //
create procedure GetPopFlights_Year(airline varchar(60))
begin
	SELECT airport.city, COUNT(*) AS tix
		FROM ticket
		LEFT JOIN flight
		ON ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND ticket.dep_datetime = flight.dep_datetime
		LEFT JOIN airport
			ON airport.name = flight.arr_airport_name
		WHERE ticket.airline_name = airline
			AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -1 YEAR)
			AND ticket.sold_date <= current_timestamp()
		GROUP BY airport.city
		ORDER BY tix DESC;
end //
delimiter ;

