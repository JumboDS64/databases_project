drop procedure Agen_GetTopCustomers_Commish;
delimiter //
create procedure Agen_GetTopCustomers_Commish(token varchar(30), id varchar(8))
begin
    DECLARE vid varchar(8);
    SELECT id INTO vid;
	CALL CheckForSession_Agen(token, vid);
    IF (vid IS NOT NULL) THEN
		SELECT ticket.customer_email, SUM(flight.base_price / 5) as sum_price -- let's assume agents earn 20% commision for every ticket they purchase
		FROM ticket
		LEFT JOIN flight
		ON flight.flight_num = ticket.flight_num
			AND flight.airline_name = ticket.airline_name
			AND flight.dep_datetime = ticket.dep_datetime
		WHERE ticket.booking_agent_ID = id
        AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -1 YEAR)
		GROUP BY ticket.customer_email
		ORDER BY sum_price DESC
		LIMIT 5;
	END IF;
end //
delimiter ;