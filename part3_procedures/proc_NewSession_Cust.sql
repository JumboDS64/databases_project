drop procedure NewSession_Cust;
delimiter //
create procedure NewSession_Cust(token varchar(30), email varchar(60)) -- deprecated
begin
	CALL EnsureTokenValidity(token);
    IF token IS NOT NULL THEN
		DELETE FROM customer_session WHERE customer_session.customer_email = email;
        INSERT INTO customer_session VALUES (token, email);
	END IF;
    SELECT token;
end //
delimiter ;