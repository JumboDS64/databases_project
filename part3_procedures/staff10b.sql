drop procedure Staf_GetTopAgen_Commish;
delimiter //
create procedure Staf_GetTopAgen_Commish(token varchar(30), username varchar(60))
begin
    DECLARE vusername varchar(60);
    DECLARE myAirline varchar(60);
    SELECT username INTO vusername;
	CALL CheckForSession_Staf(token, vusername);
    IF (vusername IS NOT NULL) THEN
		SELECT airline_staff.airline_name
			FROM airline_staff
            WHERE airline_staff.username = username
            INTO myAirline;
		SELECT ticket.booking_agent_ID, SUM(flight.base_price / 5) as sum_price -- let's assume agents earn 20% commision for every ticket they purchase
		FROM ticket
		LEFT JOIN flight
		ON ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND ticket.dep_datetime = flight.dep_datetime
		WHERE ticket.airline_name = myAirline
        AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -1 YEAR)
        AND ticket.booking_agent_ID IS NOT NULL
		GROUP BY ticket.booking_agent_ID
		ORDER BY sum_price DESC
		LIMIT 5;
	END IF;
end //
delimiter ;