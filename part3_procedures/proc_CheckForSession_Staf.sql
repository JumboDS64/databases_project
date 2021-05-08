drop procedure CheckForSession_Staf;
delimiter //
create procedure CheckForSession_Staf(token varchar(30), inout username varchar(60))
begin
	DECLARE vtoken varchar(30);
    DECLARE vusername varchar(60);
    SELECT token INTO vtoken;
    SELECT null INTO vusername;
	CALL EnsureTokenValidity(vtoken);
    IF vtoken IS NOT NULL THEN
		SELECT airline_staff_session.airline_staff_username
        FROM airline_staff_session
        WHERE airline_staff_session.token = vtoken
			AND airline_staff_session.airline_staff_username = username
		INTO vusername;
    END IF;
    SELECT vusername INTO username;
end //
delimiter ;