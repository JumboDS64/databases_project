drop procedure Agen_ViewFlights;
delimiter //
create procedure Agen_ViewFlights(token varchar(30), id varchar(8))
begin
    DECLARE vid varchar(8);
    SELECT id INTO vid;
	CALL CheckForSession_Agen(token, vid);
    IF (vid IS NOT NULL) THEN
		SELECT ticket.ticket_ID, ticket.customer_email, ticket.sold_date, flight.*
		FROM ticket
		LEFT JOIN flight
			ON flight.flight_num = ticket.flight_num
            AND flight.airline_name = ticket.airline_name
            AND flight.dep_datetime = ticket.dep_datetime
		WHERE ticket.booking_agent_ID = vid
			AND ticket.dep_datetime >= current_timestamp();
	END IF;
end //
delimiter ;