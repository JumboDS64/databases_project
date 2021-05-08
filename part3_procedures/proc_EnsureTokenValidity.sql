drop procedure EnsureTokenValidity;
delimiter //
create procedure EnsureTokenValidity(inout id varchar(30))
begin
	DECLARE token_exists varchar(30);
	DECLARE token_valid varchar(30);
	SELECT token
		FROM session_token
		WHERE token = id
        INTO token_exists;
	SELECT token
		FROM session_token
		WHERE token = id
		AND expiration > current_timestamp()
        INTO token_valid;
	IF token_exists IS NOT NULL AND token_valid IS NULL THEN
		DELETE FROM customer_session WHERE token = id;
		DELETE FROM booking_agent_session WHERE token = id;
		DELETE FROM airline_staff_session WHERE token = id;
		DELETE FROM session_token WHERE token = id;
	END IF;
	SELECT token_valid INTO id;
end //
delimiter ;