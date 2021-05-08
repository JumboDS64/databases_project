drop procedure CheckForSession_Cust;
delimiter //
create procedure CheckForSession_Cust(token varchar(30), inout email varchar(60))
begin
	DECLARE vtoken varchar(30);
    DECLARE vemail varchar(60);
    SELECT token INTO vtoken;
    SELECT null INTO vemail;
	CALL EnsureTokenValidity(vtoken);
    IF vtoken IS NOT NULL THEN
		SELECT customer_session.customer_email
        FROM customer_session
        WHERE customer_session.token = vtoken
			AND customer_session.customer_email = email
		INTO vemail;
    END IF;
    SELECT vemail INTO email;
end //
delimiter ;