drop procedure LogIn_Cust;
delimiter //
create procedure LogIn_Cust(token varchar(30), email varchar(60), pw varchar(60))
begin
	DECLARE vtoken varchar(30);
    DECLARE vemail varchar(60);
    SELECT token INTO vtoken;
	SELECT customer.email
    FROM customer
    WHERE customer.email = email
		AND customer.password = pw
	INTO vemail;
    IF (vemail IS NOT NULL) THEN
		IF (vtoken IS NULL) THEN
			SELECT SUBSTRING(MD5(RAND()) FROM 1 FOR 30) INTO vtoken;
			INSERT INTO session_token VALUES (vtoken, DATE_ADD(current_timestamp(), INTERVAL 4 HOUR));
		END IF;
		CALL EnsureTokenValidity(vtoken);
		IF vtoken IS NOT NULL THEN
			DELETE FROM customer_session WHERE customer_session.customer_email = vemail;
			INSERT INTO customer_session VALUES (vtoken, vemail);
		END IF;
    END IF;
	SELECT vtoken;
end //
delimiter ;