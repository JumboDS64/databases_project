drop procedure Agen_GetTopCustomers_Tix;
delimiter //
create procedure Agen_GetTopCustomers_Tix(token varchar(30), id varchar(8))
begin
    DECLARE vid varchar(8);
    SELECT id INTO vid;
	CALL CheckForSession_Agen(token, vid);
    IF (vid IS NOT NULL) THEN
		SELECT ticket.customer_email, COUNT(*) -- let's assume agents earn 20% commision for every ticket they purchase
		FROM ticket
		LEFT JOIN flight
		ON ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND ticket.dep_datetime = flight.dep_datetime
		WHERE ticket.booking_agent_ID = id
        AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -6 MONTH)
		GROUP BY ticket.customer_email;
	END IF;
end //
delimiter ;