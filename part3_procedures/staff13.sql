drop procedure Staf_GetRevenue_byType;
delimiter //
create procedure Staf_GetRevenue_byType(token varchar(30), username varchar(60))
begin
    DECLARE vusername varchar(60);
    DECLARE myAirline varchar(60);
    DECLARE rev_direct_month numeric(10,2);
    DECLARE rev_direct_year numeric(10,2);
    DECLARE rev_indirect_month numeric(10,2);
    DECLARE rev_indirect_year numeric(10,2);
    SELECT username INTO vusername;
	CALL CheckForSession_Staf(token, vusername);
    IF (vusername IS NOT NULL) THEN
		SELECT airline_staff.airline_name
			FROM airline_staff
            WHERE airline_staff.username = username
            INTO myAirline;
		SELECT SUM(flight.base_price)
			FROM ticket
			LEFT JOIN flight
			ON ticket.flight_num = flight.flight_num
				AND ticket.airline_name = flight.airline_name
				AND ticket.dep_datetime = flight.dep_datetime
			WHERE ticket.airline_name = myAirline
				AND ticket.booking_agent_ID IS NOT NULL
				AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -30 DAY)
				AND ticket.sold_date <= current_timestamp()
			INTO rev_direct_month;
		SELECT SUM(flight.base_price)
			FROM ticket
			LEFT JOIN flight
			ON ticket.flight_num = flight.flight_num
				AND ticket.airline_name = flight.airline_name
				AND ticket.dep_datetime = flight.dep_datetime
			WHERE ticket.airline_name = myAirline
				AND ticket.booking_agent_ID IS NOT NULL
				AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -1 YEAR)
				AND ticket.sold_date <= current_timestamp()
			INTO rev_direct_year;
		SELECT SUM(flight.base_price)
			FROM ticket
			LEFT JOIN flight
			ON ticket.flight_num = flight.flight_num
				AND ticket.airline_name = flight.airline_name
				AND ticket.dep_datetime = flight.dep_datetime
			WHERE ticket.airline_name = myAirline
				AND ticket.booking_agent_ID IS NULL
				AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -30 DAY)
				AND ticket.sold_date <= current_timestamp()
			INTO rev_indirect_month;
		SELECT SUM(flight.base_price)
			FROM ticket
			LEFT JOIN flight
			ON ticket.flight_num = flight.flight_num
				AND ticket.airline_name = flight.airline_name
				AND ticket.dep_datetime = flight.dep_datetime
			WHERE ticket.airline_name = myAirline
				AND ticket.booking_agent_ID IS NULL
				AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -1 YEAR)
				AND ticket.sold_date <= current_timestamp()
			INTO rev_indirect_year;
		SELECT rev_direct_month, rev_direct_year, rev_indirect_month, rev_indirect_year;
	END IF;
end //
delimiter ;