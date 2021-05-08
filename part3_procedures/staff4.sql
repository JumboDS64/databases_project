drop procedure Staf_ViewFlights;
delimiter //
create procedure Staf_ViewFlights(token varchar(30), username varchar(60), startdate_string varchar(60), enddate_string varchar(60))
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
        FROM flight
		WHERE flight.airline_name = myAirline
			AND flight.dep_datetime >= timestamp(startdate_string)
			AND flight.dep_datetime < timestamp(enddate_string);
	END IF;
end //
delimiter ;