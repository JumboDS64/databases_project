drop procedure LogIn_Staf;
delimiter //
create procedure LogIn_Staf(token varchar(30), username varchar(60), pw varchar(60))
begin
	DECLARE vtoken varchar(30);
    DECLARE vusername varchar(60);
    SELECT token INTO vtoken;
	SELECT airline_staff.username
    FROM airline_staff
    WHERE airline_staff.username = username
		AND airline_staff.password = md5(pw)
	INTO vusername;
    IF (vusername IS NOT NULL) THEN
		IF (vtoken IS NULL) THEN
			SELECT SUBSTRING(MD5(RAND()) FROM 1 FOR 30) INTO vtoken;
			INSERT INTO session_token VALUES (vtoken, DATE_ADD(current_timestamp(), INTERVAL 4 HOUR));
		END IF;
		CALL EnsureTokenValidity(vtoken);
		IF vtoken IS NOT NULL THEN
			DELETE FROM airline_staff_session WHERE airline_staff_session.airline_staff_username = vusername;
			INSERT INTO airline_staff_session VALUES (vtoken, vusername);
		END IF;
    END IF;
	SELECT vtoken;
end //
delimiter ;