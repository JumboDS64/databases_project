drop procedure Staf_CreateAirport;
delimiter //
create procedure Staf_CreateAirport(token varchar(30), username varchar(60), name varchar(60), city varchar(60))
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
		INSERT
			INTO airport
            VALUES (name, city);
	END IF;
end //
delimiter ;