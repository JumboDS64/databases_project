drop procedure Staf_ViewFlightRatings;
delimiter //
create procedure Staf_ViewFlightRatings(token varchar(30), username varchar(60), flightnum varchar(60), depdate_string varchar(60))
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
		SELECT *
			FROM review
			LEFT JOIN ticket
				ON ticket.ticket_ID = review.ticket_ID
			LEFT JOIN flight
				ON flight.flight_num = ticket.flight_num
				AND flight.airline_name = ticket.airline_name
				AND flight.dep_datetime = ticket.dep_datetime
			WHERE flight.flight_num = flightnum
				AND flight.dep_datetime = timestamp(depdate_string)
				AND flight.airline_name = myAirline;
    END IF;
end //
delimiter ;