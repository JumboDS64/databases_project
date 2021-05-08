drop procedure Cust_ViewFlights;
delimiter //
create procedure Cust_ViewFlights(token varchar(30), email varchar(60))
begin
    DECLARE vemail varchar(60);
    SELECT email INTO vemail;
	CALL CheckForSession_Cust(token, vemail);
    IF (vemail IS NOT NULL) THEN
		SELECT ticket.ticket_ID, ticket.booking_agent_ID, ticket.sold_date, flight.*
		FROM ticket
		LEFT JOIN flight
			ON flight.flight_num = ticket.flight_num
            AND flight.airline_name = ticket.airline_name
            AND flight.dep_datetime = ticket.dep_datetime
		WHERE ticket.customer_email = vemail
			AND ticket.dep_datetime >= current_timestamp();
	END IF;
end //
delimiter ;