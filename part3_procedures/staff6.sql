drop procedure Staf_ChangeFlightStatus;
delimiter //
create procedure Staf_ChangeFlightStatus(token varchar(30), username varchar(60), status enum("on-time", "delayed"), flightnum varchar(60), depdate_string varchar(60))
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
		UPDATE flight
			SET flight.status = status
			WHERE flight.flight_num = flightnum
				AND flight.airline_name = myAirline
                AND flight.dep_datetime = timestamp(depdate_string);
    END IF;
end //
delimiter ;