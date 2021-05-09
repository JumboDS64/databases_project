drop procedure Staf_GetCustFlights;
delimiter //
create procedure Staf_GetCustFlights(token varchar(30), username varchar(60), email varchar(60))
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
			FROM ticket
			LEFT JOIN flight
			ON ticket.flight_num = flight.flight_num
				AND ticket.airline_name = flight.airline_name
				AND ticket.dep_datetime = flight.dep_datetime
			WHERE ticket.airline_name = myAirline
				AND ticket.customer_email = email;
	END IF;
end //
delimiter ;