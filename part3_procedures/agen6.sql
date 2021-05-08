drop procedure Agen_PurchaseTicket;
delimiter //
create procedure Agen_PurchaseTicket(token varchar(30), id varchar(8), email varchar(60), flightnum varchar(8), airline varchar(60), deptime varchar(60))
begin
    DECLARE vid varchar(60);
    DECLARE existing_ticket varchar(8);
    SELECT id INTO vid;
	CALL CheckForSession_Agen(token, vid);
    IF (vid IS NOT NULL) THEN
		SELECT ticket_ID
		FROM ticket
		WHERE ticket.customer_email = email
			AND ticket.flight_num = flightnum
			AND ticket.airline_name = airline
			AND ticket.dep_datetime = timestamp(deptime)
		INTO existing_ticket;
        IF (existing_ticket IS NOT NULL) THEN
			SELECT NULL INTO vid;
		ELSE
			INSERT
            INTO ticket
            VALUES (SUBSTRING(MD5(RAND()) FROM 1 FOR 8), email, id, current_timestamp(), flightnum, airline, timestamp(deptime));
        END IF;
	END IF;
    SELECT vid;
end //
delimiter ;