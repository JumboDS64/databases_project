drop procedure Cust_PurchaseTicket;
delimiter //
create procedure Cust_PurchaseTicket(token varchar(30), email varchar(60), flightnum varchar(8), airline varchar(60), deptime varchar(60))
begin
    DECLARE vemail varchar(60);
    DECLARE existing_ticket varchar(8);
    SELECT email INTO vemail;
	CALL CheckForSession_Cust(token, vemail);
    IF (vemail IS NOT NULL) THEN
		SELECT ticket_ID
		FROM ticket
		WHERE ticket.customer_email = email
			AND ticket.flight_num = flightnum
			AND ticket.airline_name = airline
			AND ticket.dep_datetime = timestamp(deptime)
		INTO existing_ticket;
        IF (existing_ticket IS NOT NULL) THEN
			SELECT NULL INTO vemail;
		ELSE
			INSERT
            INTO ticket
            VALUES (SUBSTRING(MD5(RAND()) FROM 1 FOR 8), email, null, current_timestamp(), flightnum, airline, timestamp(deptime));
        END IF;
	END IF;
    SELECT vemail;
end //
delimiter ;