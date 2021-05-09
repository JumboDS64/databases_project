drop procedure LogIn_Agen;
delimiter //
create procedure LogIn_Agen(token varchar(30), id varchar(8), pw varchar(60))
begin
	DECLARE vtoken varchar(30);
    DECLARE vid varchar(8);
    SELECT token INTO vtoken;
	SELECT booking_agent.booking_agent_ID
    FROM booking_agent
    WHERE booking_agent.booking_agent_ID = id
		AND booking_agent.password = md5(pw)
	INTO vid;
    IF (vid IS NOT NULL) THEN
		IF (vtoken IS NULL) THEN
			SELECT SUBSTRING(MD5(RAND()) FROM 1 FOR 30) INTO vtoken;
			INSERT INTO session_token VALUES (vtoken, DATE_ADD(current_timestamp(), INTERVAL 4 HOUR));
		END IF;
		CALL EnsureTokenValidity(vtoken);
		IF vtoken IS NOT NULL THEN
			DELETE FROM booking_agent_session WHERE booking_agent_session.booking_agent_ID = vid;
			INSERT INTO booking_agent_session VALUES (vtoken, vid);
		END IF;
    END IF;
	SELECT vtoken;
end //
delimiter ;