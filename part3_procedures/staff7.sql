drop procedure Staf_CreateAirplane;
delimiter //
create procedure Staf_CreateAirplane(token varchar(30), username varchar(60), numseats numeric(4,0))
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
			INTO airplane
            VALUES (SUBSTRING(MD5(RAND()) FROM 1 FOR 8), myAirline, numseats);
	END IF;
end //
delimiter ;