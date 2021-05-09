drop procedure Staf_GetTopDestinations;
delimiter //
create procedure Staf_GetTopDestinations(token varchar(30), username varchar(60))
begin
    DECLARE vusername varchar(60);
    DECLARE myAirline varchar(60);
    SELECT username INTO vusername;
	CALL CheckForSession_Staf(token, vusername);
    IF (vusername IS NOT NULL) THEN
		SELECT airline_staff.airline_name
			FROM airline_staff
            WHERE airline_staff.username = username
            INTO myAirline;
		SELECT airport.city, COUNT(*) AS tix
			FROM ticket
			LEFT JOIN flight
			ON ticket.flight_num = flight.flight_num
				AND ticket.airline_name = flight.airline_name
				AND ticket.dep_datetime = flight.dep_datetime
			LEFT JOIN airport
				ON airport.name = flight.arr_airport_name
			WHERE ticket.airline_name = myAirline
				AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -3 MONTH)
				AND ticket.sold_date <= current_timestamp()
			GROUP BY airport.city
			ORDER BY tix DESC
			LIMIT 3;
		SELECT airport.city, COUNT(*) AS tix
			FROM ticket
			LEFT JOIN flight
			ON ticket.flight_num = flight.flight_num
				AND ticket.airline_name = flight.airline_name
				AND ticket.dep_datetime = flight.dep_datetime
			LEFT JOIN airport
				ON airport.name = flight.arr_airport_name
			WHERE ticket.airline_name = myAirline
				AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -1 YEAR)
				AND ticket.sold_date <= current_timestamp()
			GROUP BY airport.city
			ORDER BY tix DESC
			LIMIT 3;
	END IF;
end //
delimiter ;

