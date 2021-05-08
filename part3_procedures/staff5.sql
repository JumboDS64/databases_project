drop procedure Staf_CreateFlight;
delimiter //
create procedure Staf_CreateFlight(token varchar(30), username varchar(60), baseprice numeric(6,2), deploc varchar(60), depdate_string varchar(60), arrloc varchar(60), arrdate_string varchar(60))
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
			INTO flight
            VALUES (SUBSTRING(MD5(RAND()) FROM 1 FOR 8), 'on-time', baseprice, myAirline, deploc, timestamp(depdate_string), arrloc, timestamp(arrdate_string));
	END IF;
end //
delimiter ;