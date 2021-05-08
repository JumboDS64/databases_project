drop procedure Cust_RateFlight;
delimiter //
create procedure Cust_RateFlight(token varchar(30), email varchar(60), ticket_ID varchar(8), stars numeric(1,0), commentt varchar(280))
begin
    DECLARE vemail varchar(60);
    SELECT email INTO vemail;
	CALL CheckForSession_Cust(token, vemail);
    IF (vemail IS NOT NULL) THEN
		INSERT
        INTO review
        VALUES (ticket_ID, email, current_timestamp(), stars, commentt);
	END IF;
end //
delimiter ;